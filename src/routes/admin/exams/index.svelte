<script>
    import ExamsNew from '../../../components/admin/exam/ExamNew.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';
    import ManagableExams from '../../../components/admin/exam/ManagableExams.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    import { onMount, onDestroy } from 'svelte';

    onMount(()=>{
        getSectors();
        getExams();
    });

    onDestroy(()=>{
        let node = document.getElementById('trumbowyg-icons');
        if(node) node.parentNode.removeChild(node);
    })

    let sectors;
    let exams;

    let getError;
    let noSectorsError;

    function getSectors() {
        let fetchOptions;
    
        fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        };
        
		fetchWithTimeout('/admin/sectors/sector_crud', fetchOptions,
        30000)
        .then(response => {
			return response.json();
		})
        .then(data => {
            if(data.success) {
                sectors = data.data;
                if(!sectors || sectors.length == 0) {
                    noSectorsError = 'There are no sectors. Please add a sector before adding exam details'
                }
            }
            else if (data.err) {
                getError = data.err;
            }
            else if (data.serverErr){
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

    function getExams() {
        let fetchOptions;
    
        fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        };
        
		fetchWithTimeout('/admin/exams/exam_crud', fetchOptions,
        30000)
        .then(response => {
			return response.json();
		})
        .then(data => {
            if(data.success) {
                exams = data.data;
            }
            else if (data.err) {
                getError = data.err;
            }
            else if (data.serverErr){
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

<ExamsNew 
    {sectors} 
    on:save = {getExams}
/>

{#if exams}
    <ManagableExams 
        {sectors} 
        {exams}
        on:update = {getExams}
        on:delete = {getExams}
    />
{/if}

<ErrorSnackbar show={noSectorsError? true: false}>
    {noSectorsError}
</ErrorSnackbar>

<ErrorSnackbar show={getError? true: false}>
    {getError}
</ErrorSnackbar>