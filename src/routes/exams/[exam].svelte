<script context='module'>
    export async function preload({ params, query }) {
		const { exam } = params;

        let examData;
        let testPacks;

		await this.fetch(`/examsandtests/exams/${exam}`,
		{	
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
			credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                examData = {...data.data};
                testPacks = [...data.data.testPacks];
                delete examData.testPacks;
			}
			else if (data.err) {
                this.error(404, 'Not Found');
            }
            else if(data.serverErr) {
                this.error(500, data.serverErr);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
		});

		if (examData) {
			return { examData, testPacks };
		}
		else {
			this.error(404, 'Not found');
		}
	}
</script>

<script>
    import ExamDisplay from '../../components/exam/examDetail.svelte';
    import TestPacks from '../../components/exam/TestPacks.svelte';

    export let examData;
    export let testPacks;
</script>

<style>
    h2 {
        font-size: 4.5rem;
        margin: 10rem 0 5rem 0;
        text-align: center;
    }
</style>

{#if examData}
    <ExamDisplay examData = {examData} />
{/if}

{#if testPacks && testPacks.length != 0 }
    <h2>Test Packs</h2>

    <TestPacks testPackData = {testPacks} />
{/if}