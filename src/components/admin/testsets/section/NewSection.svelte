<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let testPackId;

    let sections = ['',];

    let saving = false;
    let saveError = false;

    function addSections() {
        sections = sections.concat('');
    }

    function removeSection(i) {
        if(sections.length != 1) {
            sections = sections.filter((value, index)=>{
                return index != i;
            })
        }        
    }

    function save() {
        saving = true;

        let fetchOptions;
    
        fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({sections: sections}),
        };
        
		fetchWithTimeout(`/admin/testpacks/${testPackId}/section_crud`, fetchOptions,
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
        sections = [''];
    }
</script>

<style>
    .container {
        margin: 1rem auto;
    }

    .input {
        width: 100%;
    }

    input {
        margin: auto 1rem;
    }

    label {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }

    i {
        font-size: 4rem;
    }

    #plus:hover {
        color: darkgreen;
    }

    i, button, h3 {
        margin: 1rem 2rem;
    }

    .labelsandinputs {
        display: flex;
        align-items: center;
        margin: 1rem 2rem;
    }

    #add {
        width: min-content;
    }

    i {
        cursor: pointer;
    }

    #minus:hover {
        color: red;
    }
</style>

<div class="container">
    <h3>New Sections</h3>
    <div class="input">
        <Error showErr={saveError? true: false}>
            <p class="error-message">{saveError}</p>
        </Error>
        <div id="add" on:click = {addSections}>
            <i id="plus" class="fa fa-plus-circle"></i>
        </div>
        {#each sections as section, i}
            <div class="labelsandinputs">
                <label>Section:</label>
                <input 
                    value = {sections[i]}
                    on:input = {(event) => sections[i] = event.target.value}
                    type="text"
                    placeholder="Type in the section"
                >
                <i 
                    id="minus" 
                    on:click = {()=> removeSection(i)} 
                    class="fa fa-minus-circle">
                </i>
            </div>
        {/each}
        {#if saving}
            <SaveIndicator/>
        {/if}
    </div>
    <button on:click={save}>Save to database</button>
</div>
