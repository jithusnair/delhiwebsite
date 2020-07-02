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

	let course;

    function getCourses() {
		fetchWithTimeout('/admin/videocourses/videocourse_crud', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        30000)
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
		width: 100%;
		margin: 3rem auto 2rem auto;
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
</style>

<div class="topContainer">
	<div class="lefthalf">
		<h2>New Course</h2>
		<CourseNewAndEdit
            on:save={()=>{
                previewData = null;
                getCourses();
            }}
            on:inputChange={(event) => previewData = event.detail}
        />
	</div>

	<div class="righthalf">
		<h2>Preview</h2>
		<div>
			<PreviewCard data={previewData}/>
		</div>
	</div>
</div>
<div class="bottomContainer">
	<h2>Courses in Database</h2>
	<!-- {#if loadingCards}
		<Loading/>
	{/if} -->
	<CardsAdmin
		docs = {dbCourseData}
		on:reloadData={getCourses}
		on:publish={getCourses}
	/>
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>