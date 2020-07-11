<script>
    import TestSetNewAndEdit from './TestSetNewAndEdit.svelte';
    import TestSetsAdmin from './TestSetsAdmin.svelte';
    import { testSetStore } from '../../../../store/testset.js';
    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { onMount } from 'svelte';

    export let testPackId;

    let chaptersandtestsets;

    onMount(() => {
        getTestSets();
    })
       
    function getTestSets() {
        fetchWithTimeout(`/admin/testpacks/${testPackId}/testset_crud`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        },
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                chaptersandtestsets = data.chaptersandtestsets;
                unravel();
            }
			else if (data.serverErr) {
                getError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                getError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }

    function unravel() {
        testSetStore.set({});
        for (let i = 0; i < chaptersandtestsets.length; i++) {
            testSetStore.update(testSetObject => {
                let copy = {...testSetObject};
                copy[chaptersandtestsets[i]._id] = chaptersandtestsets[i].testSets;
                return copy;
            })
        }
    }
</script>


<style>
    h2 {
        margin: 1rem 2rem;
    }
</style>

<h2>New Test Sets</h2>

<TestSetNewAndEdit 
    {testPackId}
    on:save = {getTestSets}
/>

{#if $testSetStore}
    <h2>Test sets in Database</h2>
    <TestSetsAdmin 
        {testPackId}
        on:reloadData = {getTestSets}
    />
{/if}