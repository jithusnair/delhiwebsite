<script>
    import SaveIndicator from '../../ui/SaveIndicator.svelte';
    import Error from '../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let sector;

    let updateError = false;
    let deleteError = false;
    
    let editMode;
    let sectorCopy;

    $: if(editMode) {
        let copy = {...sector};
        sectorCopy = String(copy.sectorTitle);
    }

    function update() {
        let fetchOptions;

        fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({_id: sector._id, sectorTitle:sectorCopy}),
        };
        
		fetchWithTimeout('/admin/sectors/sector_crud', fetchOptions,
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

    function deleteSector() {
        let fetchOptions;

        fetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({data: sector}),
        };
        
		fetchWithTimeout('/admin/sectors/sector_crud', fetchOptions,
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

    function cleanUp() {
        sectorCopy = null;
    }
</script>

<style>
    .sector {
		width: 300px;
		border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		text-align: left;
        padding: 1rem;
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

<div class="sector">
    {#if !editMode}
        <div class="display">
            <h3>{sector.sectorTitle} 
            </h3>
            <div class="icons">
                <i
                    id="edit"
                    on:click = {() => editMode = true}
                    class="fa fa-pencil-square" aria-hidden="true">
                </i>
                <i
                    id="delete"
                    on:click = {deleteSector}
                    class="fa fa-trash" aria-hidden="true">
                </i>
            </div>
        </div>
    {:else}
        <div class="input">
            <input 
                value = {sectorCopy}
                type="text"
                on:input = {(event)=> sectorCopy = event.target.value}
                placeholder="Type in the sector name">
            <button on:click={update}>Save</button>
            <button on:click={()=> editMode = false}>Cancel</button>
        </div>
    {/if}
</div>