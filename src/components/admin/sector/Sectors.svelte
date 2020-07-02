<script>
    import SectorDisplayEdit from './SectorDisplayEdit.svelte';

    export let sectors;
</script>

<style>
    h3 {
        margin-bottom: 3rem;
    }

    .sectorContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-gap: 2rem;
    }
</style>

<div class="container">
    <h3>Sectors in Database</h3>
    <div class="sectorContainer">
        {#each sectors as sector}
            <SectorDisplayEdit 
                {sector}
                on:update
                on:delete
            />
        {/each}
    </div>
</div>