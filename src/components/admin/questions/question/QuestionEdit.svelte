<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';
    import { subjectStore } from '../../../../store/subject.js';
    import { questionDisplay, selectedSubject } from '../../../../store/controller.js';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { onMount, createEventDispatcher } from 'svelte';

    import moment from 'moment';
    
    const dispatch = createEventDispatcher();

    export let testpack;
    export let testset;
    
    let copiedQuestion = {...$questionDisplay};

    let id = copiedQuestion._id;

    let qnNumber = copiedQuestion.qnNumber;
    let comprehension = copiedQuestion.comprehension;
    let passageNumber = copiedQuestion.passageNumber;
    let passageDb = copiedQuestion.passage;
    let passageEdited = copiedQuestion.passage;

    let question = copiedQuestion.question;

    let optionsAreImages =  copiedQuestion.optionsAreImages;
    let optionsHtml = copiedQuestion.optionsHtml;

    let correctAns = copiedQuestion.correctAns;
    let detailedAns = copiedQuestion.detailedAns;

    let compImagesDb = [];
    let otherImagesDb = [];

    if(copiedQuestion.compImages) compImagesDb.push(...copiedQuestion.compImages);
    if(copiedQuestion.quesImages) otherImagesDb.push(...copiedQuestion.quesImages);
    if(copiedQuestion.optionsAreImages) otherImagesDb.push(...copiedQuestion.options);
    if(copiedQuestion.detailedAnsImagesDb) otherImagesDb.push(...copiedQuestion.detailedAnsImages);


    let compImagesToBeDeleted = [];
    let otherImagesToBeDeleted = [];

    let selectedSubj = $selectedSubject;

    let editSelect = [
        {value: 0, desc: 'Comprehension'},
        {value: 1, desc: 'Question Statement'},
        {value: 2, desc: 'Options'},
        {value: 3, desc: 'Detailed Ans'},
    ];

    let saving = false;

    let data = {};

    let saveError;

    let editorSettingsGeneral = {
        btns: [
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['upload'],
            ['unorderedList', 'orderedList'],
            ['table'],
            ['mathml'],
        ],
        resetCss: true,
        tagsToRemove: ['script'],
        removeformatPasted: true,
        semantic: true,
        plugins: {
            upload: {
                serverPath: `/admin/testpacks/${testpack}/${testset}/imagehandler`,
                fileFieldName: 'image',
            }
        }
    }

    let editorSettingsForOptions = {
        btns: [
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['upload'],
            ['mathml']
        ],
        resetCss: true,
        tagsToRemove: ['script'],
        removeformatPasted: true,
        semantic: true,
        plugins: {
            upload: {
                serverPath: `/admin/testpacks/${testpack}/${testset}/imagehandler`,
                fileFieldName: 'image',
            }
        }
    }
    
    $:  if(saveError) {
            setTimeout(() => {
                saveError = false;
            }, 10000);
        }
    
    onMount(()=>{
        setupEditor();
        if(comprehension) {
            passageEditor();
            jQuery("#passageEdit").trumbowyg('html', passageEdited);
        }
        jQuery("#questionEdit").trumbowyg('html', question);
        jQuery("#optionsEdit").trumbowyg('html', optionsHtml);
        jQuery("#detailedAnsEdit").trumbowyg('html', detailedAns);
    });
    
    function setupEditor() {
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [
                    ['$', '$'],
                    ['\\(', '\\)']
                ]
            }
        });
        jQuery("#questionEdit").trumbowyg(editorSettingsGeneral)
            .on('tbwchange', function(){
                question = jQuery('#questionEdit').trumbowyg('html');
                let newImgArr = imageSrcParsing(question);
                imagesNewAndOld(otherImagesDb, newImgArr);
            });
        jQuery("#optionsEdit").trumbowyg(editorSettingsForOptions)
            .on('tbwchange', function(){
                optionsHtml = jQuery('#optionsEdit').trumbowyg('html');
                let newImgArr = imageSrcParsing(optionsHtml);
                imagesNewAndOld(otherImagesDb, newImgArr);
            });
        jQuery("#detailedAnsEdit").trumbowyg(editorSettingsGeneral)
            .on('tbwchange', function(){
                detailedAns = jQuery('#detailedAnsEdit').trumbowyg('html');
                let newImgArr = imageSrcParsing(detailedAns);
                imagesNewAndOld(otherImagesDb, newImgArr);
            });
    }

    function passageEditor() {
        if(comprehension) {
            jQuery('#passageEdit').trumbowyg(editorSettingsGeneral)
                .on('tbwchange', function(){ 
                    passageEdited = jQuery('#passageEdit').trumbowyg('html');
                    let newImgArr = imageSrcParsing(passageEdited);
                    imagesNewAndOld(compImagesDb, newImgArr);
                });
        }
        else {
            jQuery('#passageEdit').trumbowyg('destory');
        }
    }

    function imagesNewAndOld(oldArray, newArray) {
        if(!newArray || newArray.length == 0) return
        // any image not in the new array, save to old array.
        for (let i = 0; i < newArray.length; i++) {
            if(!oldArray.includes(newArray[i])) {
                oldArray.push(newArray[i]);
            }
        }
    }

    function packageText() {
        data._id = id;
        data.subjectId = selectedSubj;
        data.qnNumber = qnNumber;

        data.comprehension = comprehension;
        if(comprehension) {
            data.passage = passageEdited;
            data.passageChanged = passageEdited != passageDb;
            data.passageNumber = passageNumber;
        }
        
        data.question = question;

        data.optionsAreImages = optionsAreImages;
        data.optionsHtml = optionsHtml;
        
        data.correctAns = correctAns;
        data.detailedAns = detailedAns;
    }

    function packageImagesIntoData() {
        let compImagesEditor = [];
        let otherImagesEditor = [];
        let compImages = imageSrcParsing(passageEdited);
        if(compImages) compImagesEditor.push(...imageSrcParsing(passageEdited));
        data.compImages = compImagesEditor.length != 0? compImagesEditor: null;

        let quesImagesEditor = imageSrcParsing(question);
        data.quesImages = quesImagesEditor;
        if(quesImagesEditor) otherImagesEditor.push(...quesImagesEditor);

        let options;
        if(optionsAreImages) {
            options = imageSrcParsing(optionsHtml);
            if(options) otherImagesEditor.push(...options);
        } else {
            options = optionTextParsing(optionsHtml);
        }
        data.options = options;

        let detailedAnsImagesEditor = imageSrcParsing(detailedAns);
        data.detailedAnsImages = detailedAnsImagesEditor;
        if(detailedAnsImagesEditor) otherImagesEditor.push(...detailedAnsImagesEditor);

        compImagesToBeDeleted = createDeleteList(compImagesDb, compImagesEditor);
        otherImagesToBeDeleted = createDeleteList(otherImagesDb, otherImagesEditor);
        
        data.compImagesToBeDeleted = 
            compImagesToBeDeleted.length != 0? compImagesToBeDeleted: null;
        data.otherImagesToBeDeleted = 
            otherImagesToBeDeleted.length != 0? otherImagesToBeDeleted: null;
    }

    function createDeleteList(dbImages, editorImages) {
        let imagesToBeDeleted = [];

        if(!dbImages || dbImages.length === 0) {
            return [];
        } 
        else if(editorImages && editorImages.length !== 0) {
            for (let i = 0; i < dbImages.length; i++) {
                if(!editorImages.includes(dbImages[i])) {
                    imagesToBeDeleted.push(dbImages[i]);
                }
            }
            return imagesToBeDeleted;
        }
        else {
            return dbImages;
        }
    }

    // this function parses the text-options from the html received from editor
    function optionTextParsing() {
        let parser = new DOMParser();
        let parsedHtml = parser.parseFromString(optionsHtml, 'text/html');

        let paragraphs = parsedHtml.getElementsByTagName("p");
        options = [];
        for (let i = 0; i < paragraphs.length; i++) {
            if(paragraphs[i].innerText) {
                options[i] = paragraphs[i].innerHTML;
            }
        }
        return options
    }

    function imageSrcParsing(html) {
        let parser = new DOMParser();
        let parsedHtml = parser.parseFromString(html, 'text/html');

        let images = parsedHtml.getElementsByTagName("img");
        if(images.length != 0) {
            let imageLinks = []
            for (let i = 0; i < images.length; i++) {
                if(images[i].src) {
                    imageLinks[i] = images[i].src;
                }
            }
            return imageLinks
        }
        return null
    }
    
    function update() {
        saving = true;

        packageText();
        packageImagesIntoData();

        let fetchOptions;
        
        fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(data),
        };

        fetchWithTimeout(`/admin/testpacks/${testpack}/${testset}/question_crud`, 
        fetchOptions, 30000)
        .then(response => {
			saving = false;
			return response.json();
		})
        .then(data => {
            if(data.success) {
                cleanUp();
                dispatch('update');
                dispatch('back');
            }
            else if (data.err) {
                saveError = data.err;
            }
            else if (data.serverErr){
                saveError = data.serverErr;
            }
        })
        .catch((error) => {
            saving = false;
            if (error.name === 'AbortError') {
                saveError = 'Server taking too long to respond! Request timed out';
            }
            console.error('Error:', error);
        });
    }
    
    function cleanUp() {
        id = null

        qnNumber = null;
        comprehension = null;
        passageNumber = null;
        passageDb = null;
        passageEdited = null;

        question = null;

        optionsAreImages = null;
        optionsHtml = null;

        correctAns = null;
        detailedAns = null;

        compImagesDb = []
        otherImagesDb = []

        jQuery("#passageEdit").trumbowyg('empty');
        jQuery("#questionEdit").trumbowyg('empty');
        jQuery("#optionsEdit").trumbowyg('empty');
        jQuery("#detailedAnsEdit").trumbowyg('empty');
    }
