<script>
    import SaveIndicator from '../../ui/SaveIndicator.svelte';
    import Error from '../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';

    import moment from 'moment';
    
    onDestroy(() => {
        if(datePicker){
            datePicker.destroy();
        }
    });
    
    const dispatch = createEventDispatcher();

    export let editData = false;
    export let exams;
    
    let id;
    let datePicker;

    let testPackTitle = '';
    let launchDate = ''
	let feature1 = '';
	let feature2 = ''; 
	let feature3 = '';
	let feature4 = '';
    let feature5 = '';
    let price = '';
    let validity = '';
    let selectedExam;

    $: validInputs = testPackTitle && price && validity;

    let saving = false;

    let data = {};

    if(editData) {
        data = Object.assign({}, editData);
        id = data._id;
        selectedExam = data.examId;
        launchDate = data.launchDate;
        testPackTitle = data.testPackTitle;
        feature1 = data.features[0];
        feature2 = data.features[1];
        feature3 = data.features[2];
        feature4 = data.features[3];
        feature5 = data.features[4];
        price = data.price;
        validity = data.validity;
    }
    
    let saveError;
    
    $:  if(saveError) {
            setTimeout(() => {
                saveError = false;
            }, 10000);
        }

    function loadedScript() {
        datePicker = flatpickr(editData? '#date1': '#date', {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            mode: "single",
            minDate: "today",
            disableMobile: "true",
        });
    }

    function onChange() {
        if(!selectedExam && exams && exams.length != 0) {
            data.examId = exams[0]._id;
        }
        else {
            data.examId = selectedExam;
        }
        
        if(editData) {
            data._id = id
            data.testPackTitle = testPackTitle;
            data.features = [feature1, feature2, feature3, feature4, feature5];
            data.price = price;
            data.validity = validity;
            data.launchDate = launchDate;
        }
        else {
            data.testPackTitle = testPackTitle;
            data.features = [feature1, feature2, feature3, feature4, feature5];
            data.price = price;
            data.validity = validity;
            data.launchDate = launchDate;
            dispatch('inputChange', data);
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

		fetchWithTimeout('/admin/testpacks/testpack_crud', fetchOptions,
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
        testPackTitle = '';
        datePicker.clear();
        feature1 = '';
        feature2 = '';
        feature3 = '';
        feature4 = '';
        feature5 = '';
        price = '';
        validity = '';
    }

    function updateTestPack() {
        let fetchOptions;

        fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        };

        fetchWithTimeout('/admin/testpacks/testpack_crud', fetchOptions,
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
        text-align: left;
        width: 450px;
        overflow: scroll;
		margin: 2rem 5rem;
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
        justify-content: space-evenly;
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
</style>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script on:load={loadedScript} src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</svelte:head>

<div class="new-course-input">
    <Error showErr={saveError? true: false}>
        <p class="error-message">{saveError}</p>
    </Error>
    <h3 id="courseTitle">Course Title<span>*</span></h3>
    <input 
        bind:value = {testPackTitle}
        on:input={onChange} 
        id="courseTitleInput" 
        type="text"
        placeholder="Type in the Test Pack Title">
    
    <h3 for="sector">Testpack belongs to Exam:</h3>
    <select bind:value={selectedExam} on:change = {onChange}>
        {#if exams && exams.length !=0 }
            {#each exams as exam}
                <option value="{exam._id}">{exam.examTitle}</option>
            {/each}
        {/if}
    </select>
    
    <h3 id="featuresTitle">Add features and Launch Date</h3>
    <div class="feature-input">
        <label for="feature2">Launch Date:</label>
        <input 
            bind:value={launchDate}
            on:input={onChange} 
            id="{editData? 'date1': 'date'}" 
            type="text"
            placeholder="Course Launch Date"
        >
    </div>
    <div class="feature-input">
        <label for="feature1">Feature 1:</label>
        <input 
            bind:value={feature1}
            on:input={onChange}
            id="feature1" 
            type="text" 
            placeholder="Type in feature number 1"
        >
    </div>
    <div class="feature-input">
        <label for="feature2">Feature 2:</label>
        <input 
            bind:value={feature2}
            on:input={onChange} 
            id="feature2" 
            type="text" 
            placeholder="Type in feature number 2"
        >
    </div>
    <div class="feature-input">
        <label for="feature3">Feature 3:</label>
        <input 
            bind:value={feature3}
            on:input={onChange} 
            id="feature3" 
            type="text" 
            placeholder="Type in feature number 3"
        >
    </div>
    <div class="feature-input">
        <label for="feature4">Feature 4:</label>
        <input 
            bind:value={feature4}
            on:input={onChange} 
            id="feature4" 
            type="text" 
            placeholder="Type in feature number 4"
        >
    </div>
    <div class="feature-input">
        <label for="feature5">Feature 5:</label>
        <input 
            bind:value={feature5}
            on:input={onChange} 
            id="feature5" 
            type="text" 
            placeholder="Type in feature number 5"
        >
    </div>
    <div class="feature-input">
        <label for="price">Price<span>*</span>:</label>
        <input 
            bind:value={price}
            on:input={onChange} 
            id="price" 
            type="number" 
            placeholder="Price excluding GST"
        >
    </div>
    <div class="feature-input">
        <label for="validity">Validity<span>*</span>:</label>
        <input 
            bind:value={validity}
            on:input={onChange} 
            id="validity" 
            type="number" 
            placeholder="Validity in numer of days"
        >
    </div>
    {#if editData}
        <div class="btns">
            <button 
                id="ok"
                disabled = {!validInputs} 
                on:click={updateTestPack} 
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