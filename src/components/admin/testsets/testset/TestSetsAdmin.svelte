<script>
    import ManageableTestSet from './ManageableTestSet.svelte';
    import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';
    import Error from '../../../../components/ui/Error.svelte';
    import ErrorSnackbar from '../../../../components/ui/ErrorSnackbar.svelte';
    import EditModal from './EditModal.svelte';

    import { testSetStore } from '../../../../store/testset.js';
    import { chapterStore } from '../../../../store/chapter.js';
    import { sectionStore } from '../../../../store/section.js';
    
    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { flip } from 'svelte/animate';
    import { goto } from '@sapper/app'
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    export let testPackId;

    $: if(deleteError) {
        setTimeout(() => {
                deleteError = false;
            }, 10000);
    }

    let selectedSection;
    let selectedChapter;

    // Delete Part
    let displayDeleteConfirm;
    let deleteResponse;
    let deleteTestSetId;
    let deleteTestSetTitle;
    let deleteError;

    // Edit Part
    let displayEdit=false;
    let editTestSetDetail;

    function deleteTestSet(event) {
        deleteTestSetId = event.detail.id;
        deleteTestSetTitle = event.detail.testSetTitle;
        displayDeleteConfirm = true;
    }

    function deleteConfirmedOrCancelled(event) {
        displayDeleteConfirm = false;
        let data = {_id: deleteTestSetId}
        if (event.detail) {
            fetchWithTimeout(`/admin/testpacks/${testPackId}/testset_crud`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            },
            30000)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    deleteResponse = null;
                    deleteTestSetId = null;
                    deleteTestSetTitle = null;
                    dispatch('reloadData');
                }
                else if (data.err) {
                    deleteError = data.err;
                }
                else if (data.serverErr) {
                    deleteError = data.serverErr;
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    deleteError = 'Server taking too long to respond! Request Timed out';
                }
                else {
                    console.error('Error:', error);
                }
            });
        }
    }

    function editTestSet(event) {
        editTestSetDetail = event.detail;
        displayEdit = true;
    }

    function gotoQuestionPage(event) {
        goto(`/admin/testpacks/${testPackId}/${event.detail}`);
    }
</script>

<style>
    .blog-container {
        margin-top: 2rem;
    }

    label {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }

    .select {
        margin-left: 2rem;
    }
</style>

<div class="blog-container">
    <div class="select">
        <label>Section:</label>
        <select 
            bind:value={selectedSection} 
            on:change = {() => selectedChapter = $chapterStore[selectedSection][0]._id}
        >
            {#if $sectionStore && $sectionStore.length !=0 }
                {#each $sectionStore as section}
                    <option value="{section._id}">{section.sectionTitle}</option>
                {/each}
            {/if}
        </select>
        {#if selectedSection }
            <label>Chapter:</label>
            <select bind:value={selectedChapter}>
                {#each $chapterStore[selectedSection] as chapter}
                    <option value="{chapter._id}">{chapter.chapterTitle}</option>
                {/each}
            </select>
        {/if}
    </div>
    {#if $testSetStore[selectedChapter] && $testSetStore[selectedChapter].length != 0}
        {#each $testSetStore[selectedChapter] as testSet (testSet._id)}
            <div animate:flip={{duration:200}}>
                <ManageableTestSet
                    {testSet}
                    on:goto = {gotoQuestionPage}
                    on:testSetDelete = {deleteTestSet}
                    on:testSetEdit = {editTestSet}  
                />
            </div>
        {/each}
    {:else}
        <h3>There are no test sets in this chapter</h3>
    {/if}
</div>

<ConfirmDeleteModal 
    display = {displayDeleteConfirm} 
    testSetTitle = {deleteTestSetTitle}
    on:response = {deleteConfirmedOrCancelled}
/>

<EditModal
    display = {displayEdit}
    data = {editTestSetDetail}
    on:reloadData
    on:close = {() => displayEdit = false}
/>

<ErrorSnackbar show={deleteError}>
    <p>{deleteError}</p>
</ErrorSnackbar>