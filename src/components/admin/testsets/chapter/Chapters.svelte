<script>
    import ChapterEditAndDelete from './ChapterEditAndDelete.svelte';
    import { sectionStore } from '../../../../store/section.js';
    import { chapterStore } from '../../../../store/chapter.js';

    import { createEventDispatcher, onMount } from 'svelte';

    export let testPackId;

    onMount(() => {
        selection();
    })

    let dispatch = createEventDispatcher();

    let selectedSection;
    let copiedChapters = [];

    function selection() {
        if($chapterStore) {
            copiedChapters = [];
            for (let i = 0; i < $chapterStore.length; i++) {
                if(selectedSection == $chapterStore[i]._id) {
                    copiedChapters = $chapterStore[i].chapters
                }                
            }
        }
    }
</script>

<style>
    h3 {
        margin-bottom: 3rem;
    }

    label {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }
</style>

<div class="container">
    <h3>Chapters in Database</h3>
    <div>
        <label for="sector">Select Section:</label>
        <select bind:value = {selectedSection}>
            {#if $sectionStore && $sectionStore.length !=0 }
                {#each $sectionStore as section}
                    <option value="{section._id}">{section.sectionTitle}</option>
                {/each}
            {/if}
        </select>
    </div>
    <div class="sectorContainer">
        {#if $chapterStore[selectedSection] && $chapterStore[selectedSection].length != 0}
            {#each $chapterStore[selectedSection] as chapter}
                <ChapterEditAndDelete 
                    {testPackId}
                    {chapter}
                    section = {selectedSection}
                    on:update
                    on:delete
                />
            {/each}
        {:else}
            <h3>There are no chapters to display</h3>
        {/if}
    </div>
</div>