<script context='module'>
    export async function preload({ params, query }) {
		const { testpack } = params;

        let sections;
        let chaptersandtestsets;
        let testPack;
        let purchased;

        let buyNow = query.buy;

		return await this.fetch(`/user/tests/getTestSets?testpack=${testpack}`, {	
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
			credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                sections = [...data.sections];
                chaptersandtestsets = [...data.chaptersandtestsets];
                testPack = data.testPack;
                purchased = data.purchased;
                return {sections, chaptersandtestsets, testPack, purchased, buyNow};
			}
			else if (data.err) {
                this.error(404, 'Not Found');
            }
            else if(data.serverErr) {
                this.error(500, data.serverErr);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
		});
	}
</script>

<script>
    import {
        testPackStore,
        sectionStore,
        chapterStore,
        testSetsStore,
        chapterDisplayStore,
        testSetsDisplayStore,
        purchasedStore,
    } from '../../../store/testsets-controller-user.js';
    import Master from '../../../components/user/testset/Master.svelte';
    import Razorpay from '../../../components/payment/Razorpay.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
	import BuyErrorModal from '../../../components/payment/BuyErrorModal.svelte';
    import BuySuccessModal from '../../../components/payment/BuySuccessModal.svelte';
    
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { onMount } from 'svelte';

    export let sections;
    export let chaptersandtestsets;
    export let testPack;

    export let purchased;

    export let buyNow;

    let orderDetails;

    let getError;

	let razorpayError = false;

	// All the payment errors will be displayed with a modal
	let paymentErr = false; // other server errors
	let paymentProbMsg;
	let paymentFailRedirect;
	let displayPaymentModal= false;

    // payment success display control
    let displayPaymentSuccess;
    
    $: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}

	$: if(razorpayError) {
		setTimeout(() => {
                razorpayError = false;
            }, 10000);
	}


    onMount(()=>{
        unravelData();
    });

    function unravelData() {
        purchasedStore.set(purchased);
        testPackStore.set(testPack);
        sectionStore.set(sections);

        let testSets = {};
        for (let j = 0; j < chaptersandtestsets.length; j++) {
            testSets[chaptersandtestsets[j]._id] = chaptersandtestsets[j].testSets
            delete chaptersandtestsets[j].testSets
        }

        let chapters = {};
        for (let i = 0; i < sections.length; i++) {
            chapters[sections[i]._id] = 
                chaptersandtestsets.filter((chapter) => chapter.sectionId === sections[i]._id);
        }
        chapterStore.set(chapters);
        testSetsStore.set(testSets);
        chapterDisplayStore.set($chapterStore[$sectionStore[0]._id]);
        testSetsDisplayStore.set($testSetsStore[$chapterDisplayStore[0]._id]);
    }

    function order() {
		fetchWithTimeout(`/user/payment/testpack/${testPack._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        10000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				orderDetails = data.data;
            }
            else if (data.err) {
				razorpayError = data.err;
			}
			else if (data.serverErr) {
				razorpayError = data.serverErr;
			}
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                getError = 'Server taking too long to respond! Request timed out';
			}
            console.error('Error:', error);
        });
    }
    
    function reloadPage() {
        fetchWithTimeout(`/user/tests/getTestSets?testpack=${testPack._id}`, {	
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
			credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                sections = [...data.sections];
                chaptersandtestsets = [...data.chaptersandtestsets];
                testPack = data.testPack;
                purchased = data.purchased;
                unravelData();
			}
			else if (data.err) {
                getError = data.err;
            }
            else if(data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
		});
    }

	$: if(buyNow) order();
</script>

{#if $sectionStore && $sectionStore.length != 0}
    <Master
        on:buy={order}
        on:unlock={order}
    />
{/if}

<!-- Instantiate RazorPay component only if orderDetails exists -->
{#if orderDetails}
	<Razorpay
		{orderDetails}
		courseID = {testPack._id}
		collection = {'TestPack'}
		on:success={()=> displayPaymentSuccess = true}
		on:fail={(event)=>{
			displayPaymentModal = true;
			paymentProbMsg = event.detail;
			paymentFailRedirect = `/user/tests/${testPack._id}`;
		}}
		on:error={(event)=>{
			displayPaymentModal = true;
			paymentErr = true;
			paymentProbMsg = event.detail;
		}}
	/>
{/if}

<BuyErrorModal
	error = {paymentErr}
	display = {displayPaymentModal}
	message = {paymentProbMsg}
	redirect = {paymentFailRedirect}
/>

<BuySuccessModal
    collection = {"testpack"}
	display = {displayPaymentSuccess}
	{orderDetails}
	courseTitle = {testPack.testPackTitle}
	on:click={()=>{
		reloadPage();
		displayPaymentSuccess = false;
	}}
/>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>

<ErrorSnackbar show={razorpayError}>
    <p>{razorpayError}</p>
</ErrorSnackbar>