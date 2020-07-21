<script>
    import Modal from '../../../ui/Modal.svelte';
    import QuestionsDisplay from './QuestionsDisplay.svelte';
    import QuestionEdit from './QuestionEdit.svelte';
    import ConfirmAndDelete from './ConfirmAndDelete.svelte';
    import {questionStore} from '../../../../store/question.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let display;
    export let testPackId;
    export let testSetId;

    let editMode;
    let deleteMode;
</script>

<style>
    .questions {
        width: 90%;
        background: white;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 575px;
        padding: 3rem;
    }

    .closeBtn {
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        font-size: 3rem;
    }

    .closeBtn:hover {
        color: red;
        cursor: pointer;
    }

    .edit {
        height: 475px;
        overflow: scroll;
    }
</style>

<Modal displayModal = {display}>
    <div class="questions">
        <span class="closeBtn" on:click = {()=> dispatch('close')}>
            <i class="fa fa-times" aria-hidden="true"></i>
        </span>
        {#if editMode}
            <div class="edit">
                <QuestionEdit
                    testpack = {testPackId}
                    testset = {testSetId}
                    on:update
                    on:back = {() => editMode = false}
                />
            </div>
        {:else if deleteMode}
            <ConfirmAndDelete 
                testpack = {testPackId}
                testset = {testSetId}
                on:deleted
                on:cancel = {() => deleteMode = false}
            />
        {:else}
            {#if $questionStore != 0}
                <QuestionsDisplay
                    on:edit = {() => editMode = true}
                    on:delete = {() => deleteMode = true}
                />
            {:else}
                <h3>There are no questions to display</h3>
            {/if}
        {/if}
    </div>
</Modal>