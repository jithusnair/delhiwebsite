<script>
    import moment from 'moment';

    export let data;

    let color;
    let status;
    let validTillDate;

    $: if(data) {
        if(data.status == 'captured') {
            color='green';
            status = 'Paid';
            validTillDate = moment(data.lastUpdated).
                add(data.courseValidity+1,'days')
                .startOf('day')
        }
        else if(data.status == 'failed') {
            color='red';
            status = 'Failed'
        }
        else if(data.status == 'authorized') {
            color = 'yellow';
            status = 'Authorized'
        }
        else if(data.status == 'created') {
            color = 'blue';
            status = 'Created'
        }
    }
</script>

<style>
    .container {
        display: grid;
        width: 1000px;
        margin: 1rem auto;
        grid-template-columns: 175px 125px 125px 100px 125px 225px;
        grid-gap: 2rem;
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
        transition: 0.2s box-shadow;
    }

    .container:hover {
        box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.3);
        font-weight: bold;
    }

    p {
        display: flex;
        align-items: center;
        text-align: left;
        color: inherit;
    }

    .red {
        background-color: darkred;
        color: white;
    }

    .green {
        background-color: darkgreen;
        color: white;
    }

    .yellow {
        background-color: darkorange;
        color: black;
    }

    .blue {
        background-color: var(--nav-color);
        color: white;
    }

    .id {
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.25rem;
    }

    .validity {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #validityContainer {
        display: flex;

    }
</style>

<div class="container {color}">
    <p class="id">{data.orderId}</p>
    <p>{data.userId.fullname}</p>
    <p>{data.courseId.courseTitle}</p>
    <p class="price">₹{parseInt(data.amount)/100}</p>
    <p>{status}</p>
    <div id='validityContainer'>
        <div class="validity">
            <p>{moment(data.lastUpdated).format("MMM Do YYYY, h:mm:ss a")}</p>
            {#if validTillDate}
                <p>to</p>
                <p>{validTillDate.format("MMM Do YYYY, h:mm:ss a")}</p>
            {/if}
        </div>
    </div>
</div>