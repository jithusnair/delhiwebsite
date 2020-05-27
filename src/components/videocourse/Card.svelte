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
        height: 37.5%;
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
        margin-bottom: 0.5rem
    }
    .tick {
        color: #4aae5e;
        line-height: 2.6rem !important;
        font-size: 2rem !important;
    }

    .plan-features p {
        font-size: 1.6rem;
        line-height: 2.6rem;
    }

    h4 {
        position: relative;
        text-align: left;
        margin: 0 auto;
        line-height: 2.5rem;
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
</style>

{#if data}
    <div class="course" id="img-1" transition:scale|local="{{duration: 400}}" >
        <img src="/images/cards/thumbnail.png" alt="">
        <div class="content">
            <h4>{data.courseTitle}</h4>
            <h2 class="price"><span>₹</span>&nbsp;{data.price}</h2>
            <hr class="card-seperator">
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
                depending on whether user has verified
                profile or purchased course
            -->
            <button 
                on:click={()=>goto(`/onlineclass/${data._id}`)}
                >
                Explore
            </button>
        </div>
    </div>
{/if}