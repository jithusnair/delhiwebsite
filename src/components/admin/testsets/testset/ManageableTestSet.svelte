<script>
    import TestSetDisplay from './TestSetDisplay.svelte';

    import { goto } from '@sapper/app';
    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let testSet;

    let inside;

    function testSetDelete() {
        dispatch('testSetDelete', {id: testSet._id, testSetTitle: testSet.testSetTitle});
    }

    function testSetEdit() {
        dispatch('testSetEdit', testSet);
    }
</script>

<style>
    .course {
        display: flex;
        align-items: center;
    }

    .hover {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        color: black;
        font-size: 3rem;
        margin-left: 1rem;
    }

    i {
        margin-top: 1rem;
        text-align: center;
        text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    .fa-trash {
        color: red;
    }

    .fa-plus {
        color: green;
    }
</style>

{#if testSet}
    <div 
        on:mouseenter={() => inside = true }
        on:mouseleave={() => inside = false }
        class="course" 
        transition:scale|local="{{duration: 400}}" 
    >
        <TestSetDisplay {testSet}/>
        {#if inside}
            <div class="hover">
                <i
                    on:click={()=> dispatch('goto', testSet._id)}
                    class="fa fa-plus" 
                    aria-hidden="true">
                </i>
                <i 
                    on:click={testSetEdit} 
                    class="fa fa-pencil-square-o"
                    aria-hidden="true"
                ></i>
                <i 
                    on:click={testSetDelete} 
                    class="fa fa-trash"
                    aria-hidden="true"
                ></i>
            </div>
        {/if}
    </div>
{/if}