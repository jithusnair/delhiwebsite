<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';
    import { sectionStore } from '../../../../store/section.js';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let testPackId;

    let chapters = ['',];

    let selectedSection;

    let saving = false;
    let saveError = false;

    function addChapters() {
        chapters = chapters.concat('');
    }

    function removeChapter(i) {
        if(chapters.length != 1) {
            chapters = chapters.filter((value, index)=>{
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
            body: JSON.stringify({chapters: chapters, sectionId: selectedSection}),
        };
        
		fetchWithTimeout(`/admin/testpacks/${testPackId}/chapter_crud`, fetchOptions,
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
        chapters = [''];
        selectedSection = null;
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
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    i {
        cursor: pointer;
    }

    #minus:hover {
        color: red;
    }
</style>

<div class="container">
    <h3>New Chapters</h3>
    <div class="input">
        <Error showErr={saveError? true: false}>
            <p class="error-message">{saveError}</p>
        </Error>
        <div id="add">
            <i on:click = {addChapters} id="plus" class="fa fa-plus-circle"></i>
            <div>
                <label for="sector">Chapters belong to Section:</label>
                <select bind:value={selectedSection}>
                    {#if $sectionStore && $sectionStore.length !=0 }
                        {#each $sectionStore as section}
                            <option value="{section._id}">{section.sectionTitle}</option>
                        {/each}
                    {/if}
                </select>
            </div>
        </div>
        {#each chapters as chapter, i}
            <div class="labelsandinputs">
                <label>Chapter:</label>
                <input 
                    value = {chapters[i]}
                    on:input = {(event) => chapters[i] = event.target.value}
                    type="text"
                    placeholder="Type in the chapter name"
                >
                <i 
                    id="minus" 
                    on:click = {()=> removeChapter(i)} 
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
