<script>
    import Video from './Video.svelte';
    
    import { fetchWithTimeout } from '../../_helpers/fetchWithTimeout.js';

    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let docs;

</script>

<style>
    .blog-container {
        width: 70%;
        margin: 0 auto;
    }

    @media only screen and (max-width: 1000px) {
        .blog-container {
            width: 80%;
        }
    }

    @media only screen and (max-width: 670px) {
        .blog-container {
            width: 90%;
        }
    }
</style>

<div class="blog-container">
    {#if docs}
        {#each docs as data (data._id)}
            <Video videoData = {data}/>
        {/each}
    {/if}
</div>