<script>
    import SaveIndicator from '../../ui/SaveIndicator.svelte';
    import Error from '../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let editData = false;
    
    let id; 

    let courseTitle = '';
	let feature1 = '';
	let feature2 = ''; 
	let feature3 = '';
	let feature4 = '';
    let feature5 = '';

    let saving = false;

    let data;

    if(editData) {
        data = Object.assign({}, editData);
        id = data._id;
        courseTitle = data.courseTitle;
        feature1 = data.features[0];
        feature2 = data.features[1];
        feature3 = data.features[2];
        feature4 = data.features[3];
        feature5 = data.features[4];
    }
    
    let saveError;
    
    $:  if(saveError) {
            setTimeout(() => {
                saveError = false;
            }, 10000);
        }

    function onChange() {
        if(editData) {
            data = {
                _id: id,
                courseTitle: courseTitle,
                features: [feature1, feature2, feature3, feature4, feature5]
            }
        }
        else {
            data = {
                courseTitle: courseTitle,
                features: [feature1, feature2, feature3, feature4, feature5]
            }
            dispatch('inputChange', data);
        }
    }
    
    function save() {
		saving = true;
		fetchWithTimeout('/admin/videocourses/videoCRUD', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        },
        10000)
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
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saving = false;
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }
    
    function cleanUp() {
        courseTitle = '';
        feature1 = '';
        feature2 = '';
        feature3 = '';
        feature4 = '';
        feature5 = '';
    }

    function updateCourse() {
        fetchWithTimeout('/admin/videocourses/videoCRUD', {
            method: 'PUT',
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
		text-align: left;
		margin: 2rem 5rem 5rem 5rem;
	}

    .feature-input {
		margin: 1rem auto;
	}

    .feature-input label {
		font-size: 1.5rem;
        margin-right: 1.5rem;
	}

	#courseTitle, #courseTitleInput {
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
</style>

<div class="new-course-input">
    <Error showErr={saveError? true: false}>
        <p class="error-message">{saveError}</p>
    </Error>
    <h3 id="courseTitle">Course Title</h3>
    <input 
        bind:value = {courseTitle}
        on:input={onChange} 
        id="courseTitleInput" 
        type="text"
        placeholder="Type in the course Title">
    <h3 id="featuresTitle">Add features</h3>
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
    {#if editData}
        <div class="btns">
            <button on:click={updateCourse} id="ok">Ok</button>
            <button on:click={cancel} id="cancel">Cancel</button>
        </div>
    {:else}
        <div class="saving">
            <button on:click={save}>Save To Database</button>
            {#if saving}
                <SaveIndicator/>
            {/if}
        </div>
    {/if}
</div>