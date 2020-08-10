<script>
    import Modal from '../../../ui/Modal.svelte';

    import { createEventDispatcher } from 'svelte';

    export let displayInstructions;

    let dispatch = createEventDispatcher();

    let addQuestions;
    let genIns;
    let questState;
    let options;
    let detailAns;
    let passage;
    let qnHindi;
    let saveToDb;
    let editGeneral;
    let editPassage;
    let editQnHindi;
    let deleteQuestion;
</script>

<style>
    .container {
        display: grid;
        grid-template-columns: 20rem auto;
        width: 90%;
        background: white;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 57.5rem;
        padding: 3.5rem;
    }

    .toc, .content {
        height: 50rem;
        overflow-y: scroll;
    }

    .closeBtn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 3rem;
    }

    .closeBtn:hover {
        color: red;
        cursor: pointer;
    }

    .toc p{
        line-height: 2.5;
        font-weight: bold;
        cursor: pointer;
    }

    .suboptions p{
        padding-left: 1.5rem;
        line-height: 2.5;
        font-style: italic;
        font-weight: normal;
        cursor: pointer;
    }

    .content {
        padding: 1rem;
    }

    .red {
        color: red;
    }

    h2 {
        margin: 2.5rem 0;
    }

    h3 {
        margin: 2rem 0;
    }

    h5 {
        margin: 1.5rem 0;
    }
</style>

