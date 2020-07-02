<!-- 
	This checks if the user requesting all the pages
	within this directory and sub-directories is 
	indeed authenticated
 -->
<script context="module">
	export async function preload(page, session) {
		const { user } = session;

		if (!user || !page.path == '/user/account/') {
            return this.redirect(302, '/');
		}
		
		return {user};
	}
</script>

<script>
	import UserNav from '../../components/user/UserNav.svelte';

	export let segment;
</script>

<style>
	div {
		margin-left: 225px;
	}

	@media only screen and (max-width: 1000px) {
		div {
			margin-left: 0;
			padding-top: 2rem;
		}
	}
</style>

{#if segment != 'account'}
	<UserNav/>
{/if}

<div>
	<slot></slot>
</div>