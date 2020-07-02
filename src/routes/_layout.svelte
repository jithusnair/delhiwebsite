<script>
	import NavPlusLoginSignup from '../components/NavPlusLoginSignup.svelte';
	import Footer from '../components/footer/footer.svelte'; 
	import {fade} from 'svelte/transition';
	
	import { stores } from '@sapper/app';
	const { preloading } = stores();

	export let segment;

	let displayLogIn = false;
	let displaySignUp = false;
</script>

<style>
	main {
		min-height: 100%;		
		padding-top: 6rem;
	}
</style>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

{#if !$preloading}
	<main transition:fade={{duration: 300}}>	
		<slot>
		</slot>
		{#if segment === 'underconstruction' || segment === 'contact' || segment == 'policies'}
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
		{#if !segment || segment == 'contact' || segment == 'onlineclass' || segment == 'policies'}
			<Footer/>
		{/if}
	</main>
{/if}
