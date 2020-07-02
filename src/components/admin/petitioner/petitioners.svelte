<script>
    import Petitioner from './petitioner.svelte';

    export let docs;
</script>

<style>
    .container {
        display: grid;
        width: 95%;
        margin: 0 auto;
        grid-template-columns: 320px 320px 320px;
        grid-gap: 3rem;
    }

    h3 {
        margin-left: 4rem;
    }

    @media only screen and (min-width: 1300px) {
        .container {
            grid-template-columns: 320px 320px 320px 320px;
        }
    }
</style>

{#if docs && docs.length != 0}
    <div class="container">
        {#each docs as doc (doc._id)}
            <Petitioner data = {doc} />
        {/each}
    </div>
{:else}
    <h3>There are no petitioners as of now</h3>
{/if}
<!-- {moment(data.lastUpdated).format("MMM Do YYYY, h:mm:ss a")} -->