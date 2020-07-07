<script>
    import TestPackPreviewCard from './TestPackPreviewCard.svelte';
    import ErrorSnackbar from '../../../components/ui/ErrorSnackbar.svelte';

    import { fetchWithTimeout } from '../../../_helpers/fetchWithTimeout.js';

    import { goto } from '@sapper/app';
    import { scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let testpack;

    let inside;

    let publishError;

    function cardDelete() {
        dispatch('cardDelete', {id: testpack._id, testPackTitle: testpack.testPackTitle});
    }

    function cardEdit() {
        dispatch('cardEdit', testpack);
    }

    function cardGoTo() {
        goto(`/admin/testpacks/${testpack._id}`);
    }

    function publishing() {
        fetchWithTimeout('/admin/testpacks/publish', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({_id: testpack._id})
        },
        30000)
        .then(response => response.json())
        .then(res => {
            if(res.success) {
				dispatch('publish');
            }
            else if (res.serverErr) {
				publishError = data.serverErr;
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                publishError = 'Server taking too long to respond! Request timed out';
			}
            console.error('Error:', error);
        });
	}
</script>

<style>
	.course {
        position: relative;
	}

    .hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1rem;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        font-size: 3rem;
        z-index: 999;
    }

    table {
        position: absolute;
        width: auto;
        box-shadow: none;
        border: none;
        width: auto;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    table, td {
        border: none;
    }

    tr:nth-child(even) {
        background-color: unset;
    }

    tr {
        height: 75px;
    }

    td {
        font-size: unset;
        line-height: unset;
        vertical-align: middle;
        padding: 1rem;
        color: unset;
    }

    .c-rud {
        color: white;    
    }

    i {
        text-align: center;
    }

    .text {
        text-align: left;
    }

    .c-rud:hover {
        cursor: pointer;  
        color: #3D0CFF;
    }

    .red {
        color: #D9200A;
    }

    .green {
        color: #4BB543;
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
                        <tr 
                            class="c-rud {testpack.published? 'green': 'red'}" 
                            on:click={publishing}
                        >
                            <td class="text">Published</td>
                            <td>
                                {#if testpack.published}
                                    <i class="fa fa-check-square-o" aria-hidden="true"></i>
                                {:else}
                                    <i class="fa fa-window-close-o" aria-hidden="true"></i>
                                {/if}
                            </td>
                        </tr>
                        <tr class="c-rud" on:click={cardGoTo}>
                            <td class="text">Tests</td>
                            <td>
                                <i class="fa fa-plus" aria-hidden="true"></i>
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
        <TestPackPreviewCard data = {testpack}/>
    </div>
{/if}

<ErrorSnackbar show={publishError}>
    <p>{publishError}</p>
</ErrorSnackbar>