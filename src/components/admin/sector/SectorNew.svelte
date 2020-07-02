<script>
    import SaveIndicator from '../../ui/SaveIndicator.svelte';
    import Error from '../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    let sectorTitle = ''

    let saving = false;
    let saveError = false;

    function save() {
        saving = true;

        let fetchOptions;
    
        fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({sectorTitle: sectorTitle}),
        };
        
		fetchWithTimeout('/admin/sectors/sector_crud', fetchOptions,
        30000)
        .then(response => {
			saving = false;
			return response.json();
		})
        .then(data => {
            if(data.success) {
                cleanUp();
                dispatch('save')
            }
            else if (data.err) {
                saveError = data.err;
            }
            else if (data.serverErr){
                saveError = data.serverErr;
            }
        })
        .catch((error) => {
            saving = false;
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }

    function cleanUp() {
        sectorTitle = '';
    }
</script>

<style>
    .input {
        margin-top: 2rem;
    }

    input {
        margin-right: 1rem;
    }
</style>

<div>
    <h3>New Sector</h3>
    <p>A sector is basically the name of a collection of exams. <br>
    For example, exams like CHSL, CGL etc come under SSC. So the sector name may be given as "SSC". <br>
    Another example would be SBI PO, SBI Clerk etc. coming under "Banking"</p>
    <div class="input">
        <Error showErr={saveError? true: false}>
            <p class="error-message">{saveError}</p>
        </Error>
        <input 
            bind:value = {sectorTitle}
            type="text"
            placeholder="Type in the sector name">
        <button on:click={save}>Save to database</button>
        {#if saving}
            <SaveIndicator/>
        {/if}
    </div>
</div>
