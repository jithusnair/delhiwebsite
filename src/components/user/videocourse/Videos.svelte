<script>
    import Video from './Video.svelte';

    export let docs;
</script>

<style>
    .blog-container {
        width: 90%;
        margin: 0 auto;
    }
</style>

<div class="blog-container">
    {#if docs.length !=0}
        {#each docs as data (data._id)}
            <Video videoData = {data}/>
        {/each}        
    {/if}
</div>