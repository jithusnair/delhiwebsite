<script>
    import { questionDisplay, selectedEnglish } from '../../../../store/controller.js';

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    let selectedOption = 0;

    let languageOptions = [
        {language: "English", value: true},
        {language: "Hindi", value: false}
    ];

    let language = $selectedEnglish;

    function selectsLanguage() {
        selectedEnglish.set(language);
    }
</script>

<style>
    .options {
        display: grid;
        grid-template-columns: auto;
    }

    hr {
        background-color: var(--text);
        margin: 1rem 0;
    }

    .pad {
        padding: 0 2rem;
    }

    .qnNo {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modes {
        display: flex;
        justify-content: space-evenly;
    }

    i {
        font-size: 1.5rem;
    }

    #edit, #delete {
        padding: 1rem;
        cursor: pointer;
    }

    #edit:hover {
        color: white;
        background-color: var(--text);
        font-weight: bold;
    }

    #delete:hover {
        color: white;
        background-color: red;
        font-weight: bold;
    }

    .eachOption {
        display: grid;
        grid-template-columns: 1rem auto;
        grid-gap: 2.5rem;
        align-items: center;
    }

    .questionandpassage {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .questiononly {
        display: grid;
        grid-template-columns: 1fr;
    }

    .passage {
        overflow: scroll;
        height: 400px;
    }

    .qn {
        overflow-y: scroll;
        height: 400px;
    }
</style>

{#if $questionDisplay != 0}
    <div class="pad qnNo">
        <p><strong>Question Number {$questionDisplay.qnNumber}</strong></p>
        <div class="modes">
            <select bind:value={language} on:change={selectsLanguage}>
                <option value={languageOptions[0].value}>{languageOptions[0].language}</option>
                <option value={languageOptions[1].value}>{languageOptions[1].language}</option>
            </select>
            <p id="edit" on:click = {() => dispatch('edit')}>Edit 
                <i class="fa fa-pencil" aria-hidden="true"></i>
            </p>
            <p id="delete" on:click = {() => dispatch('delete')}>Delete 
                <i class="fa fa-trash-o" aria-hidden="true"></i>
            </p>
        </div> 
    </div>
    <hr>
    {#if $selectedEnglish}
        <!-- Comprehension -->
        {#if $questionDisplay.comprehension}
            <div class="questionandpassage">
                <div class="passage">{@html $questionDisplay.passage}</div>
                <div class="pad qn">
                    <!-- Question -->
                    {#if $questionDisplay.comprehension}
                        <p><strong>Qn No. {$questionDisplay.qnNumber}</strong></p>
                    {/if}
                    <div>{@html $questionDisplay.question}</div>
                    <!-- Options -->
                    <div class="options">
                        {#each $questionDisplay.options as option, i}
                            {#if $questionDisplay.optionsAreImages}
                            <div class="eachOption">
                                <input type = radio bind:group={selectedOption} value={i}>
                                <img src="{option}" alt="Option number {i+1}">
                            </div>
                            {:else}
                            <div class="eachOption">
                                <input type = radio bind:group={selectedOption} value={i}>
                                <p>{option}</p>
                            </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <div class="questiononly">
                <div class="pad qn">
                    <!-- Question -->
                    <div>{@html $questionDisplay.question}</div>
                    <!-- Options -->
                    <div class="options">
                        {#each $questionDisplay.options as option, i}
                            {#if $questionDisplay.optionsAreImages}
                            <div class="eachOption">
                                <input type = radio bind:group={selectedOption} value={i}>
                                <img src="{option}" alt="Option number {i+1}">
                            </div>
                            {:else}
                            <div class="eachOption">
                                <input type = radio bind:group={selectedOption} value={i}>
                                <p>{option}</p>
                            </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    {:else if $questionDisplay.hindiVersion}
        <!-- Comprehension -->
        {#if $questionDisplay.comprehension}
            <div class="questionandpassage">
                <div class="passage">{@html $questionDisplay.passageHindi}</div>
                <div class="pad qn">
                    <!-- Question -->
                    {#if $questionDisplay.comprehension}
                        <p><strong>Qn No. {$questionDisplay.qnNumber}</strong></p>
                    {/if}
                    <div>{@html $questionDisplay.questionHindi}</div>
                    <!-- Options -->
                    <div class="options">
                        {#each $questionDisplay.optionsHindi as option, i}
                            {#if $questionDisplay.optionsAreImages}
                                <div class="eachOption">
                                    <input type = radio bind:group={selectedOption} value={i}>
                                    <img src="{option}" alt="Option number {i+1}">
                                </div>
                            {:else}
                                <div class="eachOption">
                                    <input type = radio bind:group={selectedOption} value={i}>
                                    <p>{option}</p>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <div class="questiononly">
                <div class="pad qn">
                    <!-- Question -->
                    <div>{@html $questionDisplay.questionHindi}</div>
                    <!-- Options -->
                    <div class="options">
                        {#each $questionDisplay.optionsHindi as option, i}
                            {#if $questionDisplay.optionsAreImages}
                            <div class="eachOption">
                                <input type = radio bind:group={selectedOption} value={i}>
                                <img src="{option}" alt="Option number {i+1}">
                            </div>
                            {:else}
                            <div class="eachOption">
                                <input type = radio bind:group={selectedOption} value={i}>
                                <p>{option}</p>
                            </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    {/if}
{/if}