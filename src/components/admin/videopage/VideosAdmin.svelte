<script>
    import ManageableVideo from './ManageableVideo.svelte';
    import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';
    import Error from '../../../components/ui/Error.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
    import EditModal from './EditModal.svelte';
    
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { flip } from 'svelte/animate';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let docs;
    export let courseId;

    $: if(deleteError) {
        setTimeout(() => {
                deleteError = false;
            }, 10000);
    }

    // Delete Part
    let displayDeleteConfirm;
    let deleteResponse;
    let deleteVideoId;
    let deleteVideoTitle;
    let deleteError;

    // Edit Part
    let displayEdit=false;
    let editVideoDetail;

    function deleteVideo(event) {
        deleteVideoId = event.detail.id;
        deleteVideoTitle = event.detail.title;
        displayDeleteConfirm = true;
    }

    function deleteConfirmedOrCancelled(event) {
        displayDeleteConfirm = false;
        let data = {_id: deleteVideoId}
        if (event.detail) {
            fetchWithTimeout(`/admin/videocourses/${courseId}/video_crud`, {
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
                    deleteVideoId = null;
                    deleteVideoTitle = null;
                    dispatch('reloadData');
                }
                else if (data.err) {
                    // need to display error better
                    deleteError = data.err;
                }
                else if (data.serverErr) {
                    // need to display server error better
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

    function editVideo(event) {
        editVideoDetail = event.detail;
        displayEdit = true;
    }
</script>

<style>
    .blog-container {
        margin-top: 2rem;
        display: grid;
        grid-gap: 5rem;
        width: 75%;
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
            <div animate:flip={{duration:100}}>
                <ManageableVideo
                    {data}
                    on:videoDelete={deleteVideo}
                    on:videoEdit={editVideo}                
                />
            </div>
        {/each}
    {/if}
</div>

<ConfirmDeleteModal 
    display = {displayDeleteConfirm} 
    videoTitle = {deleteVideoTitle}
    on:response = {deleteConfirmedOrCancelled}
/>

<EditModal
    display = {displayEdit}
    data = {editVideoDetail}
    on:reloadData
    on:close = {() => displayEdit = false}
/>

<ErrorSnackbar show={deleteError}>
    <p>{deleteError}</p>
</ErrorSnackbar>