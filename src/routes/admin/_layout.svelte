<!-- 
	This checks if the user requesting all the pages
	within this directory and sub-directories is 
	indeed the admin or some crony
 -->
<script context="module">
	export async function preload(page, session) {
		const { user } = session;

		if (!user) {
            return this.redirect(302, '/backdoor');
        }

        else if(!user.isAdmin) {
            return this.redirect(302, '/');
		}
		return { user }
	}
</script>

<script>
	import AdminNav from '../../components/admin/AdminNav.svelte';

</script>

<style>
	div {
		margin-left: 225px;
	}
</style>

<AdminNav/>

<div>
	<slot></slot>
</div>