<Modal displayModal = {displayInstructions}>
    <div class="container">
        <!-- close button -->
        <span class="closeBtn" on:click = {()=> dispatch('close')}>
            <i class="fa fa-times" aria-hidden="true"></i>
        </span>

        <div class="toc">
            <p on:click = {()=> addQuestions.scrollIntoView()}>Adding Questions</p>
            <div class="suboptions">
                <p on:click = {() => genIns.scrollIntoView()}>General Instructions</p>
                <p on:click = {() => questState.scrollIntoView()}>Question Statement</p>
                <p on:click = {() => options.scrollIntoView()}>Options</p>
                <p on:click = {() => detailAns.scrollIntoView()}>Detailed Answer</p>
                <p on:click = {() => passage.scrollIntoView()}>Passages</p>
                <p on:click = {() => qnHindi.scrollIntoView()}>Question in Hindi</p>
                <p on:click = {() => saveToDb.scrollIntoView()}>Save to database</p>
            </div>
            <p on:click = {() => editGeneral.scrollIntoView()}>
                Editing and Deleting
            </p>
            <div class="suboptions">
                <p on:click = {() => editPassage.scrollIntoView()}>Passages</p>
                <p on:click = {() => editQnHindi.scrollIntoView()}>Question in Hindi</p>
                <p on:click = {() => deleteQuestion.scrollIntoView()}>Delete Question</p>
            </div>
        </div>
        <div class="content">
            <h2 bind:this={addQuestions}>Adding Questions</h2>
            <p>When it comes to adding questions in this system. A few things are to be 
            kept in mind. It is not an overly complicated system, but can be a little tricky to
            use the first few times. In the future however, the process will be made a bit easier. 
            Once you get familiar with it, it will be pretty easy to add questions into the database.</p>

            <h3 bind:this={genIns}>General Instructions</h3>
            <p>Most of the things on the page to add a question is self explanatory. Nevertheless, 
            it will be explained here for the sake of clarity.
            </p>

            <h5>Add Subject</h5>
            <p>Before one attempts to add a question, one should add a <b>Subject</b> 
            (subject actually refers to the sections of a test set. Eg: <em>Quantitative Aptitude, Reasoning etc</em>).
            Without adding a subject you cannot add a question into the database.
            </p>
            <p>Once a subject is added the questions part will be visible and one of the first options you should
            provide is the subject(aka section) to which a particular question belongs to.</p>
            <p>Note: If there is only one subject (if this test set is for covering a particular topic or subject),
            just give the same name as the topic which is being covered or maybe give something like "All Questions".
            </p>

            <h5>Question Number</h5>
            <p>Once you have selected the subject from the dropdown menu, you can give the question number. 
            This is the question number within a particular subject(aka section). The questions within a subject/seciton 
            will be ordered according to the question number you provided here.
            </p>
            <p>Once this is done, the next option you see is <em>Comprehension</em> and 
            <em>Add Hindi Version of the question</em>. This is where things get a little tricky and both of these 
            options are explained seperately. For now, just know that <em>one should only attempt to add the 
            Hindi Version of a question after everything else is typed in - Including the passage. </em>
            </p>
            <p>Fun fact: If you don't remember what question number comes next because you don't remember what was
            the last question you typed into a particular section, you can click on <strong>Questions in Database</strong>
            and check the questions already in database to confirm. <em><strong>Doing so will not reload the 
            page.</strong></em> Also, whatever content you have already typed in will be intact.</p>
            
            <h3 bind:this = {questState}>Question Statement</h3>
            <p>After selecting the subject and providing the question number, we come to the actual question 
            statement itself. Here one provides the question statement. This can be as long as you want. 
            However, if it is a question based on a comprehension or say Data Interpretation, you <strong>
            should use comprehension for that.</strong></p>
            <p>Also whatever instuctions are required should also be provided here. <br>For example, some 
            questions will have instructions like "Find the grammatical error from the following statements". And 
            then the actual statements will follow. <br>
            In this case the instructions might be same for multiple questions, however, it has to be 
            repeated for each of those question statements.
            </p>
            <p>You can also upload images in question statements. This might be useful in reasoning questions like
            pattern recognision.</p>

            <h3 bind:this = {options}>Options</h3>
            <p>Now that the question statements are added, we come to the trickier part - Options. <br>
            You might be confused on seeing just one area to give all the options. But it is actually pretty easy.
            We'll tackle this one by one.
            </p>
            <p>There are two types of options.</p>
            <ol>
                <li>Options without any images.</li>
                <li>Options with images.</li>
            </ol>

            <h5>Options without Images</h5>
            <p>For options without any images. Just type in each option into the editor and then <em>press Enter</em>
            When an Enter Key is pressed, each option will be registered. This means even after the final option,
            one must end it with an enter key else there will be some weird letters at the end of some options.
            </p>
            <p>You can give however many options you like this way. There are no theoretical restrictions. However, for 
            practical reasons it is adviced to give 6 options or below.</p>

            <h5>Options with Images</h5>
            <p>For options with images, first thing to be done is click on the checkbox that says <em>Options as 
            images.</em> Then you can add upload as many images as you like. However, keep the resolution of those as
            small as possible. Otherwise it would use up unnecessary space in the server and also, a large image for 
            each option not look good when a student is attempting the questions. 
            </p>
            <p><strong class="red">IMPORTANT NOTE:</strong> <br>
            Two things one should remember when adding images as options. First thing is, <strong>NEVER add images 
            without checking <em>Options as images.</em></strong> Not clicking this will somewhat break the system and
            your options won't show up for the user. <br>
            The second thing is, when <em>Options as images</em> is clicked whatever text you type into the 
            options editor in-between <strong>will not show up finally for the user.</strong> Essentially this means 
            that you can either make the options fully text-based OR fully image-based but not a mix of both.
            </p>

            <h5>Correct Answer</h5>
            <p>Once the options are provided, the next logical thing to do is to give the correct option.
            You can do that in the field that says <em>Correct Answer</em>. The correct option should be provided
            as a number. Option (a) would be 1, option (b) would be 2 etc.
            </p>

            <h3 bind:this = {detailAns}>Detailed Answer</h3>
            <p>Great, you have successfully entered all the details for the question to be displayed to the user.
            But what about the answer? Is just a correct option enough? Probably not. For this a detailed solution of
            the question, can be given in the editor field <em>Detailed Answer</em>.This would only be visible 
            to a student once he finishes attempting the test set.</p>
            <p>You can explain as much as you want. You can make it as long as a passage. But try to make it as 
            short as possible. Also, try to avoid using too many images. A maximum of 3 images will usually 
            suffice to explain a question to a student. <br>
            These practical things are given to avoid overloading the server with huge number of images. 
            Remember, the images you provide will be downloaded by thousands of students when they use our platform.
            So keeping the images as small as possible (both in resolution/size of file and also in number of images)
            would be the best long term strategy.
            </p>

            <h3 bind:this = {passage}>Passages</h3>
            <p>Whether it is a passage based question, or data interpretation question, the comprehension comes in handy 
            where the student has to refer a long passage or graphs to answer a particular question. To include such a 
            question first click on <em>Comprehension</em> checkbox. Clicking on this checkbox will bring up a new passage 
            editor-box and also a passage number box. Passage Number denotes that the passage being entered is 
            the 'nth'-one in the current subject/section. This number is used to keep track of the passage by the system.
            In short, each set of passage based questions will have the same passage number. <br> 
            For example: In a subject/section 'English', there might comprehension questions. For the first set of 
            comprehension we'll number the passage number as - 1. The next set of comprehension in the same 'English'
            section should have the passage number - 2 and so on...  
            </p>
            <p>One can now enter the passage into the editor just like 'Question Statement' part or 'Detalied Ans' 
            part. The usual warnings about the use of images applies. Keep the number and size of images low.</p>
            <p><strong class="red">IMPORTANT NOTE:</strong> <br>
            It is extremely important that all the questions based on one passage is entered together. To facilitate this,
            when you submit a passage based question, the passage part won't become empty. The system assumes that more
            questions based on the same passage are also going to be saved. <br>
            So, if a comprehension has say 5 questions, it is adviced that all the 5 questions be enterd in one after
            into the system. This is partly to make it easier for the one who enters all the questions and also due to
            technical issues in the backend. <br>
            Due to this limitation it can be difficult to put the comprehension questions in random order. However,
            after saving the set of comprehension questions, it is technically possible to change the question 
            numbers while editing and thereby shuffle the comprehension questions. But for now, just keep the 
            questions together.
            </p>

            <h3 bind:this = {qnHindi}>Question in Hindi</h3>
            <p>Once you have entered in the English version of a question you can enter the Hindi version of the 
            question. You can do this by clicking on the checkbox <em>Add Hindi Version of the question</em>.
            It is extremely important that you do not attempt to add the hindi version of the question 
            before completing the English part. <strong>This is mainly due to one reason and one reason only - images.
            </strong>If in any part of the question, be it the question statements, the passages, the options 
            or the detailed answer part, you have used images, when you click on the "Add Hindi Version", the system
            copies the entire contents of these parts and pastes it into the additional editors that popped up when you 
            checked the checkbox for adding hindi version. In these editors <strong>all you have to do is change
            the text in English to hindi.</strong> <strong>Do not touch the any of the images that was copied
            into these editors from their English counterparts.</strong> <br>
            By doing this you can upload all the images for the particular question into the English version and use the
            same images in the Hindi version too, without another uploading. (This also saves space in the server as
            there are no additional images for the hindi version to store in the server.)
            </p>
            <p>If however, there are no images in any part of the question, there is no issue entering the hindi version
            before the english version.</p>

            <h3 bind:this = {saveToDb}>Save to database</h3>
            <p>To save a question to database, it should have at a minimum the question number, the question statement,
            the options, correct answer (in numbers) and detailed answer. If any of these are not present, the save
            button will be disabled.</p>

            <h2 bind:this = {editGeneral}>Editing and deleting</h2>
            <p>To edit a question already in the database, simply click on <em>Questions in database</em> button,
            select the subject/section and the question number of the question you wish to edit. And now click on 
            edit button. This will bring up all the editors just like when you entered in the new question, execpt
            with all the saved contents.</p>

            <p>Most of the contents of a question can be edited like you would any other. You need to be careful 
            only on two areas. Passages and hindi version of questions.</p>

            <h3 bind:this = {editPassage}>Passage</h3>
            <p>When editing a passage, you might think that you'd need to edit the passage for multiple questions.
            But this is not so, when you edit a passage, every single passage with that particular passage number
            within that subject(aka section) will be updated (This is why the passage numbering system is used).</p>
            
            <h3 bind:this = {editQnHindi}>Question in Hindi</h3>
            <p>When editing one major thing is to be kept in mind - images. If you have read the previous section on
            adding hindi version in a new question you might know that images in the English version is used here too.
            So if you change the image in the English version, <strong>once you update the question the image in the 
            hindi version will be lost.</strong> <br>
            To avoid this, one just needs to use the new updated image in the English version. How to do that? This
            is a little tricky to do for a first timer. But once you do it, it becomes pretty easy. We'll go through it
            step by step.
            </p>
            <p>To update the image, first you'll have to delete the image in the english version of the question, 
            in the options, or the statements or the passage or whereever it is. Select near the image in the editor,
            and just press backspace to remove the image currently present. Now upload the new image just like you
            would normally. Now your english version has the new image.</p>
            <p>Next step is to get the link to the image somehow and put it in the hindi editor for question or options
            or whereever you changed the image for the english version. To do this, click on "&#60;&#62;" button in 
            the english version. This will show the content in some weird tags like &#60;p&#62; or &#60;/p&#62; etc.
            This is nothing to be scared of, and is just the HTML (a language) used to display text for the web.
            Our concern is to get the images, to do that, look for the <strong>&#60;img src='.....'&#62;</strong> 
            element. Here whatever is within <em>src</em> is the link to the image (as you can guess, <strong>
            img</strong> refers to image and <strong>src</strong> refers to source). This is the link we need to copy.
            It should look something like "https://s3.console.aws.amazon.com/s3/buckets/direction-academy/...".
            </p>
            <p>Once the link is copied, you can follow the same procedure to find the &#60;img src='.....'&#62; tag
            within the corresponding hindi part and then change the src="" to the copied link. This will change the
            image. Once all this is done, just click on update the question and you should be good to go.</p>
            <p><strong>Note:</strong> This is a bit complicated to do, and the author is aware of it. The best way
            to avoid this complication in the first place is to never be in a situation where you have to edit an 
            image in a question which has a hindi version. <br>
            If at all you are in such a situation, the above mentioned path is the only way to edit the images for the
            particular situation as of now.</p>

            <h3 bind:this = {deleteQuestion}>Delete Question</h3>
            <p>To delete a question is just as easy as editing. Once you select the question
            you want to delete from <strong>Questions in Database</strong>, just click on 
            <em>Delete</em> button right beside Edit button. It will ask for a confirmation,
            and once confirmed, the question will be deleted. </p>
        </div>
    </div>
</Modal>