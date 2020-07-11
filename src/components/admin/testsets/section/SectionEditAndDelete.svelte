<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';
    import ConfirmDeleteSectionModal from './ConfirmDeleteSectionModal.svelte';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let section;
    export let testPackId;

    let updateError = false;
    let deleteError = false;
    
    let editMode;
    let sectionCopy;

    let displayDeleteModal = false;
    let deleteConfirmedOrCancelled = false;

    $: if(editMode) {
        let copy = {...section};
        sectionCopy = String(copy.sectionTitle);
    }

    function update() {
        let fetchOptions;

        fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({_id: section._id, sectionTitle: sectionCopy}),
        };
        
		fetchWithTimeout(`/admin/testpacks/${testPackId}/section_crud`, fetchOptions,
        30000)
        .then(response => {
			return response.json();
		})
        .then(data => {
            if(data.success) {
                editMode = false;
                cleanUp();
                dispatch('update')
            }
            else if (data.err) {
                updateError = data.err;
            }
            else if (data.serverErr){
                updateError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                updateError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }

    function deleteSection(event) {
        displayDeleteModal = false;
        if(event.detail) {
            let fetchOptions;

            fetchOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({...section}),
            };
            
            fetchWithTimeout(`/admin/testpacks/${testPackId}/section_crud`, fetchOptions,
            30000)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if(data.success) {
                    cleanUp();
                    dispatch('delete')
                }
                else if (data.err) {
                    deleteError = data.err;
                }
                else if (data.serverErr){
                    deleteError = data.serverErr;
                }
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    deleteError = 'Server taking too long to respond! Request timed out';
                }
                console.error('Error:', error);
            });
        }   
    }

    function cleanUp() {
        sectionCopy = null;
    }
</script>

<style>
    .section {
		width: 300px;
		border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		text-align: left;
        padding: 1rem;
        margin: 1rem auto;
    }

    i {
        margin: 0 0.5rem;
        font-size: 2rem;
    }

    i:hover {
        cursor: pointer;
    }

    #edit:hover {
        color: var(--blue);
    }

    #delete:hover {
        color: red;
    }

    input {
        width: 150px;
    }

    .display {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    button {
        background: none;
        color: black;
        border-radius: 0;
        box-shadow: none;
        width: auto;
        padding: 0;
        margin: 0 1rem;
    }
</style>

<div class="section">
    {#if !editMode}
        <div class="display">
            <h4>{section.sectionTitle} 
            </h4>
            <div class="icons">
                <i
                    id="edit"
                    on:click = {() => editMode = true}
                    class="fa fa-pencil-square" aria-hidden="true">
                </i>
                <i
                    id="delete"
                    on:click = {() => displayDeleteModal = true }
                    class="fa fa-trash" aria-hidden="true">
                </i>
            </div>
        </div>
    {:else}
        <div class="input">
            <input 
                value = {sectionCopy}
                type="text"
                on:input = {(event)=> sectionCopy = event.target.value}
                placeholder="Type in the section name">
            <button on:click={update}>Save</button>
            <button on:click={()=> editMode = false}>Cancel</button>
        </div>
    {/if}
</div>

<ConfirmDeleteSectionModal 
    display = {displayDeleteModal}
    sectionTitle = {section.sectionTitle}
    on:response = {deleteSection}
/>