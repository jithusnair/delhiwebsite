<script>
    import SaveIndicator from '../../ui/SaveIndicator.svelte';
    import Error from '../../ui/Error.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let courseId;

    export let editData = false;
    
    let videoId; 

    let title = '';
	let description ='';
    let link = '';
    
    let touchedLink = false;
    let linkValid;

    $: linkValid = link? true: false;

    let saving = false;

    let data;

    if(editData) {
        data = Object.assign({}, editData);
        videoId = data._id;
        title = data.title;
        description = data.description;
        link = data.link;
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
                _id: videoId,
                title: title,
                description: description,
                link: link
            }
        }
        else {
            data = {
                courseId: courseId,
                title: title,
                description: description,
                link: link
            }
            dispatch('inputChange', data);
        }
    }
    
    function save() {
		saving = true;
		fetchWithTimeout(`/admin/videocourses/${courseId}/video_crud`, {
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
        title = '';
        description = ''
        link=''

        touchedLink = false;
    }

    function updateCourse() {
        fetchWithTimeout(`/admin/videocourses/${courseId}/video_crud`, {
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

    button:disabled {
        background: darkgrey;
        cursor: default;
    }

    .new-video-input {
		text-align: left;
		margin: 2rem 5rem 5rem 5rem;
	}

    .descAndLink {
		margin: 2rem auto;
	}

    .descAndLink label {
		font-size: 1.5rem;
        margin-right: 1.5rem;
	}

	#videoTitle, #videoTitleInput {
		margin-bottom: 1rem
	}

    .saving {
        display: flex;
        justify-content: space-evenly;
    }

    .error-message {
        font-size: 1.2rem;
    }

    #descAndLink {
        margin-top: 1rem;
    }
</style>

<div class="new-video-input">
    <Error showErr={saveError? true: false}>
        <p class="error-message">{saveError}</p>
    </Error>
    <Error showErr={!linkValid && touchedLink? true: false}>
        <p class="error-message">Link cannot be left blank</p>
    </Error>
    <h3 id="videoTitle">Video Title</h3>
    <input 
        bind:value = {title}
        on:input={onChange} 
        id="videoTitleInput" 
        type="text"
        placeholder="Type in the course Title">
    <h3 id="descAndLink">Add Description and Video Link</h3>
    <div class="descAndLink">
        <label for="description">Description: </label>
        <textarea 
            bind:value={description}
            on:input={onChange}
            id="description"  
            placeholder="Give a short description"
        ></textarea>
    </div>
    <div class="descAndLink">
        <label for="videoLink">Link: </label>
        <input 
            bind:value={link}
            on:input={onChange} 
            on:blur={() => touchedLink = true}
            id="videoLink" 
            type="text" 
            placeholder="Video link"
        >
    </div>
    {#if editData}
        <div class="btns">
            <button on:click={updateCourse} id="ok">Ok</button>
            <button on:click={cancel} id="cancel">Cancel</button>
        </div>
    {:else}
        <div class="saving">
            <button 
                disabled={!linkValid? true: false} 
                on:click={save}
            >
                Save To Database
            </button>
            {#if saving}
                <SaveIndicator/>
            {/if}
        </div>
    {/if}
</div>