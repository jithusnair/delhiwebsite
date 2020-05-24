<script>
    import PreviewVideo from './PreviewVideo.svelte';

    import { goto } from '@sapper/app';
    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let data;

    let inside;

    function videoDelete() {
        dispatch('videoDelete', {id: data._id, title: data.title});
    }

    function videoEdit() {
        dispatch('videoEdit', data);
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
</style>

{#if data}
    <div 
        on:mouseenter={() => inside = true }
        on:mouseleave={() => inside = false }
        class="course" 
        transition:scale|local="{{duration: 400}}" 
    >
        <PreviewVideo videoData={data}/>
        {#if inside}
            <div class="hover">    
                <i
                    on:click={videoEdit} 
                    class="fa fa-pencil-square-o" 
                    aria-hidden="true">
                </i>
                <i
                    on:click={videoDelete} 
                    class="fa fa-trash"
                    aria-hidden="true">
                </i>
            </div>
        {/if}
    </div>
{/if}