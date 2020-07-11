<script>
    import NewChapter from './NewChapter.svelte';
    import Chapters from './Chapters.svelte';
    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';
    import { chapterStore } from '../../../../store/chapter.js';

    import { onMount } from 'svelte';

    export let testPackId;

    onMount(() => {
        getChapters();
    })

    let sectionsandchapters;
       
    function getChapters() {
        fetchWithTimeout(`/admin/testpacks/${testPackId}/chapter_crud`, {
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
                sectionsandchapters = data.sectionsandchapters;
                unravel();
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

    function unravel() {
        chapterStore.set({});
        for (let i = 0; i < sectionsandchapters.length; i++) {
            chapterStore.update(chapterObject => {
                let copy = {...chapterObject};
                copy[sectionsandchapters[i]._id] = sectionsandchapters[i].chapters;
                return copy;
            })
        }
    }
</script>

<style>
    .topContainer {
		width: 100%;
		margin: 2rem auto 2rem auto;
		display: flex;
		justify-content: space-evenly;
		border-top: grey solid 1px;
    }

	.lefthalf, .righthalf {
		width: 50%;
		text-align: center;
		height: auto;
		border-bottom: 1px solid black; 
	}

	.righthalf {
		border-left: 1px solid black;
	}
</style>

<div class="topContainer">
	<div class="lefthalf">
        <NewChapter
            {testPackId}
			on:save = {getChapters}
		/>
	</div>

	<div class="righthalf">
        {#if $chapterStore != 0}
            <Chapters
                {testPackId}
                on:update = {getChapters}
                on:delete = {getChapters}
            />
        {/if}
	</div>
</div>