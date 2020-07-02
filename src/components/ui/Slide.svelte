<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';

    export let data;

    let intervalTimer;

    onMount(()=>{
        slideShow();
    })

    let current = 0;
    let tempCurrent = 0;

    function changeImage() {
        current = tempCurrent;
    }

    function changeForTransition(temp) {
        if(temp != current) {
            current = null;
            tempCurrent = temp;
            clearInterval(intervalTimer);
        }
    }

    function slideShow() {
        let i = 1;
        intervalTimer = setInterval(()=>{
            if(i < data.length) {
                current = null;
            }
            else {
                i = 0;
                current = null;
            }
            tempCurrent = i;
            i++;
        }, 5000)
    }

    function previous() {
        tempCurrent = tempCurrent - 1;
        tempStatus();                       
    }

    function next() {
        tempCurrent = tempCurrent - 1;
        tempStatus();      
    }

    function tempStatus() {
        tempCurrent = 
            tempCurrent < 0? data.length - 1:
            tempCurrent > data.length - 1? 0: 
            tempCurrent;
        current = null;
        clearInterval(intervalTimer);
    }
</script>

<style>
    .container {
        width: 100%;
        position: relative;
        height: 318px;
    }

    img {
        width: 100%;
    }

    .dots {
        position: absolute;
        bottom: 2%;
        left: 50%;
        transform: translateX(-50%);
    }

    .dot {
        cursor: pointer;
        height: 1.5rem;
        width: 1.5rem;
        margin: 0 0.5rem;
        background-color: grey;
        border-radius: 50%;
        display: inline-block;
        transition: background-color 0.6s ease;
    }

    .active {
        background-color: white;
        width: 1.55rem;
        height: 1.55rem;
    }

    #previous, #next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transition: color 0.3s;
        cursor: pointer;
        font-size: 3rem;
    }

    #previous {
        left: 2%;
    }

    #next {
        right: 2%;
    }

    @media (hover: hover) {
        #previous:hover, #next:hover {
            color: white;
        }
        .dot:hover {
            background-color: white;
            width: 1.55rem;
            height: 1.55rem;
        }
    }

    @media only screen and (max-width:1000px) {
        img {
            object-fit: cover;
            object-position: 50% 50%;
            height: 100%;
        }

        .container {
            height: 300px;
        }
    }

    @media only screen and (max-width:500px) {
        .container {
            height: 150px;
        }

        .dot {
            width: 1rem;
            height: 1rem
        }

        .active, .dot:hover {
            width: 1.05rem;
            height: 1.05rem;
        }

        .dots {
            bottom: 1%;
        }
    }
</style>

<div class="container">
    {#each data as src, i}
        {#if current == i}
            <a href={src.link? src.link : ''}>
                <img 
                    transition:fade|local={{duration: 700}} 
                    on:outroend={changeImage}
                    src={src.img} alt=''>
            </a>
        {/if}
    {/each}
    <div class="dots">
        {#each data as src, i}
            <span
                class="{current == i? 'active': ''} dot"
                on:click={()=>changeForTransition(i)}
            >
            </span>
        {/each}
    </div>
    <p id="previous" on:click={previous}>&#10094;</p>
    <p id="next" on:click={next}>&#10095;</p>
</div>
