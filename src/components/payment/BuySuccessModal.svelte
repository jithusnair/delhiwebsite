<script>
    import Modal from '../ui/Modal.svelte';
    
    import moment from 'moment';

    import { scale } from 'svelte/transition';

    export let display = false;

    export let collection;

    export let orderDetails;
    export let courseTitle;

    let lastValidDate;

    $: if (orderDetails) {
        let boughtDate = moment(orderDetails.lastUpdated);
        lastValidDate = boughtDate.
            add(parseInt(orderDetails.courseValidity)+1, 'days')
            .startOf('day');
    }
</script>

<style>
    .paymentModal {
        width: 300px;
        padding: 0 10px 0 10px;
        position: fixed;
        top: 50%;
        left: 50%;
        background-color: white;
        height: auto;
        transform: translate(-50%, -50%);
        border-radius: 2rem;
        z-index: 1003;
    }
    
    p {
        margin: 1.5rem;
        text-align: left;
    }

    .paymentModal h3 {
        margin: 2rem auto 1rem auto;
        text-align: center;
    }

    button {
        margin: 1rem auto;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
    }
</style>

<Modal displayModal={display}>
    <div transition:scale|local={{duration: 500}} class="paymentModal">
        <h3>Thank You</h3>
        <p>Thank you for purchasing <strong>{courseTitle}</strong>. <br>
        The {collection} will be valid till
        {lastValidDate.format("dddd, MMMM Do YYYY, h:mm:ss a")} 
        </p>
        <button on:click>Close</button>
    </div>
</Modal>