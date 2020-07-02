<script>
    import { scale } from 'svelte/transition';
    import { goto } from '@sapper/app'

    export let data;
</script>

<style>
    /* Override the global button properties */
    button {
        margin: 0 auto 0 auto;
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: auto;
        text-align:center;
    }

	img {
        object-fit: cover;
		width: 100%;
        border-top-left-radius: 1.5rem;
        border-top-right-radius: 1.5rem;
    }

	.course {
		width: 300px;
		margin: 5rem auto;
		border-radius: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        position: relative;
		height: 500px;
		text-align: left;
	}

	.content {
		padding: 0 3rem;
	}

    .plan-features {
        align-self: flex-start;
        margin: 0 0 1rem 0;
    }
    .plan-features div {
        display: flex;
        margin-bottom: 0.75rem
    }
    .tick {
        color: #4aae5e;
        line-height: 2.6rem;
        font-size: 2rem;
    }

    .plan-features p {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }

    h4 {
        position: relative;
        text-align: left;
        margin: 0 auto;
    }

    .card-seperator {
        width: 100%;
        background-color: #85858559;
        margin: 0 0 1rem 0;
    }

    .price {
        text-align: left;   
        color: rgb(93, 91, 255);
    }

    .learn {
        width: auto;
        background: rgb(93, 91, 255);
        box-shadow: none;
    }

    .gst {
        font-size: 1.5rem;
        color: grey;
    }
</style>

{#if data}
    <div class="course" id="img-1" transition:scale|local="{{duration: 400}}" >
        <img 
            src={data.image? data.image.url: '/images/course/default-thumbnail.png'}  
            alt="course thumbnail"
        >
        <div class="content">
            
            {#if !data.paid}
                <h4>{data.courseTitle}</h4>
                <h2 class="price">
                    <span>₹</span>&nbsp;{data.price}
                    <span class="gst">+ ₹{Math.floor(parseInt(data.price)*18)/100} GST</span>
                </h2>
                <hr class="card-seperator">
            {:else}
                <h3>{data.courseTitle}</h3>
            {/if}
            <div class="plan-features">
            {#each data.features as feature}
                {#if feature}
                    <div><i class="tick fa fa-check"></i>
                        <p>&nbsp;&nbsp;</p>
                        <p>{feature}</p>
                    </div>
                {/if}
            {/each}
            </div>
            <!-- 
                change button on:click and its content
                depending on whether user has purchased course
            -->
            <button 
                on:click={()=>goto(`/user/onlineclass/${data._id}`)}
                class={data.paid? 'learn': ''}
            >
                {#if data.paid}
                    Learn
                    <i class="fa fa-book" aria-hidden="true"></i>
                {:else}
                    Explore
                    <i class="fa fa-search" aria-hidden="true"></i>
                {/if}
            </button>
        </div>
    </div>
{/if}