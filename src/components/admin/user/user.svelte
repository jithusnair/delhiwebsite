<script>
export let data;

</script>

<style>
    div {
        display: grid;
        width: 900px;
        margin: 1rem auto;
        grid-template-columns: 150px 300px 200px 200px;
        grid-gap: 2rem;
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
        transition: 0.2s box-shadow;
    }

    div:hover {
        box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.3);
    }

    p {
        text-align: left;
    }

    .red {
        color: darkred;
    }

    .green {
        color: darkgreen;
    }

</style>

<div>
    <p><strong>{data.fullname}</strong></p>
    <p>{data.email}</p>
    <p>{data.mobile}</p>
    <p class={data.isVerified? 'green': 'red'}>{data.isVerified? 'Verified': 'Not Verified'}</p>
</div>