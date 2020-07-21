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

	.admin-settings:hover {
        background: white;
        color: black;
    }

    .admin-settings {
        position: relative;
        top: 1rem;
        left: 85%;
        border: 1px solid var(--nav-color);
        background: var(--nav-color);
        border-radius: 1rem;
        color: white;
        cursor: pointer;
        padding: 1rem;
        z-index: 1001;
    }

	div {
		position: relative;
	}
</style>

<!-- 
	There is a weird html tag here.
	This is because of a bug in svelte:head tag. Without this @html it runs twice.
	For scripts this can become a problem and this can break the functionality of 
	the website.
	For now this is the solution.

	for ref: 
	https://github.com/sveltejs/sapper/issues/1124
	https://github.com/sveltejs/svelte/issues/1607
 -->

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/ui/trumbowyg.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.19.1/plugins/table/ui/trumbowyg.table.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/plugins/mathml/ui/trumbowyg.mathml.min.css">

    {@html '<script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/trumbowyg.min.js"></script>'}
    {@html '<script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.19.1/plugins/table/trumbowyg.table.min.js"></script>'}
	{@html '<script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/plugins/upload/trumbowyg.upload.min.js"></script>'}
	{@html '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"></script>'}
	{@html '<script src="https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.21.0/plugins/mathml/trumbowyg.mathml.min.js"></script>'}
</svelte:head>


<AdminNav/>

<div>
	<a class="admin-settings" href="/admin/account">
		Admin Settings
	</a>
	<slot></slot>
</div>