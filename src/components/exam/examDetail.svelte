<script>
    export let examData;

    let currentActive = 0;
</script>

<style>
    h2 {
        text-align: center;
        margin-bottom: 4rem;
    }

    .exam {
        margin: 5rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--body-background);
        padding: 0 5rem;
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
        color: var(--text);
    }

    .tablinks:hover,
    .tab button.active {
        color: white;
        background-color: var(--blue);
    }

    .tabcontent {
        width: 60%;
    }

    @media only screen and (max-width: 940px) {
        .tab-wrapper {
            flex-direction: column;
        }
        .tablinks {
            width: 100%;
            margin-left: 0;
        }
        .tabcontent {
            margin-top: 3rem;
            padding: 0 3rem;
            width: 100%;
        }
        .tab-seperator {
            width: 95%;
            height: 1px;
            margin: 2.5rem auto;
            background-color: var(--text);
            opacity: 0.5;
        }
    }
    @media only screen and (max-width: 600px) {
        .tabcontent {
            padding: 0;
        }
        .tab-wrapper {
            width: 100%;
        }
        .exam {
            padding: 0 2rem;
        }
    }
</style>

{#if examData}
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
        </div>
    </div>
{/if}