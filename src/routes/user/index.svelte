<script context="module">
	export async function preload(page, session) {
		const { user } = session;

		if (!user) {
            return this.redirect(302, '/');
        }

		return { user };
	}
</script>

<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    const { session } = stores();
    export let user;

//  Logout Logic
    function logout() {
        fetch('user/account/loginlogout', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    session.set({});
                    goto('/');
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }
 </script>

<style>
    div {
        margin: 5rem auto;
    }
</style>

<div>
<p>Hey {user.fullname}. This Dashhh... This is sooo good.... Am i right?</p>

<!-- Logout  -->
<button on:click={logout}>Logout</button>
</div>