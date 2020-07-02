<script>
    import Transaction from './Transaction.svelte';

    export let docs;
</script>

<style>
    .blog-container {
        width: 100%;
        margin: 0 auto;
    }
</style>

<div class="blog-container">
    {#if docs && docs.length !=0}
        {#each docs as data (data._id)}
            <Transaction {data}/>
        {/each}        
    {:else}
        <p>You have no purchased courses.</p>
    {/if}
</div>