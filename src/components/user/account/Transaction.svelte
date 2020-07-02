<script>
    import moment from 'moment';

    export let data;
</script>

<style>
    .container {
        margin: 2rem 0;
        width: 300px;
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
        transition: 0.2s box-shadow;
    }

    .container:hover {
        box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.3);
    }

    strong {
        text-align: center;
    }

    @media only screen and (max-width: 600px) {
        .container {
            margin: 2rem auto;
        }
    } 
</style>

<div class="container">
    <p class=""><strong>{data.courseId.courseTitle}</strong></p>
    <p class="">ID: {data.orderId}</p>
    <p class="">Paid: ₹{data.courseId.price}</p>
    <p class="">Paid On: {moment(data.lastUpdated).format("MM-DD-YYYY, h:mm a")}</p>
    <p class="">Course expiry: {moment(data.validTill).format("MM-DD-YYYY, h:mm a")}</p>
</div>