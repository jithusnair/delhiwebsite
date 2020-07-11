<script>
    import SectionEditAndDelete from './SectionEditAndDelete.svelte';
    import { sectionStore } from '../../../../store/section.js';

    export let testPackId;
</script>

<style>
    h3 {
        margin-bottom: 3rem;
    }
</style>

<div class="container">
    <h3>Sections in Database</h3>
    <div class="sectorContainer">
        {#if $sectionStore}
            {#each $sectionStore as section}
                <SectionEditAndDelete 
                    {testPackId}
                    {section}
                    on:update
                    on:delete
                />
            {/each}
        {/if}
    </div>
</div>