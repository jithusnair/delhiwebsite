<script>
    import TestSetDisplay from './TestSetDisplay.svelte';
    import { testSetsDisplayStore } from '../../store/testsets-controller.js';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
</script>

{#if $testSetsDisplayStore && $testSetsDisplayStore.length != 0}
    {#each $testSetsDisplayStore as testSet}
        <TestSetDisplay {testSet} on:unlock/>
    {/each}
{:else}
    <h3>No available tests</h3>
{/if}
