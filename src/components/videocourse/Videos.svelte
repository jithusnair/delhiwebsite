<script>
    import Video from './Video.svelte';
    
    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';
    import moment from 'moment';

	const dispatch = createEventDispatcher();

    export let docs;
</script>

<style>
    .blog-container {
        width: 90%;
        margin: 0 auto;
    }

    @media only screen and (max-width: 1000px) {
        .blog-container {
            width: 85%;
        }
    }
</style>

<div class="blog-container">
    {#if docs && docs.length !=0}
        {#each docs as data (data._id)}
            <Video videoData = {data}/>
        {/each}
    {/if}
</div>