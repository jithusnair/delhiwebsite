<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    const { session } = stores();
 </script>

<style>
    .container {
        width: 85%;
        margin: 0 auto;
        display: grid;
        justify-content: start;
        grid-gap: 5rem;
        grid-template-columns: 200px 200px 200px;
        grid-auto-flow: dense;
        height: 250px;
    }

    .card {
        width: 200px;
        height: 200px;
        background-color: white;    
        border-radius: 2rem;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.3s box-shadow;
    }

    .card:hover {
        box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.3);
    }

    a {
        text-align: center;
        font-size: 2rem;
    }
</style>

<div class="container">
    <div class="card">
        <a href="/admin/videocourses">Manage Online Video Courses</a>
    </div>
    <div class="card">
        <a href="/admin/orders">Look-up Orders Placed</a>
    </div>
</div>

<div class="container">
    <div class="card">
        <a href="/admin/users">Look-up Users</a>
    </div>
    <div class="card">
        <a href="/admin/petitioners">Look-up Petitioners</a>
    </div>
</div>

<div class="container">
    <div class="card">
        <a href="/admin/sectors">Manage Sectors</a>
    </div>
</div>