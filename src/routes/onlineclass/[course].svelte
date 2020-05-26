<script context='module'>
    export async function preload({ params }) {
		const { course } = params;

		let courseTitle;

		let previewData;

		let dbVideoData;

		let getError;

		await this.fetch(`/readwrite/${course}`,
		{	
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        10000)
        .then(response => response.json())
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
            console.error('Error:', error);
        });

		if (dbVideoData) {
			return { dbVideoData, courseTitle, getError }
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
	import ErrorSnackbar from '../../components/ui/ErrorSnackbar.svelte';
	import Videos from '../../components/videocourse/Videos.svelte'

	import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

	export let courseTitle;

	export let dbVideoData;

	export let getError;

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}
</script>

<style>
	h2 {
        text-align: center;
        margin-top: 2rem;
    }
</style>

<svelte:head>
    <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<h2>{courseTitle}</h2>

<Videos docs = {dbVideoData} />

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>