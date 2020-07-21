<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';
    import { sectionStore } from '../../../../store/section.js';
    import { chapterStore } from '../../../../store/chapter.js';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    import moment from 'moment';
    
    const dispatch = createEventDispatcher();

    export let editData = false;
    export let testPackId;
    
    let id;

	let testSetTitle = '';
    let examDuration = ''; // in minutes
    let totalMarks = '';
    let totalQuestions = '';
    let negativeMarks = '';

    let selectedSection;
    let selectedChapter;

    $: validInputs = testSetTitle && 
        examDuration && 
        totalMarks && 
        totalQuestions && 
        negativeMarks;

    let saving = false;

    let data = {};

    if(editData) {
        data = Object.assign({}, editData);
        id = data._id;
        selectedSection = data.section;
        selectedChapter = data.chapter;
	    testSetTitle = data.testSetTitle;
        examDuration = data.examDuration; // in minutes
        totalMarks = data.totalMarks;
        totalQuestions = data.totalQuestions;
        negativeMarks = data.negativeMarks;
    }
    
    let saveError;
    
    $:  if(saveError) {
            setTimeout(() => {
                saveError = false;
            }, 10000);
        }

    function onChange() {        
        if(editData) {
            data._id = id;
            data.sectionId = selectedSection;
            data.chapterId = selectedChapter;
            data.testSetTitle = testSetTitle;
            data.examDuration = examDuration;
            data.totalMarks = totalMarks;
            data.totalQuestions = totalQuestions;
            data.negativeMarks = negativeMarks;
        }
        else {
            data.sectionId = selectedSection;
            data.chapterId = selectedChapter;
            data.testSetTitle = testSetTitle;
            data.examDuration = examDuration;
            data.totalMarks = totalMarks;
            data.totalQuestions = totalQuestions;
            data.negativeMarks = negativeMarks;
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
            body: JSON.stringify(data),
        };

		fetchWithTimeout(`/admin/testpacks/${testPackId}/testset_crud`, fetchOptions,
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
	    testSetTitle = '';
        examDuration = ''; // in minutes
        totalMarks = '';
        totalQuestions = '';
        negativeMarks = '';
    }

    function updateTestSet() {
        let fetchOptions;

        fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        };

        fetchWithTimeout(`/admin/testpacks/${testPackId}/testset_crud`, fetchOptions,
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                cleanUp();
                dispatch('editSuccess');
                dispatch('close');
            }
            else if (data.err) {
                saveError = data.err;
            }
            else if (data.serverErr) {
                saveError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }

    function cancel() {
        dispatch('close');
        cleanUp();
    }
</script>

<style>
    .btns {
       text-align: center;
    }

    #ok {
        margin: 1rem;
        width: 100px;
        text-align:center;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        background: #3D0CFF;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
    }

    #cancel {
        margin: 1rem;
        width: 100px;
        text-align:center;
        color: black;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        background: white;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
    }

    #cancel:hover {
        background: #3D0CFF;
        color: white;
    }

    .new-course-input {
        position: relative;
        width: 520px;
        overflow: scroll;
		margin: 1rem auto;
        padding: 0 2rem;
	}

    .feature-input {
		margin: 1rem auto;
	}

    .feature-input label {
		font-size: 1.5rem;
        margin-right: 1.5rem;
	}

	#courseTitle {
		margin-bottom: 1rem
	}

    .saving {
        display: flex;
        justify-content: flex-start;
    }

    .error-message {
        font-size: 1.2rem;
    }

    #featuresTitle {
        margin-top: 1rem;
    }

    span{
        color: red;
    }

    button:disabled {
        background: darkgrey;
        cursor: default;
    }

    label {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }
</style>

<div class="new-course-input">
    <Error showErr={saveError? true: false}>
        <p class="error-message">{saveError}</p>
    </Error>
    <h3 id="courseTitle">Test Set Title<span>*</span></h3>
    <input 
        bind:value = {testSetTitle}
        on:input={onChange} 
        id="courseTitleInput" 
        type="text"
        placeholder="Type in the Test Pack Title">
    
    <h4 for="sector">Testset belongs to Section and Chapters:</h4>
    <label>Section:</label>
    <select 
        bind:value={selectedSection} 
        on:change = {()=> {
            selectedChapter = $chapterStore[selectedSection][0]._id;
            onChange();
            }
        }
        >
        {#if $sectionStore && $sectionStore.length !=0 }
            {#each $sectionStore as section}
                <option value="{section._id}">{section.sectionTitle}</option>
            {/each}
        {/if}
    </select>
    {#if selectedSection }
        <label>Chapter:</label>
        <select bind:value={selectedChapter} on:change = {onChange}>
            {#each $chapterStore[selectedSection] as chapter}
                <option value="{chapter._id}">{chapter.chapterTitle}</option>
            {/each}
        </select>
    {/if}
    
    <h3 id="featuresTitle">Exam Details</h3>
    <div class="feature-input">
        <label for="feature1">Exam Duration: </label>
        <input 
            bind:value={examDuration}
            on:input={onChange}
            id="feature1" 
            type="text" 
            placeholder="Exam duration in Minutes"
        >
    </div>
    <div class="feature-input">
        <label for="feature2">Total Marks:</label>
        <input 
            bind:value={totalMarks}
            on:input={onChange} 
            id="feature2" 
            type="text" 
            placeholder="Total Marks"
        >
    </div>
    <div class="feature-input">
        <label for="feature3">Total Questions:</label>
        <input 
            bind:value={totalQuestions}
            on:input={onChange} 
            id="feature3" 
            type="text" 
            placeholder="Total Number of Questions"
        >
    </div>
    <div class="feature-input">
        <label for="feature4">Negative Marks:</label>
        <input 
            bind:value={negativeMarks}
            on:input={onChange} 
            id="feature4" 
            type="text" 
            placeholder="Negative marks for each question"
        >
    </div>
    {#if editData}
        <div class="btns">
            <button 
                id="ok"
                disabled = {!validInputs} 
                on:click={updateTestSet} 
            >
                Ok
            </button>
            <button on:click={cancel} id="cancel">Cancel</button>
        </div>
    {:else}
        <div class="saving">
            <button 
                disabled={!validInputs} 
                on:click={save}>Save To Database</button>
            {#if saving}
                <SaveIndicator/>
            {/if}
        </div>
    {/if}
</div>