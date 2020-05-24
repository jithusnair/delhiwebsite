<script>
    import PreviewCard from '../../../components/admin/videocoursepage/PreviewCard.svelte';
    import CourseNewAndEdit from '../../../components/admin/videocoursepage/CourseNewAndEdit.svelte';
	import CardsAdmin from '../../../components/admin/videocoursepage/CardsAdmin.svelte';
	import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    
    import { onMount } from 'svelte';

	onMount(() => {
		getCourses();
	});

	let getError;

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}
    
	let previewData;
	
	let dbCourseData;

	let course

    function getCourses() {
		fetchWithTimeout('/admin/videocourses/videocourse_crud', {
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
				dbCourseData = data.data;
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
    .topContainer {
		width: 80%;
		margin: 10rem auto 2rem auto;
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
		height: 600px;
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

<div class="topContainer">
	<div class="lefthalf">
		<h1>New Course</h1>
		<CourseNewAndEdit
            on:save={()=>{
                previewData = null;
                getCourses();
            }}
            on:inputChange={(event) => previewData = event.detail}
        />
	</div>

	<div class="righthalf">
		<h1>Preview</h1>
		<div>
			<PreviewCard data={previewData}/>
		</div>
	</div>
</div>
<div class="bottomContainer">
	<h1>Courses in Database</h1>
	<!-- {#if loadingCards}
		<Loading/>
	{/if} -->
	<CardsAdmin
		docs = {dbCourseData}
		on:reloadData={getCourses}
	/>
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>