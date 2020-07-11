<script context='module'>
    export async function preload({ params }) {
		const { testpack } = params;

        let sections;
        let testPack;

		await this.fetch(`/admin/testpacks/${testpack}/section_crud`,
		{
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
		})
		.then(response => response.json())
		.then(data => {
            sections = data.sections;
            testPack = data.testPack;
        })

		if (testPack) {
			return { sections, testPack }
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
    import SectionMaster from '../../../../components/admin/testsets/section/SectionMaster.svelte';
    import ChapterMaster from '../../../../components/admin/testsets/chapter/ChapterMaster.svelte';
    import TestSetMaster from '../../../../components/admin/testsets/testset/TestSetMaster.svelte';
    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';
    import { sectionStore } from '../../../../store/section.js';
    import { chapterStore } from '../../../../store/chapter.js';

    import { onMount } from 'svelte';

    export let sections;
    export let testPack;

    onMount(() => {
        sectionStore.set(sections);
    })

    function getSections() {
        fetchWithTimeout(`/admin/testpacks/${testPack._id}/section_crud`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                sections = data.sections;
                sectionStore.set(sections);
            }
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                getError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }
</script>

<style>
    h2 {
        margin: auto 2rem;
    }
</style>

<h2>{testPack.testPackTitle}</h2>

<SectionMaster
    testPackId = {testPack._id}
    on:save = {() => getSections()}
    on:update = {() => getSections()}
    on:delete = {() => getSections()}
/>

{#if $sectionStore}
    <ChapterMaster
        testPackId = {testPack._id}
    />
{/if}

{#if $chapterStore}
    <TestSetMaster
        testPackId = {testPack._id}
    />
{/if}