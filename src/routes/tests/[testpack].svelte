<script context='module'>
    export async function preload({ params, query }) {
		const { testpack } = params;

        let sections;
        let chaptersandtestsets;
        let testPack;

		return await this.fetch(`/tests/getTestSets?testpack=${testpack}`, {	
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
                return {sections, chaptersandtestsets, testPack};
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
        testSetsDisplayStore
    } from '../../store/testsets-controller.js';
    import Master from '../../components/testset/Master.svelte';
    import NavPlusLoginSignup from '../../components/NavPlusLoginSignup.svelte';

    import { onMount } from 'svelte';

    export let sections;
    export let chaptersandtestsets;
    export let testPack;

    let displayLogIn = false;
	let displaySignUp = false;

	let buy = false;

	let redirection;

    onMount(()=>{
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
        testPackStore.set(testPack);
        sectionStore.set(sections);
        chapterStore.set(chapters);
        testSetsStore.set(testSets);
        chapterDisplayStore.set($chapterStore[$sectionStore[0]._id]);
        testSetsDisplayStore.set($testSetsStore[$chapterDisplayStore[0]._id]);
    });

    function buyNow() {
		buy = true;
		redirection = `/user/tests/${$testPackStore._id}?buy=${buy}`
		displaySignUp = true;
	}
</script>

{#if $sectionStore && $sectionStore.length != 0}
    <Master
        on:buy={buyNow}
        on:unlock={buyNow}
    />
{/if}

<NavPlusLoginSignup
	{redirection}
    {displayLogIn}
    {displaySignUp}
    on:navlogin={() => displayLogIn = true}
    on:signupopen = { () => {
        displayLogIn = false;
        displaySignUp = true;
    }}
    on:loginclose={() => displayLogIn = false}
    on:loginopen = { () => {
        displaySignUp = false;
        displayLogIn = true;
    }}
    on:signupclose={() => displaySignUp = false}
/>