<script>
    import ErrorSnackbar from '../../components/ui/ErrorSnackbar.svelte';
    import Cards from '../../components/videocourse/Cards.svelte';

    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';
    
    import { onMount } from 'svelte';

    onMount(() => {
		getCourses();
	});

    let getError;
    
    let dbCourseData;

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}

    function getCourses() {
		fetchWithTimeout('/readwrite/getvideocourse', {
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
    h2 {
        text-align: center;
        margin-top: 2rem;
    }
</style>

<h2>Online Classes</h2>

<Cards docs={dbCourseData}/>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>