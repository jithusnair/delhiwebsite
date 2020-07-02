<script>
    import moment from 'moment';

    export let data;
</script>

<style>
    .card {
        width: 320px;
        margin: 1rem auto;
        background-color: white;
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
        transition: 0.2s box-shadow;
    }

    .card:hover {
        box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.3);
        font-weight: bold;
    }

    table {
        width: 100%;
        font-size: 1.5rem; 
    }

    .head {
        text-align: center;
        padding: 2rem;
        width: 15%;
    }

    .data {
        text-align: left;
    }

    i {
        font-size: 2.5rem;
        font-weight: inherit;
    }

    h3 {
        text-align: center;
    }
</style>

<div class="card">
    <h3>{data.fullname}</h3>
    <table>
        <tbody>
            <tr>
                <td class="head">
                    <i class="fa fa-envelope-o" aria-hidden="true"></i>
                </td>
                <td class="data">{data.email}</td>
            </tr>
            <tr>
                <td class="head">
                    <i class="fa fa-phone" aria-hidden="true"></i>
                </td>
                <td class="data">{data.mobile}</td>
            </tr>
            <tr>
                <td class="head">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                </td>
                <td class="data">{moment(data.dob).format("DD-MM-YYYY")}</td>
            </tr>
            <tr>
                <td class="head">
                    <i class="fa fa-id-card-o" aria-hidden="true"></i>
                </td>
                <td class="data">{data.profession}</td>
            </tr>
            <tr>
                <td class="head">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                </td>
                <td class="data">{data.address}</td>
            </tr>
        </tbody>
    </table>
</div>