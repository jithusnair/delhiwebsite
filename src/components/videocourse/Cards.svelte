<script>
    import Card from './Card.svelte';

    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let docs;
</script>

<style>
    .blog-container {
        width: 90%;
        margin: 0 auto;
        display: grid;
        justify-content: center;
        grid-gap: 5rem;
        grid-template-columns: 300px 300px 300px;
        grid-auto-rows: 450px;
        grid-auto-flow: dense;
    }

    @media only screen and (max-width: 1000px) {
        .blog-container {
            grid-template-columns: 300px 300px;
        }
    }

    @media only screen and (max-width: 670px) {
        .blog-container {
            grid-template-columns: 300px;
        }
    }
</style>

<div class="blog-container">
    {#if docs}
        {#each docs as data (data._id)}
            <Card {data}/>
        {/each}
    {/if}
</div>