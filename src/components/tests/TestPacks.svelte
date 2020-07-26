<script>
    import TestPack from './TestPack.svelte';
    import { testPacksDisplayStore } from '../../store/tests-controller.js';
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

    @media screen and (max-width: 600px){
        .container {
            margin-top: 5rem;
        }
    }
</style>

<div class="container">
    {#if $testPacksDisplayStore && $testPacksDisplayStore.length != 0}
        {#each $testPacksDisplayStore as testPack (testPack._id)}
            <TestPack {testPack} />
        {/each}
    {/if}
</div>