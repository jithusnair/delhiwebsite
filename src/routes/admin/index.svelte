<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    const { session } = stores();
 </script>

<style>
    .container {
        width: 80%;
        margin: 0 auto;
        display: grid;
        justify-content: center;
        grid-gap: 5rem;
        grid-template-columns: 200px 200px 200px;
        grid-auto-flow: dense
    }

    .card {
        width: 200px;
        height: 200px;
        border-radius: 2rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        padding: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.5s box-shadow;
    }

    .card:hover {
        box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.2);
    }

    a {
        text-align: center;
        font-size: 2rem;
    }
</style>

<div class="container">
    <div class="card">
        <a href="/admin/usermanagement">Manage Users</a>
    </div>
    <div class="card">
        <a href="/admin/videocourses">Manage Online Video Courses</a>
    </div>
</div>