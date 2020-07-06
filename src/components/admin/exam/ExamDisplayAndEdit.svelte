<script>
    import ExamDisplay from './ExamDisplay.svelte';
    import ExamEdit from './ExamEdit.svelte';
    import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';
    import ErrorSnackbar from '../../ui/ErrorSnackbar.svelte';
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    export let exam;
    export let sectors;

    let dispatch = createEventDispatcher();
    
    let editMode = false;
    let displayDeleteModal = false;

    let deleteError;

    function deleteConfirmedOrCancelled(event) {
        displayDeleteModal = false;
        let data = {_id: exam._id}
        if (event.detail) {
            fetchWithTimeout('/admin/exams/exam_crud', {
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
                    dispatch('delete');
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
</script>


{#if !editMode}
    <ExamDisplay 
        examData = {exam}
        on:edit = {() => editMode = true}
        on:delete = {() => displayDeleteModal = true}
    />
{:else}
    <ExamEdit 
        {sectors}
        examData = {exam}
        on:update =  {() => {
            editMode = false;
            dispatch('update');
        }}
        on:delete
        on:cancel = {() => editMode = false}
    />
{/if}


<ConfirmDeleteModal 
    display = {displayDeleteModal}
    examTitle = {exam.examTitle}
    on:response = {deleteConfirmedOrCancelled}
/>

<ErrorSnackbar show = {deleteError? true: false}>
    {deleteError}
</ErrorSnackbar>
