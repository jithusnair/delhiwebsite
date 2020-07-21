<script>
    import SubjectEditAndDelete from './SubjectEditAndDelete.svelte';
    import { subjectStore } from '../../../../store/subject.js';

    export let testPackId;
    export let testSetId;
</script>

<style>
    h3 {
        margin-bottom: 3rem;
    }
</style>

<div class="container">
    <h3>Subjects in Database</h3>
    <div class="sectorContainer">
        {#if $subjectStore}
            {#each $subjectStore as subject}
                <SubjectEditAndDelete 
                    {testPackId}
                    {testSetId}
                    {subject}
                    on:update
                    on:delete
                />
            {/each}
        {/if}
    </div>
</div>