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
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				dbVideoData = data.data;
				courseDoc = data.course;
            }
			else if (data.serverErr) {
				getError = data.serverErr;
				this.error(404, 'Not found');
			}
			return { dbVideoData, courseDoc, getError }
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
	import DemoPlayr from '../../components/videocourse/DemoPlayr.svelte';
	import BuyNowCard from '../../components/videocourse/BuyNowCard.svelte';
	import NavPlusLoginSignup from '../../components/NavPlusLoginSignup.svelte';
	import Timer from '../../components/ui/Timer.svelte';

	import moment from 'moment';
	import { onDestroy } from 'svelte';

	export let courseDoc;

	export let dbVideoData;

	export let getError;

	let displayLogIn = false;
	let displaySignUp = false;

	let buy = false;

	let redirection;

	let launched;
	let timer = {
		days: '0',
		hours: '00',
		minutes: '00',
		seconds: '00'
	};
	let interval;

	countdown();

	$: if(getError) {
		setTimeout(() => {
                getError = false;
            }, 10000);
	}

	function buyNow() {
		buy = true;
		redirection = `/user/onlineclass/${courseDoc._id}?buy=${buy}`
		displaySignUp = true;
	}

	function countdown() {
		interval = setInterval(() => {
			launched = moment(courseDoc.launchDate).startOf('day') - moment();
			if(launched>0){
				let duration = moment.duration(launched);
				timer = {
					days: duration.days(),
					hours: duration.hours(),
					minutes: duration.minutes(),
					seconds: duration.seconds(),
				}
			}
			else if(interval) clearInterval(interval);
		}, 1000);
	}
	
	onDestroy(()=>{
		if(interval) {
			clearInterval(interval)
		}
	})
</script>

<style>
	.container {
        display: flex;
		justify-content: space-around;
		min-height: 100vh;
    }

	h2 {
        margin: 2rem 10rem;
    }

	.videos {
		width: 65%;
	}

	@media only screen and (max-width: 1000px) {
		.container {
			flex-direction: column;
		}

        h2 {
        	margin: 2rem auto;
			text-align: center;
    	}

		.videos {
			width: 100%;
		}
    }
</style>

<div class="container">
	{#if launched != undefined}
		<div class="videos">
			<h2>{courseDoc.courseTitle}</h2>
			<DemoPlayr videoLink={courseDoc.demoVideo} />
				{#if launched>0}
				<div>
					<h2>Classes Will Launch In</h2>
					<Timer {timer}/>
				</div>
				{:else}
					<h2>Classes</h2>
					<Videos docs = {dbVideoData} />
				{/if}
		</div>

		<div class='card'>
			<BuyNowCard 
				data={courseDoc}
				on:click={buyNow}	
			/>
		</div>
	{/if}
</div>

<ErrorSnackbar show={getError}>
    <p>{getError}</p>
</ErrorSnackbar>

<NavPlusLoginSignup
	{redirection}
    {displayLogIn}
    {displaySignUp}
    on:navlogin={() => displayLogIn = true}
    on:signupopen = { () => {
        displayLogIn = false;
        displaySignUp = true;
    }}
    on:loginclose={() => displayLogIn = false}
    on:loginopen = { () => {
        displaySignUp = false;
        displayLogIn = true;
    }}
    on:signupclose={() => displaySignUp = false}
/>