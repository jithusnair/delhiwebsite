<script>
    import TestPackPreviewCard from '../../../components/admin/testpack/TestPackPreviewCard.svelte';
    import TestPackNewAndEdit from '../../../components/admin/testpack/TestPackNewAndEdit.svelte';
	import TestPacksAdmin from '../../../components/admin/testpack/TestPacksAdmin.svelte';
	import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    
    import { onMount } from 'svelte';

	onMount(() => {
        getExams();
        getTestPacks();
	});

	let getError;

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}
    
	let previewData;

    let dbTestPacks;
    
    let exams;

    function getTestPacks() {
		fetchWithTimeout('/admin/testpacks/testpack_crud', {
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
				dbTestPacks = data.data;
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
    
    function getExams() {
        let fetchOptions;
    
        fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        };
        
		fetchWithTimeout('/admin/testpacks/getexamlist', fetchOptions,
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                exams = data.data;
                if(!exams || exams.length == 0) {
                    getError = `There are no exams.
                    Please add exams first before adding testpacks`
                }
            }
            else if (data.err) {
                getError = data.err;
            }
            else if (data.serverErr){
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
		<TestPackNewAndEdit 
            {exams}
            on:inputChange = {(event) => previewData = event.detail}
            on:save={()=>{
                previewData = null;
                getTestPacks();
            }}
        />
	</div>

	<div class="righthalf">
		<h2>Preview</h2>
		<div>
			<TestPackPreviewCard data={previewData}/>
		</div>
	</div>
</div>
<div class="bottomContainer">
	<h2>TestPacks in Database</h2>
	<TestPacksAdmin
		{exams}
        testpacks = {dbTestPacks}
		on:reloadData = {getTestPacks}
		on:publish = {getTestPacks}
	/>
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>