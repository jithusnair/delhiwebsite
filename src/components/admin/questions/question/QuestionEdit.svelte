<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';
    import { subjectStore } from '../../../../store/subject.js';
    import { questionDisplay, selectedSubject } from '../../../../store/controller.js';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { onMount, onDestroy, createEventDispatcher } from 'svelte';

    import moment from 'moment';
    
    const dispatch = createEventDispatcher();

    export let testpack;
    export let testset;
    
    let copiedQuestion = {...$questionDisplay};

    let id = copiedQuestion._id;

    let hindiVersion = copiedQuestion.hindiVersion;
    let qnNumber = copiedQuestion.qnNumber;
    let comprehension = copiedQuestion.comprehension;
    let passageNumber = copiedQuestion.passageNumber;
    let passageDb = copiedQuestion.passage;
    let passageHindiDb = copiedQuestion.passageHindi;
    let passageEdited = copiedQuestion.passage;
    let passageHindiEdited = copiedQuestion.passageHindi;

    let question = copiedQuestion.question;
    let questionHindi = copiedQuestion.questionHindi;

    let optionsAreImages =  copiedQuestion.optionsAreImages;
    let optionsHtml = copiedQuestion.optionsHtml;
    let optionsHindiHtml = copiedQuestion.optionsHindiHtml;

    let correctAns = copiedQuestion.correctAns;
    let detailedAns = copiedQuestion.detailedAns;
    let detailedAnsHindi = copiedQuestion.detailedAnsHindi;

    let compImagesDb = [];
    let otherImagesDb = [];

    if(copiedQuestion.compImages) compImagesDb.push(...copiedQuestion.compImages);
    if(copiedQuestion.quesImages) otherImagesDb.push(...copiedQuestion.quesImages);
    if(copiedQuestion.optionsAreImages) otherImagesDb.push(...copiedQuestion.options);
    if(copiedQuestion.detailedAnsImagesDb) otherImagesDb.push(...copiedQuestion.detailedAnsImages);

    let compImagesToBeDeleted = [];
    let otherImagesToBeDeleted = [];

    let newImages = [];

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
            ['viewHTML'],
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
            ['viewHTML'],
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

    let editorSettingsHindi = {
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['unorderedList', 'orderedList'],
            ['table'],
            ['mathml'],
        ],
        resetCss: true,
        tagsToRemove: ['script'],
        removeformatPasted: true,
        semantic: true,
    }

    let editorSettingsHindiOptions = {
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['mathml']
        ],
        resetCss: true,
        tagsToRemove: ['script'],
        removeformatPasted: true,
        semantic: true,
    }
    
    $:  if(saveError) {
            setTimeout(() => {
                saveError = false;
            }, 10000);
    }
    
    onMount(()=>{
        setupEditor();
        if(hindiVersion) {
            hindiEditorInitialise();
        }

        if(comprehension) {
            passageEditor();
            jQuery("#passageEdit").trumbowyg('html', passageEdited);
        }
        jQuery("#questionEdit").trumbowyg('html', question);
        jQuery("#optionsEdit").trumbowyg('html', optionsHtml);
        jQuery("#detailedAnsEdit").trumbowyg('html', detailedAns);
    });

    function hindiEditorInitialise() {
        jQuery("#questionHindiEdit").trumbowyg(editorSettingsHindi)
        .on('tbwchange', function() { 
            questionHindi = jQuery('#questionHindiEdit').trumbowyg('html');
        });
        jQuery("#optionsHindiEdit").trumbowyg(editorSettingsHindiOptions)
        .on('tbwchange', function() {
            optionsHindiHtml = jQuery('#optionsHindiEdit').trumbowyg('html');
        });
        jQuery("#detailedAnsHindiEdit").trumbowyg(editorSettingsHindi)
        .on('tbwchange', function() {
            detailedAnsHindi = jQuery('#detailedAnsHindiEdit').trumbowyg('html');
        });

        // copy values in Db to editor
        jQuery("#questionHindiEdit").trumbowyg('html', questionHindi);
        jQuery("#optionsHindiEdit").trumbowyg('html', optionsHindiHtml);
        jQuery("#detailedAnsHindiEdit").trumbowyg('html', detailedAnsHindi);


        if(comprehension) {
            jQuery('#passageHindiEdit').trumbowyg(editorSettingsHindi)
            .on('tbwchange', function(){ 
                passageHindiEdited = jQuery('#passageHindiEdit').trumbowyg('html');
            });

            // copy values in Db to editor
            jQuery('#passageHindiEdit').trumbowyg('html', passageHindiDb);
        }
    }

    function newHindiVersionInitialise() {
        if(hindiVersion) {
            hindiEditorInitialise();
            // copy the english contents first
            jQuery("#questionEditHindi").trumbowyg('html', question);
            jQuery("#optionsEditHindi").trumbowyg('html', optionsHtml);
            jQuery("#detailedAnsEditHindi").trumbowyg('html', detailedAns);

            if(comprehension) {
                // copy passage content first
                jQuery("#passageHindiEdit").trumbowyg('html', passageEditor);
            }
        } else {
            questionsHindi = '';
            optionsHindiHtml = '';
            detailedAnsHindi = '';
            passageHindi = '';
        }
    }
    
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
        // any image in the new array that is not in the old array, save to old array.
        for (let i = 0; i < newArray.length; i++) {
            if(!oldArray.includes(newArray[i])) {
                oldArray.push(newArray[i]);
                newImages.push(newArray[i]);
            }
        }
    }

    function packageText() {
        data._id = id;
        data.subjectId = selectedSubj;
        data.qnNumber = qnNumber;

        data.hindiVersion = hindiVersion;
        data.comprehension = comprehension;
        if(comprehension) {
            data.passage = passageEdited;
            data.passageChanged = passageEdited != passageDb;
            data.passageNumber = passageNumber;
            data.optionsHindiHtml = optionsHindiHtml;
        }
        if(hindiVersion) {
            data.questionHindi = questionHindi;
            data.detailedAnsHindi = detailedAnsHindi;
            if(comprehension) {
                data.passageChanged = passageHindiDb != passageHindiEdited;
                data.passageHindi = passageHindiEdited;
            }
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
        let optionsHindi;
        if(optionsAreImages) {
            options = imageSrcParsing(optionsHtml);
            optionsHindi = options;
            if(options) otherImagesEditor.push(...options);
        } else {
            options = optionTextParsing(optionsHtml);
            optionsHindi = optionTextParsing(optionsHindiHtml);
        }
        data.options = options;
        data.optionsHindi = optionsHindi;

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
    function optionTextParsing(html) {
        let parser = new DOMParser();
        let parsedHtml = parser.parseFromString(html, 'text/html');

        let paragraphs = parsedHtml.getElementsByTagName("p");
        options = [];
        for (let i = 0; i < paragraphs.length; i++) {
            if(paragraphs[i].innerText) {
                options[i] = paragraphs[i].innerHTML;
            }
        }
        return options;
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
        passageHindiDb = null;
        passageHindiEdited = null;

        question = null;
        questionHindi = null;

        optionsAreImages = null;
        optionsHtml = null;
        optionsHindiHtml = null;

        correctAns = null;
        detailedAns = null;
        detailedAnsHindi = null;

        compImagesDb = [];
        otherImagesDb = [];

        jQuery("#passageEdit").trumbowyg('empty');
        jQuery("#questionEdit").trumbowyg('empty');
        jQuery("#optionsEdit").trumbowyg('empty');
        jQuery("#detailedAnsEdit").trumbowyg('empty');
        jQuery("#passageHindiEdit").trumbowyg('empty');
        jQuery("#questionHindiEdit").trumbowyg('empty');
        jQuery("#optionsHindiEdit").trumbowyg('empty');
        jQuery("#detailedAnsHindiEdit").trumbowyg('empty');
    }

    onDestroy(async () => {
        if(newImages.length != 0) {
            let link = `/admin/testpacks/${testpack}/${testset}/imagehandler?del=true`
            await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({imgArr: newImages}),
            })
        }
    })
    
    function beforeUnload() {
        // for chrome
        event.returnValue = '...';
        // more compatibility
        return '...';
    }

    async function onUnload() {
        if(newImages.length != 0) {
            let link = `/admin/testpacks/${testpack}/${testset}/imagehandler`
            await fetch(link, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({imgArr: newImages}),
            })
        }
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

