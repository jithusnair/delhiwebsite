<script>
    import { stores } from '@sapper/app';
    import { goto } from '@sapper/app';

    const { session } = stores();
    export let user;

    // Logout Logic
    function logout() {
        fetch('/admin/loginlogout', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    session.set({});
                    goto('/admin');
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }
 </script>

<style>
    .container {
        width: 80%;
        margin: 5rem auto;
        display: flex;
        justify-content: space-evenly;
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

    p:hover {
        cursor: pointer;
    }
</style>

<div class="container">
    <div class="card">
        <a href="/admin/usermanagement">Manage Users</a>
    </div>
    <div class="card">
        <a href="/admin/videocourse">Manage Online Video Courses</a>
    </div>
</div>

<div on:click={logout}><p>{user.fullname} wants to Logout</p></div>