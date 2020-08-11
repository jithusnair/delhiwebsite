<script>
    import {
        sectionStore,
        chapterStore,
        testSetsStore,
        chapterDisplayStore,
        testSetsDisplayStore
    } from '../../../store/testsets-controller-user.js';

    let selectedSection = $sectionStore[0]._id;;
    let selectedChapter = $chapterStore[selectedSection][0]._id;

    let rotate = false;
    let showFilter = false;

    function sectionChange() {
        if($chapterStore[selectedSection][0]) {
            selectedChapter = $chapterStore[selectedSection][0]._id;
            chapterDisplayStore.set($chapterStore[selectedSection]);
            testSetsDisplayStore.set($testSetsStore[selectedChapter]);
        } 
        else {
            chapterDisplayStore.set(0);
            testSetsDisplayStore.set(0);
        }
    }

    function chapterChange() {
        testSetsDisplayStore.set($testSetsStore[selectedChapter]);
    }

    function filterIconClick() {
        rotate = !rotate;
        showFilter = !showFilter;
    }
</script>

<style>
    .practice-filter {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    .filter-div h4 {
        font-size: 1.8rem;
    }

    .dropdown {
        margin-top: 1rem;
        width:20rem;
    }

    .filter-div {
        display: flex;
        flex-direction: column;
    }

    @media screen and (max-width:970px) {
        .practice-filter{
            flex-direction: column;
        }

        .showFilter{
            display: block;
            opacity: 1;
        }

        .dropdown{
            min-width:20rem;
            width:40vw;
        }
    }
</style>


<div class="practice-filter" class:showFilter>
    <div class="filter-div">
        <h4>Part</h4>
        <select class="dropdown" bind:value={selectedSection} on:change={sectionChange}>
            {#each $sectionStore as section}
                <option value={section._id}>{section.sectionTitle}</option>
            {/each}
        </select>
    </div>

    {#if $chapterDisplayStore && $chapterDisplayStore.length != 0 }
        <div class="filter-div">
            <h4>Test Sets</h4>
            <select class="dropdown" bind:value={selectedChapter} on:change={chapterChange}>
                {#each $chapterDisplayStore as chapter}
                    <option value={chapter._id}>{chapter.chapterTitle}</option>
                {/each}
            </select>
        </div>
    {/if}
</div>