<script>
    import {
        sectionStore,
        chapterStore,
        testSetsStore,
        chapterDisplayStore,
        testSetsDisplayStore
    } from '../../store/testsets-controller.js';

    let selectedSection = $sectionStore[0]._id;;
    let selectedChapter = $chapterStore[selectedSection][0]._id;

    let rotate = false;
    let showFilter = false;

    function sectionChange() {
        if($chapterStore[selectedSection][0]) {
            selectedChapter = $chapterStore[selectedSection][0]._id;
            chapterDisplayStore.set($chapterStore[selectedSection]);
            testSetsDisplayStore.set($testSetsStore[selectedChapter]);
        } 
        else {
            chapterDisplayStore.set(0);
            testSetsDisplayStore.set(0);
        }
    }

    function chapterChange() {
        testSetsDisplayStore.set($testSetsStore[selectedChapter]);
    }

    function filterIconClick() {
        rotate = !rotate;
        showFilter = !showFilter;
    }
</script>

<style>
    .practice-filter{
        /* position: sticky;
        top:10rem; */
    }

    .filter-div h4{
        font-size: 1.8rem;
    }

    .dropdown{
        margin-top: 1rem;
        width:20rem;
    }

    .filter-div{
        margin-top: 3rem;
        display: flex;
        flex-direction: column;
    }

    .filter-radio{
        margin-top: 1rem;
    }

    /* The Radio Button Styling Starts */
    .radio-label {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    .radio-label input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }

    label {
        font-size: 1.6rem;
        line-height: 2.6rem;
        color: var(--text);
    }
    
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: rgb(224, 224, 224);
        border-radius: 50%;
    }
    
    .radio-label:hover input ~ .checkmark {
        background-color: #ccc;
    }
    
    .radio-label input:checked ~ .checkmark {
        background-color: var(--nav-color);
    }
    
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }
    
    .radio-label input:checked ~ .checkmark:after {
        display: block;
    }
 
    .radio-label .checkmark:after {
        top: 6.5px;
        left: 6.5px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: white;
    }
    /* The Radio Button Styling Ends */

    .float-icon{
        display: none;
    }

    @media screen and (max-width:970px){
        .float-icon{
            z-index:3;
            position: absolute;
            position: -webkit-sticky;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--nav-color);
            box-shadow: 0px 2px 5px #666;
            transform:scale(.9);
            width: 8rem;
            height:8rem;
            border-radius: 50%;
        }
        .float-icon i{
            color:white;
            font-size: 3.7rem;
            -moz-transition: all 400ms ease-in-out;
            -webkit-transition: all 400ms ease-in-out;
            transition: transform 400ms ease-in-out;
        }

        .rotate{
            -ms-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
        
        .practice-filter{
            display: none;
            opacity: 0;
            position: fixed;
            top:0;
            left:0;
            padding-top: 15vh;
            padding-left: 7vw;
            width: 100%;
            height: 100%;
            z-index: 2;
            background-color: white;
        }

        .showFilter{
            display: block;
            opacity: 1;
        }
        .dropdown{
            min-width:20rem;
            width:40vw;
        }
    }

    @media screen and (max-width:600px){
        .float-icon{
            transform:scale(.8);
        }
    }
</style>


<div class="practice-filter" class:showFilter>
    <h3>Examination</h3>
    <select class="dropdown" bind:value={selectedSection} on:change={sectionChange}>
        {#each $sectionStore as section}
            <option value={section._id}>{section.sectionTitle}</option>
        {/each}
    </select>

    {#if $chapterDisplayStore && $chapterDisplayStore.length != 0 }
        <div class="filter-div">
            <h4><i class="fa fa-filter"></i>&nbsp;Filter by Subject</h4>
            <div class="filter-radio">
                {#each $chapterDisplayStore as chapter, i}
                    <label class="radio-label">{chapter.chapterTitle}
                        <input 
                            type="radio" 
                            name="subject-radio"
                            bind:group={selectedChapter}
                            value={chapter._id}
                            on:change={chapterChange}
                        >
                        <span class="checkmark"></span>
                    </label>
                {/each}
            </div>
        </div>
    {/if}
</div>

<div class="float-icon" on:click={filterIconClick}>
    <i class="fa fa-filter" class:rotate></i>
</div>