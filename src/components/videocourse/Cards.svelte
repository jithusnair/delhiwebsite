<script>
    import Card from './Card.svelte';

    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let docs;
</script>

<style>
    .blog-container {
        width: 90%;
        margin: 0 auto 1rem auto;
        display: grid;
        justify-content: center;
        grid-gap: 5rem;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-auto-flow: dense;
    }

    
</style>

<div class="blog-container">
    {#if docs}
        {#each docs as data (data._id)}
            <Card {data}/>
        {/each}
    {/if}
</div>