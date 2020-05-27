<script>
	import NavPlusLoginSignup from '../components/NavPlusLoginSignup.svelte';

	export let segment;

	let displayLogIn = false;
	let displaySignUp = false;
</script>

<style>
	main {
		height: 100%;		
		padding-top: 6rem;
	}
</style>

<main>
	<slot></slot>
</main>

{#if segment === 'underconstruction'}
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