<script>
	import NavPlusLoginSignup from '../../components/NavPlusLoginSignup.svelte';

	export let segment;

	let displayLogIn = false;
	let displaySignUp = false;
</script>

<style>
	div {
		height: 100%;		
	}
</style>

<div>
	<slot></slot>
</div>

{#if segment === undefined}
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