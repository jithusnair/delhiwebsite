<script>
    import SaveIndicator from '../../../ui/SaveIndicator.svelte';
    import Error from '../../../ui/Error.svelte';
    import { subjectStore } from '../../../../store/subject.js';

    import { fetchWithTimeout } from '../../../../_helpers/fetchWithTimeout.js';

    import { onMount, onDestroy, createEventDispatcher } from 'svelte';

    import moment from 'moment';
    
    const dispatch = createEventDispatcher();

    export let testpack;
    export let testset;
    
    let id;

    let hindiVersion = false;
    let qnNumber;
    let comprehension = false;
    let sameAsBefore = false; // indicates if the comprehension passage questions
                              // are still being uploaded so that images may not be
                              // duplicated in s3.
    let passageNumber;
    let passage = '';
    let passageHindi = '' // should exist only if comprehension is true
    let question = '';
    let questionHindi = '';
    let optionsAreImages = false;
    let optionsHtml = '';
    let optionsHindiHtml = '';
    let correctAns; // as the index of 'options'
    let detailedAns = '';
    let detailedAnsHindi = ''; 
    let compImages = []; // array with links to passage-images in S3
    let quesImages = []; // array with links to question-images in S3
    let detailedAnsImages = [];
    let options = []; // array of image-links OR just text based options
    let optionsHindi = [];

    let allImagesUploaded = [];

    let selectedSubject = $subjectStore[0]._id;

    let selectedPartToEdit = 0;

    let editSelect = [
        {value: 0, desc: 'Comprehension'},
        {value: 1, desc: 'Question Statement'},
        {value: 2, desc: 'Options'},
        {value: 3, desc: 'Detailed Ans'},
    ];

    $: validInputs = 
        question && 
        optionsHtml && 
        detailedAns &&
        qnNumber &&
        correctAns &&
        ((comprehension && passage) || (!comprehension && !passage))

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
        jQuery("#question").trumbowyg(editorSettingsGeneral)
            .on('tbwchange', function(){ 
                question = jQuery('#question').trumbowyg('html');
                let newImgArr = imageSrcParsing(question);
                imagesNewAndOld(allImagesUploaded, newImgArr);
            });
        jQuery("#options").trumbowyg(editorSettingsForOptions)
            .on('tbwchange', function(){ 
                optionsHtml = jQuery('#options').trumbowyg('html');
                let newImgArr = imageSrcParsing(optionsHtml);
                imagesNewAndOld(allImagesUploaded, newImgArr);
            });
        jQuery("#detailedAns").trumbowyg(editorSettingsGeneral)
            .on('tbwchange', function(){ 
                detailedAns = jQuery('#detailedAns').trumbowyg('html');
                let newImgArr = imageSrcParsing(detailedAns);
                imagesNewAndOld(allImagesUploaded, newImgArr);
            });
    }

    function hindiEditorInitialise() {
        if(hindiVersion) {
            jQuery("#questionHindi").trumbowyg(editorSettingsHindi)
            .on('tbwchange', function() { 
                questionHindi = jQuery('#questionHindi').trumbowyg('html');
            });
            jQuery("#optionsHindi").trumbowyg(editorSettingsHindiOptions)
            .on('tbwchange', function() {
                optionsHindiHtml = jQuery('#optionsHindi').trumbowyg('html');
                let newImgArr = imageSrcParsing(optionsHtml);
                imagesNewAndOld(allImagesUploaded, newImgArr);
            });
            jQuery("#detailedAnsHindi").trumbowyg(editorSettingsHindi)
            .on('tbwchange', function() {
                detailedAnsHindi = jQuery('#detailedAnsHindi').trumbowyg('html');
                let newImgArr = imageSrcParsing(detailedAns);
                imagesNewAndOld(allImagesUploaded, newImgArr);
            });

            // copy the english contents first
            jQuery("#questionHindi").trumbowyg('html', question);
            jQuery("#optionsHindi").trumbowyg('html', optionsHtml);
            jQuery("#detailedAnsHindi").trumbowyg('html', detailedAns);

            if(comprehension) {
                jQuery('#passageHindi').trumbowyg(editorSettingsHindi)
                .on('tbwchange', function(){ 
                    passageHindi = jQuery('#passageHindi').trumbowyg('html');
                });

                // copy passage content first
                jQuery("#passageHindi").trumbowyg('html', passage);
            }
        }
        else {
            questionHindi = '';
            optionsHindi = '';
            detailedAnsHindi = '';
            passageHindi = '';
        }
    }

    function passageEditor() {
        jQuery('#passage').trumbowyg(editorSettingsGeneral)
        .on('tbwchange', function(){ 
            passage = jQuery('#passage').trumbowyg('html');
            if(!sameAsBefore) {
                let newImgArr = imageSrcParsing(passage);
                imagesNewAndOld(allImagesUploaded, newImgArr);
            }
        });
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

    function packageText() {
        data.subjectId = selectedSubject;
        data.qnNumber = qnNumber;

        data.hindiVersion = hindiVersion;

        if(hindiVersion) {
            data.questionHindi = questionHindi;
            data.optionsHindi = optionsHindi;
            data.detailedAnsHindi = detailedAnsHindi;
        }

        data.comprehension = comprehension;
        if(comprehension) {
            data.passageNumber = passageNumber;
            data.passage = passage;
            if(hindiVersion) {
                data.passageHindi = passageHindi;
            }
        } else {
            sameAsBefore = false;
        }

        data.question = question;

        data.optionsAreImages = optionsAreImages;
        data.optionsHtml = optionsHtml;
        if(!optionsAreImages) {
            data.options = optionTextParsing(optionsHtml);
            if(hindiVersion) {
                data.optionsHindi = optionTextParsing(optionsHindiHtml);
                data.optionsHindiHtml = optionsHindiHtml;
            }
        }

        data.correctAns = correctAns;
        data.detailedAns = detailedAns;
    }

    function packageImages() {
        let imagesFromEditor = [];

        if(comprehension) {
            data.compImages = imageSrcParsing(passage);
            if(!sameAsBefore) {
                if(data.compImages) imagesFromEditor.push(...data.compImages);
                sameAsBefore = true;
            }
        }

        data.quesImages = imageSrcParsing(question);
        if(data.quesImages) imagesFromEditor.push(...data.quesImages);

        if(optionsAreImages) {
            data.options = imageSrcParsing(optionsHtml);
            data.optionsHindi = options;
            if(data.options) imagesFromEditor.push(...data.options);
        }

        data.detailedAnsImages = imageSrcParsing(detailedAns);
        if(data.detailedAnsImages) imagesFromEditor.push(...data.detailedAnsImages);

        let imagesToBeDeleted = createDeleteList(allImagesUploaded, imagesFromEditor);
        data.imagesToBeDeleted = imagesToBeDeleted.length != 0? imagesToBeDeleted: null; 
    }

    function createDeleteList(imagesUploaded, imagesFromEditor) {
        let imagesToBeDeleted = [];

        if(!imagesUploaded || imagesUploaded.length === 0) {
            return [];
        } 
        else if(imagesFromEditor && imagesFromEditor.length !== 0) {
            for (let i = 0; i < imagesUploaded.length; i++) {
                if(!imagesFromEditor.includes(imagesUploaded[i])) {
                    imagesToBeDeleted.push(imagesUploaded[i]);
                }
            }
            return imagesToBeDeleted;
        }
        else {
            return imagesUploaded;
        }
    }
    
    function save() {
        saving = true;

        let fetchOptions;

        packageText();
        packageImages();
        
        fetchOptions = {
            method: 'POST',
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
                dispatch('save')
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
        qnNumber = 0;
        if(!comprehension) {
            comprehension = false;
            compImages = [];
            passage = '';
            passageNumber = null;
            sameAsBefore = false;
            if(hindiVersion) {
                passageHindi = '';
                jQuery("#passageHindi").trumbowyg('empty');
            }
            jQuery("#passage").trumbowyg('empty');
        } else {
            sameAsBefore = true;
        }
        quesImages = []; 
        question = '';
        questionHindi = '';
        optionsAreImages = false;
        options = [];
        optionsHindi = [];
        optionsHtml = '';
        optionsHindiHtml = '';
        correctAns = 0;
        detailedAns = '';
        detailedAnsHindi = '';

        jQuery("#question").trumbowyg('empty');
        jQuery("#options").trumbowyg('empty');
        jQuery("#detailedAns").trumbowyg('empty');

        jQuery("#questionHindi").trumbowyg('empty');
        jQuery("#optionsHindi").trumbowyg('empty');
        jQuery("#detailedAnsHindi").trumbowyg('empty');
    }

    onDestroy(async () => {
        if(allImagesUploaded.length != 0) {
            let link = `/admin/testpacks/${testpack}/${testset}/imagehandler?del=true`
            await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({imgArr: allImagesUploaded}),
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
        if(allImagesUploaded.length != 0) {
            let link = `/admin/testpacks/${testpack}/${testset}/imagehandler`
            await fetch(link, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({imgArr: allImagesUploaded}),
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

    #passage, #options, #question, #detailedAns {
        height: 10rem;
    }

    .saving {
        display: flex;
        justify-content: space-evenly;
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
    <h3 for="sector">New Questions</h3>
    <label>Question belongs to subject</label>
    <select bind:value={selectedSubject}>
        {#if $subjectStore && $subjectStore.length !=0 }
            {#each $subjectStore as subject}
                <option value="{subject._id}">{subject.subjectTitle}</option>
            {/each}
        {/if}
    </select>
    
    <div class="feature-input">
        <label for="qnNumber">Question Number<span>*</span></label>
        <input 
            bind:value={qnNumber}
            id="qnNumber" 
            type="number" 
            placeholder="Question Number"
        >
    </div>

    <div class="feature-input">
        <input 
            bind:checked={comprehension} 
            id="comprehension" 
            type="checkbox"
            on:change = {passageEditor}
        >
        <label for="comprehension">Comprehension</label>
    </div>
    <div class="feature-input">
        <input 
            bind:checked={hindiVersion} 
            id="hindiVersion" 
            type="checkbox"
            on:change = {hindiEditorInitialise}
        >
        <label for="hindiVersion">Add Hindi version of the question</label>
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
            <h4>Passage in English</h4>
            <div id="passage" placeholder="Type in a passage"></div>
        </div>
        {#if hindiVersion}
            <div>
                <h4>Passage in Hindi</h4>
                <div id="passageHindi" placeholder="Type in a passage"></div>
            </div>
        {/if}
    {/if}

    <div>
        <h4>Question in English<span>*</span></h4>
        <div id="question" placeholder="Type in a question"></div>
    </div>
    {#if hindiVersion}
        <div>
            <h4>Question in Hindi<span>*</span></h4>
            <div id="questionHindi" placeholder="Type in a question"></div>
        </div>
    {/if}

    <div class="feature-input">
        <input 
            bind:checked={optionsAreImages}
            id="optionImages" 
            type="checkbox"
        >
        <label for="optionImages">Options as images (if you are using images for each 
        option, you must check this box)
        </label>
    </div>
    <div>
        <h4>Options<span>*</span></h4>
        <div 
            id="options"
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
                id="optionsHindi"
                placeholder = {
                    optionsAreImages?"Insert images as options in order":
                    "Type in each option as a paragraph and press enter-key"}
            >
            </div>
        </div>
    {/if}
    <div class="feature-input">
        <label for="correctAns">Correct Answer<span>*</span></label>
        <input 
            bind:value={correctAns}
            id="correctAns" 
            type="number" 
            placeholder="Option number (eg. '1')"
        >
    </div>
    <div>
        <h4>Detailed Answer<span>*</span></h4>
        <div 
            id="detailedAns"
            placeholder= "Type in the detailed answer for this question"
        >
        </div>
    </div>
    {#if hindiVersion}
        <div>
            <h4>Detailed Answer in Hindi<span>*</span></h4>
            <div 
                id="detailedAnsHindi"
                placeholder= "Type in the detailed answer for this question"
            >
            </div>
        </div>
    {/if}
    <div class="saving">
        <button 
            disabled={!validInputs} 
            on:click={save}>Save To Database</button>
        {#if saving}
            <SaveIndicator/>
        {/if}
    </div>
</div>