<svelte:window on:beforeunload|preventDefault={beforeUnload} on:unload={onUnload}/>

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
    <div class="feature-input">
        <input 
            bind:checked={hindiVersion} 
            id="hindiVersionEdit" 
            type="checkbox"
            on:change = {newHindiVersionInitialise}
        >
        <label for="hindiVersionEdit">Add Hindi version of the question</label>
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
        {#if hindiVersion}
            <div>
                <h4>Passage in Hindi</h4>
                <div id="passageHindiEdit" placeholder="Type in a passage"></div>
            </div>
        {/if}
    {/if}

    <div>
        <h4>Question<span>*</span></h4>
        <div id="questionEdit" placeholder="Type in a question"></div>
    </div>
    {#if hindiVersion}
        <div>
            <h4>Questions in Hindi<span>*</span></h4>
            <div id="questionHindiEdit" placeholder="Type in a question"></div>
        </div>
    {/if}

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
    {#if hindiVersion}
        <div>
        <h4>Options in Hindi<span>*</span></h4>
        <div 
            id="optionsHindiEdit"
            placeholder = {
                optionsAreImages?"Insert images as options in order":
                "Type in each option as a paragraph and press enter-key"}
        >
        </div>
    </div>
    {/if}
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

    {#if hindiVersion}
        <div>
            <h4>Detailed Answer<span>*</span></h4>
            <div 
                id="detailedAnsHindiEdit"
                placeholder= "Type in the detailed answer for this question"
            >
            </div>
        </div>
    {/if}

    <div class="updating">
        <button 
            on:click={update}>Update</button>
        {#if saving}
            <SaveIndicator/>
        {/if}
    </div>
</div>