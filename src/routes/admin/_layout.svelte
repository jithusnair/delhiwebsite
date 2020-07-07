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

<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.19.1/trumbowyg.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/ui/trumbowyg.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/plugins/table/ui/trumbowyg.table.min.css">
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.19.1/plugins/table/trumbowyg.table.min.js"></script>
</svelte:head>

<AdminNav/>

<div>
	<slot></slot>
</div>