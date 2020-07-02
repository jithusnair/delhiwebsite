<script context='module'>
    export async function preload({ params }) {
		const { course } = params;

		let routeExists;

		await this.fetch(`/admin/videocourses/${course}/video_crud`,
		{
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
		})
		.then(response => response.json())
		.then(data => {
			routeExists = data
		})

		if (routeExists.success) {
			return { course }
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
	import PreviewVideo from '../../../../components/admin/videopage/PreviewVideo.svelte';
	import VideoNewAndEdit from '../../../../components/admin/videopage/VideoNewAndEdit.svelte';
	import VideosAdmin from '../../../../components/admin/videopage/VideosAdmin.svelte';
	import ErrorSnackbar from '../../../../components/ui/ErrorSnackbar.svelte';
	import Playr from '../../../../components/admin/videopage/Playr.svelte';

	import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

	import { onMount } from 'svelte';

	onMount(()=>{
		getVideos();
	});

	export let course;

	let courseTitle;
	let previewData;
	let demoVideo;

	let dbVideoData;

	let getError;

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}

	function getVideos() {
		fetchWithTimeout(`/admin/videocourses/${course}/video_crud`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				dbVideoData = data.data;
				courseTitle = data.courseTitle;
				demoVideo = data.demoVideo;
            }
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                getError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
	}
</script>

<style>
	.course-title {
		width: 80%;
		margin: 0 auto;
	}

    .topContainer {
		width: 100%;
		margin: 2rem auto 2rem auto;
		display: flex;
		justify-content: space-evenly;
		border-top: grey solid 1px;
	}

	.bottomContainer {
		width: 100%;
		margin: 2rem auto;
	}

	.bottomContainer h2 {
		margin-left: 2rem
	}
	
	.lefthalf, .righthalf {
		width: 50%;
		text-align: center;
		height: auto;
		border-bottom: 1px solid black; 
	}

	.righthalf {
		border-left: 1px solid black;
	}

	#demo {
		width: 80%;
		margin: 5rem auto;
	}
</style>

<div class="course-title">
	<h1>{courseTitle}</h1>
</div>

<div class="topContainer">
	<div class="lefthalf">
		<h2>New Video</h2>
        <VideoNewAndEdit
			courseId = {course} 
			on:save={()=>{
                previewData = null;
                getVideos();
            }}
            on:inputChange={(event) => previewData = event.detail}
		/>
	</div>

	<div class="righthalf">
		<h2>Preview</h2>
		<div>
			<PreviewVideo videoData={previewData}/>
		</div>
	</div>
</div>
<div class="bottomContainer">
	<h2>Videos in Database</h2>
	{#if demoVideo}
		<div id="demo">
			<h3>Demo Video</h3>
			<Playr videoLink = {demoVideo} />
		</div>
	{/if}
    <VideosAdmin 
		docs = {dbVideoData}
		courseId = {course}
		on:reloadData={getVideos}
	/>
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>