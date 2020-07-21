<script>
    import { createEventDispatcher } from 'svelte';
    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';
    import ErrorSnackBar from '../../../ui/ErrorSnackbar.svelte';

    import {questionDisplay} from '../../../../store/controller.js';

    export let testpack;
    export let testset;

    let deleteError = false;

    let data = {};

    let {compImagesToBeDeleted, otherImagesToBeDeleted} = createDeleteList();
    data.compImagesToBeDeleted = compImagesToBeDeleted.length != 0? 
        compImagesToBeDeleted: null;
    data.otherImagesToBeDeleted = otherImagesToBeDeleted.length != 0? 
        otherImagesToBeDeleted: null;
    
    data._id = $questionDisplay._id;
    data.comprehension = $questionDisplay.comprehension;
    data.subjectId = $questionDisplay.subjectId;
    data.passageNumber = $questionDisplay.passageNumber;

    const dispatch = createEventDispatcher();

    function yes() {
        let fetchOptions;
        
        fetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        };

        fetchWithTimeout(`/admin/testpacks/${testpack}/${testset}/question_crud`, 
        fetchOptions, 30000)
        .then(response => {
			return response.json();
		})
        .then(data => {
            if(data.success) {
                dispatch('deleted');
                dispatch('cancel'); //to just close the delete window
            }
            else if (data.err) {
                deleteError = data.err;
            }
            else if (data.serverErr){
                deleteError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }

    function createDeleteList() {
        let otherImagesToBeDeleted = [];
        let compImagesToBeDeleted = [];

        if($questionDisplay.compImages && $questionDisplay.compImages.length != 0) {
            compImagesToBeDeleted.push(...$questionDisplay.compImages)
        }
        if($questionDisplay.quesImages && $questionDisplay.quesImages.length != 0) {
            otherImagesToBeDeleted.push(...$questionDisplay.quesImages);
        }
        if($questionDisplay.optionsAreImages) {
            otherImagesToBeDeleted.push(...$questionDisplay.options);
        }
        if($questionDisplay.detailedAnsImages && 
           $questionDisplay.detailedAnsImages.length != 0) {
            otherImagesToBeDeleted.push(...$questionDisplay.detailedAnsImages);
        }
        return {compImagesToBeDeleted, otherImagesToBeDeleted};
    }

    function no() {
        dispatch('cancel')
    }
</script>

<style>
    #no {
        margin: 2rem auto 0 2rem;
        width: 75px;
        text-align:center;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        background: #3D0CFF;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
    }

    #yes {
        margin: 2rem 2rem 0 auto;
        background: white;
        width: 75px;
        text-align:center;
        color: Black;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
    }

    #yes:hover {
        background: #3D0CFF;
        color: white;
    }

    .confirm {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 500px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: 300px;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }

    h2 {
        margin: 0 auto 1rem auto;
    }

    #guideStatement {
        margin-top:0.75rem;
        text-align: center;
    }

</style>

<div class="confirm">
    <h2>Delete Question Number {$questionDisplay.qnNumber}?</h2>
    <p>
    Are you sure you want to delete this question from the database? <br>
    <p id="guideStatement"><strong>Press Yes to delete, No to cancel.</strong></p>
    <div class="btns">
        <button on:click={yes} id="yes">Yes</button>
        <button on:click={no} id="no">No</button>
    </div>
</div>

<ErrorSnackBar show = {deleteError? true: false}>
    <p>{deleteError}</p>
</ErrorSnackBar>