<script>
    import ManageableCard from './ManageableCard.svelte';
    import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';
    import Error from '../../../components/ui/Error.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
    import EditModal from './EditModal.svelte';
    
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { flip } from 'svelte/animate';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let docs;

    $: if(deleteError) {
        setTimeout(() => {
                deleteError = false;
            }, 10000);
    }

    // Delete Part
    let displayDeleteConfirm;
    let deleteResponse;
    let deleteCourseId;
    let deleteCourseTitle;
    let deleteError;

    // Edit Part
    let displayEdit=false;
    let editCourseDetail;

    function deleteCourse(event) {
        deleteCourseId = event.detail.id;
        deleteCourseTitle = event.detail.courseTitle;
        displayDeleteConfirm = true;
    }

    function deleteConfirmedOrCancelled(event) {
        displayDeleteConfirm = false;
        let data = {_id: deleteCourseId}
        if (event.detail) {
            fetchWithTimeout('/admin/videocourses/videocourse_crud', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify(data),
            },
            10000)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    deleteResponse = null;
                    deleteCourseId = null;
                    deleteCourseTitle = null;
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
        grid-template-columns: 300px 300px 300px;
        grid-auto-rows: 450px;
        grid-auto-flow: dense;
    }

    @media only screen and (max-width: 1000px) {
        .blog-container {
            grid-template-columns: 300px 300px;
        }
    }

    @media only screen and (max-width: 670px) {
        .blog-container {
            grid-template-columns: 300px;
        }
    }
</style>

<div class="blog-container">
    {#if docs}
        {#each docs as data (data._id)}
        <div animate:flip={{duration:200}}>
            <ManageableCard
                {data}
                on:cardDelete={deleteCourse}
                on:cardEdit={editCourse}                
            />
        </div>
        {/each}
    {/if}
</div>

<ConfirmDeleteModal 
    display = {displayDeleteConfirm} 
    courseTitle = {deleteCourseTitle}
    on:response = {deleteConfirmedOrCancelled}
/>

<EditModal
    display = {displayEdit}
    data = {editCourseDetail}
    on:reloadData
    on:close = {() => displayEdit = false}
/>

<ErrorSnackbar show={deleteError}>
    <p>{deleteError}</p>
</ErrorSnackbar>