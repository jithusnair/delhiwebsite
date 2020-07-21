<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let testPackId;
    export let testSetId;

    let subjects = ['',];

    let saving = false;
    let saveError = false;

    function addSubjects() {
        subjects = subjects.concat('');
    }

    function removeSubject(i) {
        if(subjects.length != 1) {
            subjects = subjects.filter((value, index)=>{
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
            body: JSON.stringify({subjects: subjects}),
        };
        
        fetchWithTimeout(`/admin/testpacks/${testPackId}/${testSetId}/subject_crud`, 
        fetchOptions, 30000)
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
        subjects = [''];
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

    button:disabled {
        background: darkgrey;
        cursor: default;
    }
</style>

<div class="container">
    <h3>New Subjects</h3>
    <div class="input">
        <Error showErr={saveError? true: false}>
            <p class="error-message">{saveError}</p>
        </Error>
        <div id="add" on:click = {addSubjects}>
            <i id="plus" class="fa fa-plus-circle"></i>
        </div>
        {#each subjects as subject, i}
            <div class="labelsandinputs">
                <label>Subject:</label>
                <input 
                    value = {subjects[i]}
                    on:input = {(event) => subjects[i] = event.target.value}
                    type="text"
                    placeholder="Type in the subject"
                >
                <i 
                    id="minus" 
                    on:click = {()=> removeSubject(i)} 
                    class="fa fa-minus-circle">
                </i>
            </div>
        {/each}
        {#if saving}
            <SaveIndicator/>
        {/if}
    </div>
    <button disabled = {subjects[0].length == 0} on:click={save}>Save to database</button>
</div>
