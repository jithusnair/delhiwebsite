<script context='module'>
    export async function preload({ params }) {
		let users;

		await this.fetch(`/admin/users/getusers`,
		{
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
		})
		.then(response => response.json())
		.then(data => {
			if(data.success) {
                users = data.users;
            }
            else if (data.err) {
                this.error(401, 'Unauthorized')
            }
            else if (data.serverErr) {
                this.error(500, 'Server issues')
            }
        })

		return { users }
	}
</script>

<script>
    import Users from '../../../components/admin/user/users.svelte';

    export let users;
</script>

<style>

</style>

<Users data={users}/>
