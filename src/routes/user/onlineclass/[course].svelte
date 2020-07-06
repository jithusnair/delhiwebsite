<script context='module'>
    export async function preload({ params, query }) {
		const { course } = params;

		let buyNow = query.buy;

		let courseDoc;
		let dbVideoData;
		let purchased;

		let getError;

		await this.fetch(`/user/onlineclass/getvideos`,
		{	
			method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
			credentials: 'include',
			body: JSON.stringify({courseId:course})
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				dbVideoData = data.videos;
				courseDoc = data.course;
				purchased = data.purchased;
			}
			else if (data.err) {
                getError = data.err;
            }
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
		});

		if (dbVideoData) {
			return { dbVideoData, courseDoc, getError, buyNow, purchased }
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
	import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
	import BuyErrorModal from '../../../components/payment/BuyErrorModal.svelte';
	import BuySuccessModal from '../../../components/payment/BuySuccessModal.svelte';
	import Videos from '../../../components/user/videocourse/Videos.svelte';
	import DemoPlayr from '../../../components/user/videocourse/DemoPlayr.svelte';
	import BuyNowCard from '../../../components/user/videocourse/BuyNowCard.svelte';
	import Razorpay from '../../../components/payment/Razorpay.svelte';
	import Timer from '../../../components/ui/Timer.svelte';

	import moment from 'moment';
	import { onDestroy } from 'svelte';

	import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

	export let courseDoc;
	export let dbVideoData;
	export let purchased;

	export let buyNow;

	export let getError;

	let orderDetails;

	let razorpayError = false;

	// All the payment errors will be displayed with a modal
	let paymentErr = false; // other server errors
	let paymentProbMsg;
	let paymentFailRedirect;
	let displayPaymentModal= false;

	// payment success display control
	let displayPaymentSuccess;

	let launched;
	/* 
	launched is given defauly 10 seconds initially to avoid loading the videos initially
	until calculations are done after which duration may be any other value
	*/ 
	let timer = {
		days: '0',
		hours: '00',
		minutes: '00',
		seconds: '00'
	};
	let interval;
	countdown();

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

	$: if(buyNow) order();

	function order() {
		fetchWithTimeout(`user/payment/videocourse/${courseDoc._id}`, {
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
		fetchWithTimeout(`user/onlineclass/getvideos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
			credentials: 'include',
			body: JSON.stringify({courseId: courseDoc._id})
        },
        10000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				dbVideoData = data.videos;
				courseDoc = data.course;
				purchased = data.purchased;
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

	function countdown() {
		interval = setInterval(() => {
			launched = moment(courseDoc.launchDate).startOf('day') - moment();
			if(launched>0){
				let duration = moment.duration(launched);
				timer = {
					days: duration.days(),
					hours: duration.hours(),
					minutes: duration.minutes(),
					seconds: duration.seconds(),
				}
			}
			else if(interval) clearInterval(interval);
		}, 1000);
	}

	onDestroy(()=>{
		if(interval) {
			clearInterval(interval)
		}
	})
</script>

<svelte:head>
    <!-- Google Analytics  -->
    <!-- Event snippet for English Course Sale conversion page
	In your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button. -->
	<script>
		function gtag_report_conversion(url) {
			var callback = function () {
				if (typeof(url) != 'undefined') {
				    // window.location = url;
				}
			};
			gtag('event', 'conversion', {
				'send_to': 'AW-617566841/ZzLfCKf3gtYBEPmkvaYC',
				'transaction_id': '',
				'event_callback': callback
			});
			return false;
		}
	</script>
</svelte:head>

<style>
	.container {
		display: flex;
		align-items: flex-start;
	}

	h2 {
        margin: 2rem 10rem;
    }

	.videos {
		width: 70%;
	}

	.card {
		margin: auto;
	}

	@media only screen and (max-width: 1100px) {
		.container {
			flex-direction: column;
		}

        h2 {
        	margin: 2rem auto;
			text-align: center;
    	}

		.videos {
			width: 100%;
		}
    }
</style>

<div class="container">
	{#if launched != undefined}
		<div class='videos'>
			<h2>{courseDoc.courseTitle}</h2>
			<DemoPlayr videoLink={courseDoc.demoVideo} />
			{#if launched > 0}
				<h2>Classes Will Launch In</h2>
				<Timer {timer}/>
			{:else}
				<h2>Classes</h2>
				<Videos docs = {dbVideoData} />
			{/if}
		</div>
		{#if !purchased}
			<div class='card'>
				<BuyNowCard 
					data={courseDoc}
					on:click={order}
				/>
			</div>
		{/if}
	{/if}
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>

<ErrorSnackbar show={razorpayError}>
    <p>{razorpayError}</p>
</ErrorSnackbar>

<!-- Instantiate RazorPay component only if orderDetails exists -->
{#if orderDetails}
	<Razorpay
		{orderDetails}
		courseID = {courseDoc._id}
		collection = {'VideoCourseDetail'}
		on:success={()=> displayPaymentSuccess = true}
		on:fail={(event)=>{
			displayPaymentModal = true;
			paymentProbMsg = event.detail;
			paymentFailRedirect = `/user/onlineclass/${courseDoc._id}`;
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
	display = {displayPaymentSuccess}
	{orderDetails}
	courseTitle = {courseDoc.courseTitle}
	on:click={()=>{
		reloadPage();
		displayPaymentSuccess = false;
	}}
/>