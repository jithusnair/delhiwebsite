<script>
    import PreviewCard from './PreviewCard.svelte';

    import { goto } from '@sapper/app';
    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let data;

    let inside;

    function cardDelete() {
        dispatch('cardDelete', {id: data._id, courseTitle: data.courseTitle});
    }

    function cardEdit() {
        dispatch('cardEdit', data);
    }

    function cardGoTo() {
        goto(`/admin/videocourses/${data._id}`);
    }
</script>

<style>

	.course {
		width: 300px;
		margin: 5rem auto;
		border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        position: relative;
		height: 450px;
		text-align: left;
	}

    .hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1.5rem;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        font-size: 3rem;
    }

    table {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    tr {
        height: 75px;
    }

    td {
        vertical-align: middle;
        padding: 1rem;
    }

    .c-rud {
        color: white;    
    }

    i {
        text-align: center;
    }

    .text {
        text-align: right;
    }

    .c-rud:hover {
        cursor: pointer;  
        color: #3D0CFF;
    }
</style>

{#if true}
    <div 
        on:mouseenter={() => inside = true }
        on:mouseleave={() => inside = false }
        class="course" 
        transition:scale|local="{{duration: 400}}" >
        {#if inside}
            <div class="hover">
                <table>
                    <tbody>
                        <tr class="c-rud" on:click={cardGoTo}>
                            <td class="text">Show</td>
                            <td>
                                <i class="fa fa-eye" aria-hidden="true"></i>
                            </td>
                        </tr>
                        <tr class="c-rud" on:click={cardEdit}>
                            <td class="text">Edit</td>
                            <td>
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </td>
                        </tr>
                        <tr class="c-rud" on:click={cardDelete}>
                            <td class="text">Delete</td>
                            <td>
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        {/if}
        <PreviewCard {data}/>
    </div>
{/if}