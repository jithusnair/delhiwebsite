<script context='module'>
    export async function preload({ params }) {
		let petitionerData;

		await this.fetch(`/admin/petitioners/getpetitioners`,
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
                petitionerData = data.data;
            }
            else if (data.err) {
                this.error(401, 'Unauthorized')
            }
            else if (data.serverErr) {
                this.error(500, 'Server issues')
            }
        })
        if(petitionerData) return { petitionerData };
	}
</script>

<script>
    import Petitioners from '../../../components/admin/petitioner/petitioners.svelte';
    
    export let petitionerData;
    
</script>

<style>
    
</style>

<Petitioners docs={petitionerData}/>