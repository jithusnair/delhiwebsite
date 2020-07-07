<script>
    import ManageableTestPack from './ManageableTestPack.svelte';
    import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';
    import Error from '../../../components/ui/Error.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
    import EditModal from './EditModal.svelte';
    
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { flip } from 'svelte/animate';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let testpacks;
    export let exams;

    $: if(deleteError) {
        setTimeout(() => {
                deleteError = false;
            }, 10000);
    }

    // Delete Part
    let displayDeleteConfirm;
    let deleteResponse;
    let deleteTestPackId;
    let deleteTestPackTitle;
    let deleteError;

    // Edit Part
    let displayEdit=false;
    let editCourseDetail;

    function deleteTestPack(event) {
        deleteTestPackId = event.detail.id;
        deleteTestPackTitle = event.detail.TestPackTitle;
        displayDeleteConfirm = true;
    }

    function deleteConfirmedOrCancelled(event) {
        displayDeleteConfirm = false;
        let data = {_id: deleteTestPackId}
        if (event.detail) {
            fetchWithTimeout('/admin/testpacks/testpack_crud', {
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
                    deleteTestPackId = null;
                    deleteTestPackTitle = null;
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

    function editCourse(event) {
        editCourseDetail = event.detail;
        displayEdit = true;
    }
</script>

<style>
    .blog-container {
        margin-top: 2rem;
        display: grid;
        grid-gap: 5rem;
        justify-content: center;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-auto-flow: dense;
    }

</style>

<div class="blog-container">
    {#if testpacks}
        {#each testpacks as testpack (testpack._id)}
            <div animate:flip={{duration:200}}>
                <ManageableTestPack
                    {testpack}
                    on:cardDelete = {deleteTestPack}
                    on:cardEdit = {editCourse}
                    on:publish                
                />
            </div>
        {/each}
    {/if}
</div>

<ConfirmDeleteModal 
    display = {displayDeleteConfirm} 
    testPackTitle = {deleteTestPackTitle}
    on:response = {deleteConfirmedOrCancelled}
/>

<EditModal
    {exams}
    display = {displayEdit}
    data = {editCourseDetail}
    on:reloadData
    on:close = {() => displayEdit = false}
/>

<ErrorSnackbar show={deleteError}>
    <p>{deleteError}</p>
</ErrorSnackbar>