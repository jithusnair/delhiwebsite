<script context='module'>
    export async function preload({ params }) {
		const { testpack, testset } = params;

        let subjects;
        let testSet;

		await this.fetch(`/admin/testpacks/${testpack}/${testset}/subject_crud`,
		{
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
		})
		.then(response => response.json())
		.then(data => {
            subjects = data.subjects;
            testSet = data.testSet;
        })

		if (testSet) {
            let testPack = testpack;
			return { subjects, testPack, testSet }
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
    import { fetchWithTimeout } from '../../../../../_helpers/fetchWithTimeout.js';
    import SubjectMaster from '../../../../../components/admin/questions/subject/SubjectMaster.svelte';
    import QuestionMaster from '../../../../../components/admin/questions/question/QuestionMaster.svelte';
    import { subjectStore } from '../../../../../store/subject.js';
    
    import { onMount } from 'svelte';

    export let subjects;
    export let testSet;
    export let testPack;

    let getError;

    onMount(() => {
        subjectStore.set(subjects);
    });

    function getSubjects() {
        fetchWithTimeout(`/admin/testpacks/${testPack}/${testSet._id}/subject_crud`, {
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
                subjects = data.subjects;
                subjectStore.set(subjects);
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
</script>

<style>
    h2 {
        margin: auto 2rem;
    }

    .container {
        position: relative;
    }
</style>

<h2>{testSet.testSetTitle}</h2>
<SubjectMaster
    testPackId = {testPack}
    testSetId = {testSet._id}
    on:save = {() => getSubjects()}
    on:update = {() => getSubjects()}
    on:delete = {() => getSubjects()}
/>

{#if $subjectStore && $subjectStore.length!= 0}
    <div class="container">
        <QuestionMaster
            testPackId = {testPack}
            testSetId = {testSet._id}
        />
    </div>
{/if}