</script>

<style>
    .new-course-input {
        position: relative;
        text-align: left;
        overflow: scroll;
		margin: 2rem 5rem;
	}

    .feature-input {
        display: flex;
        align-items: center;
		margin: 1rem 0;
	}

    label {
		font-size: 1.5rem;
        margin-right: 1.5rem;
	}

    #passageEdit, #optionsEdit, #questionEdit, #detailedAnsEdit {
        height: 10rem;
    }

    .updating {
        display: flex;
        justify-content: space-evenly;
    }

    .btn {
        position: absolute;
        top: 2rem;
        right: 4rem;
        text-align:center;
        color: white;
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1.15rem 2.7rem;
        background: var(--blue);
        border: none;
        border-radius: 5px;
        box-shadow: none;
        cursor: pointer;
        outline: 0;
        z-index: 1;
    }

    .error-message {
        font-size: 1.2rem;
    }

    span{
        color: red;
    }

    button:disabled {
        background: darkgrey;
        cursor: default;
    }

    input {
        margin: auto 1rem auto 0;
    }
</style>

<div class="new-course-input">
    <Error showErr={saveError? true: false}>
        <p class="error-message">{saveError}</p>
    </Error>
    <p 
        class="btn" 
        on:click={() => {
            cleanUp();
            dispatch('back');
        }}>
        Go Back
    </p>
    
    <h3 for="sector">Edit Question</h3>
    <label>Question belongs to subject</label>
    <select bind:value={selectedSubj}>
        {#if $subjectStore && $subjectStore.length !=0 }
            {#each $subjectStore as subject}
                <option value="{subject._id}">{subject.subjectTitle}</option>
            {/each}
        {/if}
    </select>
    
    <div class="feature-input">
        <label for="qnNumberEdit">Question Number<span>*</span></label>
        <input 
            bind:value={qnNumber}
            id="qnNumberEdit" 
            type="number" 
            placeholder="Question Number"
        >
    </div>

    <div class="feature-input">
        <input 
            bind:checked={comprehension} 
            id="comprehensionEdit" 
            type="checkbox"
            on:change = {passageEditor}
        >
        <label for="comprehensionEdit">Comprehension</label>
    </div>
    {#if comprehension}
        <div class="feature-input">
            <label for="passageNumber">Passage Number<span>*</span></label>
            <input 
                bind:value={passageNumber}
                id="passageNumber" 
                type="number" 
                placeholder="Passage Number"
            >
        </div>
        <div>
            <h4>Passage</h4>
            <div id="passageEdit" placeholder="Type in a passage"></div>
        </div>
    {/if}

    <div>
        <h4>Question<span>*</span></h4>
        <div id="questionEdit" placeholder="Type in a question"></div>
    </div>

    <div class="feature-input">
        <input 
            bind:checked={optionsAreImages}
            id="optionImagesEdit" 
            type="checkbox"
            on:change = {setupEditor}
        >
        <label for="optionImagesEdit">Options as images (if you are using images for each 
        option, you must check this box)
        </label>
    </div>
    <div>
        <h4>Options<span>*</span></h4>
        <div 
            id="optionsEdit"
            placeholder = {
                optionsAreImages?"Insert images as options in order":
                "Type in each option as a paragraph and press enter-key"}
        >
        </div>
    </div>
    <div class="feature-input">
        <label for="correctAnsEdit">Correct Answer<span>*</span></label>
        <input 
            bind:value={correctAns}
            id="correctAnsEdit" 
            type="number" 
            placeholder="Option number (eg. '1')"
        >
    </div>
    <div>
        <h4>Detailed Answer<span>*</span></h4>
        <div 
            id="detailedAnsEdit"
            placeholder= "Type in the detailed answer for this question"
        >
        </div>
    </div>
    
    <div class="updating">
        <button 
            on:click={update}>Update</button>
        {#if saving}
            <SaveIndicator/>
        {/if}
    </div>
</div>