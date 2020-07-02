<script>
    import SectorNew from '../../../components/admin/sector/SectorNew.svelte';
    import Sectors from '../../../components/admin/sector/Sectors.svelte'

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    import { onMount } from 'svelte';

	onMount(() => {
		reload();
	});
    
    let sectors;

    function reload() {
        let fetchOptions;
    
        fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        };
        
		fetchWithTimeout('/admin/sectors/sector_crud', fetchOptions,
        30000)
        .then(response => {
			return response.json();
		})
        .then(data => {
            if(data.success) {
                sectors = data.data;
            }
            else if (data.err) {
                saveError = data.err;
            }
            else if (data.serverErr){
                saveError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }
</script>

<style>
    .container {
        width: 90%;
        margin: 0 auto;
    }
    hr {
        background-color: grey;
        margin: 2rem auto;
    }
</style>

<div class="container">
    <SectorNew 
        on:save = {reload}
    />
    <hr>
    {#if sectors && sectors.length != 0}
        <Sectors 
            on:update = {reload}
            on:delete = {reload}
            {sectors} 
        />
    {/if}
    <hr>
    <p>Once a sector has been added, you can add details of exams that come under these sectors</p>
    <button>Add Exams</button>
</div>