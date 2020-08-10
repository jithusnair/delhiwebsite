<script>
    import TestPack from './TestPack.svelte';

    export let testPackData;
</script>

<style>
    .container {
        margin-top: 2rem;
        display: grid;
        grid-gap: 5rem;
        justify-content: center;
        justify-items: center;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-auto-flow: dense;
    }
</style>

<div class="container">
    {#each testPackData as testPack (testPack._id)}
        <TestPack {testPack} />
    {/each}
</div>