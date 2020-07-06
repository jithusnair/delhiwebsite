<script>
    import { createEventDispatcher } from 'svelte';

    export let examData;

    let dispatch = createEventDispatcher();

    let currentActive = 0;
</script>

<style>
    h2 {
        text-align: center;
    }

    .exam {
        margin: 5rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--body-background);
    }

    .tab-wrapper {
        margin-top: 3rem;
        display: flex;
        justify-content: space-around;
        width: 90%;
        padding: 5rem 3rem;
        -webkit-box-shadow: -1px 1px 4px 0 rgba(117, 138, 172, 0.12);
        box-shadow: -1px 1px 4px 0 rgba(117, 138, 172, 0.12);
        background-color: #fff;
        position: relative;
    }

    .tab {
        display: flex;
        flex-direction: column;
    }

    .tablinks {
        width: 23rem;
        border: none;
        text-align: left;
        font-weight: 500;
        background-color: transparent;
        background: none;
        margin: 0.5rem 0;
        margin-left: 1rem;
        padding: 0.7rem 5rem 0.7rem 1.5rem;
        border-radius: 6px;
        box-shadow: none;
        color: black
    }

    .tablinks:hover,
    .tab button.active {
        color: white;
        background-color: var(--blue);
    }

    .tabcontent {
        width: 60%;
    }
    
    .editanddelete {
        display: flex;
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    i {
        font-size: 3rem;
        margin: 1rem;
    }

    #edit:hover {
        color: var(--blue);
        cursor: pointer;
    }

    #delete:hover {
        color: red;
        cursor: pointer;
    }
</style>

<div class="exam">
    <h2>{examData.examTitle}</h2>
    <div class="tab-wrapper">
        <div class="tab">
            {#each examData.heads as tab, i}
                {#if tab != ''}
                    <button 
                        on:click={() => currentActive = i} 
                        class="tablinks {currentActive == i? 'active': ''}">{tab}
                    </button>
                {/if}
            {/each}
        </div>

        <hr class="tab-seperator">
        {#each examData.details as detail, i}
            {#if currentActive == i}
                <div class="tabcontent">
                    {@html detail}
                </div>
            {/if}
        {/each}

        <div class="editanddelete">
            <div on:click={()=>dispatch('edit')} id="edit">
                <i class="fa fa-pencil-square" aria-hidden="true"></i>
            </div>
            <div on:click={()=>dispatch('delete')} id='delete'>
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>
    </div>
</div>