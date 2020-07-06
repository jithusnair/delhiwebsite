<script>
    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';
    import { createEventDispatcher } from 'svelte';
    import { onMount, onDestroy } from 'svelte';

    import Error from '../../ui/Error.svelte';

    export let sectors;
    export let examData;

    let dispatch = createEventDispatcher();

    onMount(() => {
        jQuery('#editModetextarea').trumbowyg(editorOptions)
            .on('tbwchange', function(){ 
                text[focus] = 
                    focusChanging? text[focus] : jQuery('#editModetextarea').trumbowyg('html');
            });
        selector = [...examData.heads];
        text = [...examData.details];
        selector.unshift('');
        text.unshift('');

        examTitle = examData.examTitle;
        selectedSector = examData.sectorId;

        sectors.forEach(sector => {
            if(sector._id == selectedSector) {
                selectedSector = sector._id;
            }
        });

        // trumbowyg should initially show the text for selector[1] 
        jQuery('#editModetextarea').trumbowyg('html', text[1]);
    });

    let examTitle = '';
    let selectedSector;

    let selector = [];

    let text = [];

    $: fullyValid = 
        sectors && 
        sectors.length != 0 && 
        selector.length != 0 && 
        text.length != 0 &&
        examTitle != '';

    let focus = 1;
    let focusChanging = false;

    let saveError;

    let editorOptions = {
        btns: [
            // ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            // ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['table'],
            ['fullscreen']
        ],
        resetCss: true,
        tagsToRemove: ['script'],
        removeformatPasted: true,
        semantic: true,
        plugins: {
            table: {
                styler: 'styledTable'
            }
        }
    }

    function changeFocus(changeFocusTo) {
        focusChanging = true;
        let html = jQuery('#editModetextarea').trumbowyg('html');
        if(text[changeFocusTo]) {
            jQuery('#editModetextarea').trumbowyg('html', text[changeFocusTo]);
        }
        else {
            jQuery('#editModetextarea').trumbowyg('empty');
        }
        focus = changeFocusTo;
        focusChanging = false;
    }

    function packageContent() {
        let data = {};
        data._id = examData._id;
        data.examTitle = examTitle; 
        if(!selectedSector && sectors && sectors.length != 0) {
            data.sectorId = sectors[0]._id;
        }
        else {
            data.sectorId = selectedSector;
        }
        data.heads = selector.slice(1);
        
        text = text.slice(1);

        data.details = text;

        return {...data};
    }

    function update() {
        let data = packageContent();

        let fetchOptions;
    
        fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        };
        
		fetchWithTimeout('/admin/exams/exam_crud', fetchOptions,
        30000)
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                cleanUp();
                dispatch('update')
            }
            else if (data.err) {
                saveError = data.err;
            }
            else if (data.serverErr){
                saveError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }

    function cleanUp() {
        examTitle = '';
        text = [];

        focus = 1;

        selector = [];

        jQuery('#editModetextarea').trumbowyg('empty');
    }

    function cancel() {
        cleanUp();
        dispatch('cancel');
    }

    onDestroy(()=>{
        jQuery('#editModetextarea').trumbowyg('destroy');
    })
</script>

<style>
    .editContainer {
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }

    h3 {
        width: 90%;
        margin: 2rem auto;
    }

    .selectors {
        display: flex;
        flex-direction: column;
    }

    .text {
        width: 70%;
    }

    input {
        margin-bottom: 1rem;
    }

    .active {
        border: .21rem solid green;
    }

    .titleandsector {
        width: 90%;
        margin: 0 auto;
    }

    label {
        font-size: 2rem;
        margin: 0 1rem 0 0;
    }

    #title {
        margin-right: 1rem;
    }

    button:disabled {
        background: grey;
    }

    .error-message {
        font-size: 1.2rem;
    }

    .updateorcancel {
        display: flex;
        justify-content: center;
        margin: 2rem auto;
    }

    button {
        margin: 0 1rem;
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
</style>

<!-- The script tags for Trumbowyg is not required here because the component ExamNew.svelte
will have fetched those scripts already for the page. So no need to do it here again since this
component will only exist on the same page as ExamNew.svelte -->

<div class="edit">
    <h3>Edit Exam</h3>
    <Error showErr={saveError? true: false}>
        <p class="error-message">{saveError}</p>
    </Error>
    <div class="titleandsector">
        <label for="title">Exam Title:</label>
        <input id="title" placeholder="Exam title" type="text" bind:value={examTitle}>
        <label for="sector">Exam belongs to Sector:</label>
        <select bind:value={selectedSector}>
            {#if sectors && sectors.length !=0 }
                {#each sectors as sector}
                    <option value="{sector._id}">{sector.sectorTitle}</option>
                {/each}
            {/if}
        </select>
    </div>
    <div class="editContainer">
        <div class="selectors">
            <input
                class:active="{focus === 1}"
                value = {selector[1]}
                on:input = {(event)=> selector[1] = event.target.value}
                on:focus = {()=> changeFocus(1)}
                placeholder="Type in the selector 1" 
                type="text">
            <input 
                class:active="{focus === 2}"
                value = {selector[2]}
                on:input = {(event)=> selector[2] = event.target.value} 
                on:focus = {()=> changeFocus(2)}
                placeholder="Type in the selector 2" 
                type="text">
            <input 
                class:active="{focus === 3}"
                value = {selector[3]}
                on:input = {(event)=> selector[3] = event.target.value}
                on:focus={()=> changeFocus(3)}
                placeholder="Type in the selector 3" 
                type="text">
            <input 
                class:active="{focus === 4}"
                value = {selector[4]}
                on:input = {(event)=> selector[4] = event.target.value}
                on:focus={()=> changeFocus(4)}
                placeholder="Type in the selector 4" 
                type="text">
            <input 
                class:active="{focus === 5}"
                value = {selector[5]}
                on:input = {(event)=> selector[5] = event.target.value}
                on:focus={()=> changeFocus(5)}
                placeholder="Type in the selector 5" 
                type="text">
            <input 
                class:active="{focus === 6}"
                value = {selector[6]}
                on:input = {(event)=> selector[6] = event.target.value}
                on:focus={()=> changeFocus(6)}
                placeholder="Type in the selector 6" 
                type="text">
            <input 
                class:active="{focus === 7}"
                value = {selector[7]}
                on:input = {(event)=> selector[7] = event.target.value} 
                on:focus={()=> changeFocus(7)}
                placeholder="Type in the selector 7" 
                type="text">
            <input 
                class:active="{focus === 8}"
                value = {selector[8]}
                on:input = {(event)=> selector[8] = event.target.value} 
                on:focus={()=> changeFocus(8)}
                placeholder="Type in the selector 8" 
                type="text">
            <input 
                class:active="{focus === 9}"
                value = {selector[9]}
                on:input = {(event)=> selector[9] = event.target.value} 
                on:focus={()=> changeFocus(9)}
                placeholder="Type in the selector 9" 
                type="text">
            <input 
                class:active="{focus === 10}"
                value = {selector[10]}
                on:input = {(event)=> selector[10] = event.target.value} 
                on:focus={()=> changeFocus(10)}
                placeholder="Type in the selector 10" 
                type="text">
        </div>
        <div class="text">
            <div id="editModetextarea" placeholder="Type in details for selector {focus}"></div>
        </div>
    </div>
    <div class="updateorcancel">
        <button disabled = {!fullyValid} on:click={update}>Update</button>
        <button on:click = {cancel}>Cancel</button>
    </div>
</div>