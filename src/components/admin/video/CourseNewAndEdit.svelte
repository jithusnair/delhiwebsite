<script>
    import Loading from '../../ui/Loading.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    let courseTitle = '';
	let feature1 = '';
	let feature2 = '';
	let feature3 = '';
	let feature4 = '';
    let feature5 = '';

    let loading = false;

    let data;
    
    function onChange() {
		data = {
			courseTitle: courseTitle,
			features: [feature1, feature2, feature3, feature4, feature5]
		}
    }
    
    function save() {
		loading = true;
		fetchWithTimeout('/admin/videoCRUD', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        },
        10000)
        .then(response => {
			loading = false;
			return response.json();
		})
        .then(data => {
            if(data.success) {
				cleanUp();
				getCourses();
            }
            else if (data.err) {
                // HANDLE ERROR PROPERLY
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                loading = false;
                errorMsg = 'Server taking too long to respond! Request timed out';
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
</script>

<style>
    .new-course-input {
		text-align: left;
		margin: 5rem;
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
</style>

<div class="new-course-input">
    <h3 id="courseTitle">Course Title</h3>
    <input 
        bind:value = {courseTitle}
        on:input={onChange} 
        id="courseTitleInput" 
        type="text"
        placeholder="Type in the course Title">
    <h3>Add features</h3>
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
    <button on:click={save}>Save To Database</button>
    {#if loading}
        <div>
            <Loading/>
        </div>
    {/if}
</div>