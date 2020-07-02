<script>
    import SaveIndicator from '../../ui/SaveIndicator.svelte';
    import Error from '../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';

	onDestroy(() => {
        if(datePicker){
            console.log(datePicker);
            datePicker.destroy();
        }
    });
    
    import moment from 'moment';

    const dispatch = createEventDispatcher();

    export let editData = false;
    
    let id;
    let datePicker;

    let courseTitle = '';
    let demoVideo = '';
    let launchDate = ''
	let feature1 = '';
	let feature2 = ''; 
	let feature3 = '';
	let feature4 = '';
    let feature5 = '';
    let price = '';
    let validity = '';

    $: validInputs = courseTitle && price && validity;

    let saving = false;

    let data;
    let fileInput;
    let files;

    if(editData) {
        data = Object.assign({}, editData);
        id = data._id;
        launchDate = data.launchDate;
        courseTitle = data.courseTitle;
        demoVideo = data.demoVideo;
        feature1 = data.features[0];
        feature2 = data.features[1];
        feature3 = data.features[2];
        feature4 = data.features[3];
        feature5 = data.features[4];
        price = data.price;
        validity = data.courseValidity;
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
        if(editData) {
            data = {
                _id: id,
                courseTitle: courseTitle,
                features: [feature1, feature2, feature3, feature4, feature5],
                price: price,
                courseValidity: validity,
                demoVideo: demoVideo,
                launchDate: launchDate,
            }
        }
        else {
            data = {
                courseTitle: courseTitle,
                features: [feature1, feature2, feature3, feature4, feature5],
                price: price,
                courseValidity: validity,
                demoVideo: demoVideo,
                launchDate: launchDate,
            }
            dispatch('inputChange', data);
        }
    }
    
    function save() {
        saving = true;

        let formData;

        let fetchOptions;

        if(files && files[0]) {
            formData = new FormData();
            formData.append('image', files[0]);
            formData.append('data', JSON.stringify(data));
            fetchOptions = {
                method: 'POST',
                credentials: 'include', 
                body: formData
            };
        }
        else {
            formData = JSON.stringify(data);
            fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: formData
            };
        }

		fetchWithTimeout('/admin/videocourses/videocourse_crud', fetchOptions,
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
            if (error.name === 'AbortError') {
                saving = false;
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }
    
    function cleanUp() {
        courseTitle = '';
        demoVideo = '';
        datePicker.clear();
        feature1 = '';
        feature2 = '';
        feature3 = '';
        feature4 = '';
        feature5 = '';
        price='';
        validity='';
        files = null;
    }

    function fileUploadChange() {
        files = fileInput.files;
    }

    function updateCourse() {
        let formData;

        let fetchOptions;

        if(files && files[0]) {
            formData = new FormData();
            formData.append('image', files[0]);
            formData.append('data', JSON.stringify(data));
            fetchOptions = {
                method: 'PUT',
                credentials: 'include', 
                body: formData
            };
        }
        else {
            formData = JSON.stringify(data);
            fetchOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: formData
            };
        }
        fetchWithTimeout('/admin/videocourses/videocourse_crud', fetchOptions,
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

    .upload {
        position: absolute;
        top: 4.8rem;
        right: 0;
    }

    /* Styling the input[file] upload pattern
       https://benmarshall.me/styling-file-inputs/
    */
    [type="file"] {
        border: 0;
        clip: rect(0, 0, 0, 0);
        height: 1px;
        overflow: hidden;
        padding: 0;
        position: absolute !important;
        white-space: nowrap;
        width: 1px;
    }
        
    [type="file"] + label {
        background: #3D0CFF;
        border-radius: 2rem;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        padding: 1rem 1.5rem;
        font-size: 1.5rem;
    }
    
    [type="file"]:focus + label,
    [type="file"] + label:hover {
        background-color: black;
    }
        
    [type="file"]:focus + label {
        outline: 1px dotted #000;
    }

    [type="file"] + .disabledLabel,
    [type="file"] + .disabledLabel:hover,
    [type="file"]:focus + .disabledLabel {
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

    <!-- image upload form -->
    <form 
        class="upload" 
        action="/jaba"
        method="post" 
        enctype="multipart/form-data"
    >
        <input 
            id = {editData? 'files' : 'file'}
            type="file"
            bind:this = {fileInput} 
            on:change|capture|once|self|stopPropagation = {fileUploadChange}
            accept="image/*"
            name="photo"
            disabled = {!validInputs}
        >
        <label class={!validInputs? 'disabledLabel': ''} for={editData? 'files': 'file'}>
            <i class="fa fa-upload" aria-hidden="true"></i> 
            {#if files && files[0]}
                {files[0].name}
            {:else if editData && editData.image}
                {editData.image.filename}
            {:else}
                Upload Image
            {/if}
        </label>
    </form>

    <input 
        bind:value = {courseTitle}
        on:input={onChange} 
        id="courseTitleInput" 
        type="text"
        placeholder="Type in the course Title">
    <h3 id="featuresTitle">Demo Video Link</h3>
    <input 
        bind:value = {demoVideo}
        on:input={onChange} 
        id="courseTitleInput" 
        type="text"
        placeholder="Demo video link">
    
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
                disabled = {!validInputs} 
                on:click={updateCourse} id="ok">Ok
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