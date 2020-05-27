<script context='module'>
    export async function preload({ params }) {
		const { course } = params;

		let courseDoc;

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
				courseDoc = data.course;
            }
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

		if (dbVideoData) {
			return { dbVideoData, courseDoc, getError }
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
	import ErrorSnackbar from '../../components/ui/ErrorSnackbar.svelte';
	import Videos from '../../components/videocourse/Videos.svelte';
	import BuyNowCard from '../../components/videocourse/BuyNowCard.svelte';

	import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

	export let courseDoc;

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
        margin: 2rem 10rem;
    }

	.card {
		position: fixed;
		top: 50%;
		right: 2%;
		transform: translateY(-45%);
	}

	.videos {
		width: 70%;
	}

	@media only screen and (max-width: 1000px) {
        h2 {
        	margin: 2rem auto;
			text-align: center;
    	}

		.videos {
			width: 100%;
		}

		.card {
			display: block;
			position: static;
			width: 100%;
			margin: 5rem 0 2rem 0;
			transform: none;
		}
    }
</style>

<svelte:head>
    <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<div class="videos">
	<h2>{courseDoc.courseTitle}</h2>
	<Videos docs = {dbVideoData} />
</div>

<div class='card'>
	<BuyNowCard data={courseDoc}/>
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>