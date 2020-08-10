<script context='module'>
    export async function preload({ params, query }) {
		const { course } = params;

		let buyNow = query.buy;

		let navigation;

		let getError;

		return await this.fetch('/nav/getNav')
        .then(response => response.json())
        .then(data => {
            if(data.success) {
				navigation = data.data
                return {navigation};
            }
            else if (data.serverErr){
                serverErr = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
		})
	}
</script>

<script>
	import NavPlusLoginSignup from '../components/NavPlusLoginSignup.svelte';
	import Footer from '../components/footer/footer.svelte'; 
	import {fade} from 'svelte/transition';

	import { fetchWithTimeout } from '../_helpers/fetchWithTimeout.js';
    import { navigationStore } from '../store/navigation.js';
	
	import { stores } from '@sapper/app';
	const { preloading } = stores();

	export let segment;

	export let navigation;

	navigationStore.set(navigation);

	let displayLogIn = false;
	let displaySignUp = false;
</script>

<style>
	main {
		min-height: calc(100vh + 191px);
		padding-top: 6rem;
		position: relative;
	}
</style>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

{#if !$preloading}
	<main transition:fade={{duration: 300}}>	
		<slot>
		</slot>
		{#if 
			segment !== 'admin' && segment !== 'user' && 
			segment !== 'petition' && segment !== 'backdoor' &&
			segment !== 'onlineclass' && segment !== 'tests' &&
			segment
		}
		<NavPlusLoginSignup
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
		{/if}
		{#if 
			segment != 'user' && segment != 'admin' &&
			segment != 'backdoor' && segment != 'underconstruction' &&
			segment != 'petition'
		}
			<Footer/>
		{/if}
	</main>
{/if}
