<!-- 
	This checks if the user requesting all the pages
	within this directory and sub-directories is 
	indeed the admin or some crony
 -->
<script context="module">
	export async function preload(page, session) {
		const { user } = session;

		if (!user) {
            return this.redirect(302, '/');
        }

        else if(!user.isAdmin) {
            return this.redirect(302, '/backdoor');
		}
		return { user }
	}
</script>

<div>
	<slot></slot>
</div>