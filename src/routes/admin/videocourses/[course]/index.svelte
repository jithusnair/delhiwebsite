<script context='module'>
    export async function preload({ params }) {
		const { course } = params;
		// const res = await this.fetch(`/admin/videocourses/video_crud`);

		// if (res.status === 200) {
		// 	const article = await res.json();
		// 	return { article };
		// }

		return { course }
	}
</script>

<script>
	import PreviewVideo from '../../../../components/admin/videopage/PreviewVideo.svelte';
	import VideoNewAndEdit from '../../../../components/admin/videopage/VideoNewAndEdit.svelte';
	import VideosAdmin from '../../../../components/admin/videopage/VideosAdmin.svelte';
	import ErrorSnackbar from '../../../../components/ui/ErrorSnackbar.svelte';

	import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

	import { onMount } from 'svelte';

	onMount(()=>{
		getVideos();
	});

	export let course;

	let courseTitle;

	let previewData;

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
        10000)
        .then(response => {
			return response.json()
		})
        .then(data => {
            if(data.success) {
				dbVideoData = data.data;
				courseTitle = data.courseTitle;
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
		margin: 5rem auto;
	}

    .topContainer {
		width: 80%;
		margin: 2rem auto 2rem auto;
		display: flex;
		justify-content: space-evenly;
		border-top: grey solid 1px;
	}

	.bottomContainer {
		width: 80%;
		margin: 2rem auto;
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
</style>

<svelte:head>
    <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<div class="course-title">
	<h1>{courseTitle}</h1>
</div>

<div class="topContainer">
	<div class="lefthalf">
		<h1>New Video</h1>
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
		<h1>Preview</h1>
		<div>
			<PreviewVideo videoData={previewData}/>
		</div>
	</div>
</div>
<div class="bottomContainer">
	<h1>Videos in Database</h1>
    <VideosAdmin 
		docs = {dbVideoData}
		courseId = {course}
		on:reloadData={getVideos}
	/>
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>