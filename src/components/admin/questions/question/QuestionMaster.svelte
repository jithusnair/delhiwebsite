<script>
    import QuestionNew from './QuestionNew.svelte';
    import DisplayEditDeleteModal from './DisplayEditDeleteModal.svelte';
    import Instructions from './Instructions.svelte';
    import { questionStore } from '../../../../store/question.js';
    import {
        questionDisplay,
        questionSubjects, 
        selectedSubject, 
        questionNumber} from '../../../../store/controller.js';
    import {fetchWithTimeout} from '../../../../_helpers/fetchWithTimeout.js';

    import {onMount} from 'svelte';

    export let testPackId;
    export let testSetId;

    let subjectsandquestions;

    let display = false;
    let displayInstructions = false;

    let deletedQuestion = false;
    let updatedQuestion = false;

    onMount(()=>{
        getQuestions();
    })

    function getQuestions() {
        fetchWithTimeout(`/admin/testpacks/${testPackId}/${testSetId}/question_crud`, {
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
                subjectsandquestions = data.subjectsandquestions;
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
        let subjects = [];
        let questions = {};
        for (let i = 0; i < subjectsandquestions.length; i++) {
            if(subjectsandquestions[i].questions.length != 0) {
                subjects[i] = {
                    _id: subjectsandquestions[i]._id, 
                    subjectTitle: subjectsandquestions[i].subjectTitle
                }
                questions[subjectsandquestions[i]._id] = subjectsandquestions[i].questions;
            }
        }

        if(subjects.length != 0) questionSubjects.set(subjects);
        else questionSubjects.set(0);
        if(Object.keys(questions).length != 0) questionStore.set(questions);
        else questionSubjects.set(0);

        if(deletedQuestion) {
            resetTheStores();
        }
        if(updatedQuestion) {
            $questionDisplay = $questionStore[$selectedSubject][$questionNumber];
            updatedQuestion = false;
        }
    }

    function resetTheStores() {
        if($questionStore[$selectedSubject] && $questionStore[$selectedSubject].length != 0) {
            questionDisplay.set($questionStore[$selectedSubject][0]);
            questionNumber.set(0);
        }
        else if($questionSubjects && $questionSubjects.length != 0) {
            selectedSubject.set($questionSubjects[0]._id);
            questionDisplay.set($questionStore[$selectedSubject][0]);
            questionNumber.set(0);
        }
        else if(!$questionSubjects || $questionSubjects.length === 0) {
            selectedSubject.set(0);
            questionDisplay.set(0);
            questionStore.set(0);
            questionSubjects.set(0);
        }
        deletedQuestion = false;
    }
</script>

<style>
    .btn, .instructions {
        position: absolute;
        text-align:center;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
        z-index: 1;
    }
    
    .btn {
        background: darkgreen;
        color: white;
        top: 2rem;
        right: 4rem;
    }

    .btn:hover {
        color: black;
        background: lightgreen;
    }

    .instructions {
        background: rgb(251, 255, 2);
        color: black;
        top: 2rem;
        right: 30rem;
    }
    
    .instructions:hover {
        color: white;
        background:rgb(141, 143, 40);
    }
</style>

<button 
    class="btn"
    on:click = {() => display = true}
>
    Questions In Database
</button>

<button 
    class="instructions"
    on:click = {() => displayInstructions = true}
>
    Instructions
</button>

<QuestionNew 
    testpack = {testPackId}
    testset = {testSetId}
    on:save = {getQuestions}
/>

<DisplayEditDeleteModal
    {display}
    {testPackId}
    {testSetId}
    on:update = {() => {
            updatedQuestion = true;
            getQuestions();
        }
    }
    on:deleted = {() => {
            deletedQuestion = true;
            getQuestions();
        }
    }
    on:close = {() => display = false}
/>

<Instructions
    {displayInstructions}
    on:close = {() => displayInstructions = false}
/>