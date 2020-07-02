<script>
    export let data;
</script>

<style>
    div {
        margin: 2rem;
    }

    table {
        color: var(--text);
        font-size: 1.6rem;
        line-height: 2.6rem;
    }
</style>

<div>
    <table>
        <tbody>
            <tr>
                <td>Name: </td>
                <td>{data.fullname}</td>
            </tr>
            <tr>
                <td>Email: </td>
                <td>{data.email}</td>
            </tr>
            <tr>
                <td>Mobile: </td>
                <td>{data.mobile}</td>
            </tr>
        </tbody>
    </table>
</div>