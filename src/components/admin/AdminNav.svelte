<script>
  import { stores } from '@sapper/app';
  import { goto } from '@sapper/app';
  const { session } = stores();
  
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
                    goto('/backdoor');
                    session.set({});
                }
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }
</script>

<style>
    .sidenav {
        height: 100%;
        width: 225px;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        background-color:  rgb(34,39,73);
        overflow-x: hidden;
        padding-top: 10px;
        font-size: 1.5rem;
        transition: width 0.5s;
    }

    .sidenav a  {
        outline: 0;
        border: none;
        --moz-outline-style: none;
    }

    .btn{
        margin: 1rem auto;
        font-size: 1.5rem;
        background: none;
        border: 1px solid white;
        border-radius: 3px;
        width: 9.5rem;
        padding: 5px 0;
        color: white;
        font-family: Manrope, sans-serif;
        font-weight: 700;
        line-height: 2rem;
        -webkit-appearance: none;
        text-align: center;
        outline: none;
        cursor: pointer;
    }

    /* Style the sidenav links and the dropdown button */
    .sidenav a {
        padding: 6px 8px 6px 16px;
        text-decoration: none;
        color: white;
        display: block;
        border: none;
        background: none;
        width:100%;
        text-align: left;
        cursor: pointer;  
    }

    a {
        margin-top: 1.7rem;
        margin-left: 1rem;
        margin-bottom: 1.7rem;
    }

    /* On mouse-over */
    .sidenav a:hover {
        color: rgb(136, 136, 247); 
    }

    #logo{
        z-index: 999;
        padding:1rem 2vw 1rem 0;
        color: #fff;;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-top: 0;
    }

    .logo-img {
        width: 4rem;
        margin-right: 10px;
    }

    .logo-name {
        text-transform: uppercase;
        color: #fff;
        line-height: 2.3rem;
    }

    #nav {
        margin-top: 1rem;
    }

    .academy {
        letter-spacing: 0.83rem;
    }

    hr {
        background-color: lightgray;
        width: 80%;
        margin: 0 auto;
    }
</style>

<div class="sidenav">
    <a href="/admin" id="logo">
        <img src="/images/nav/logo.png" alt="" class="logo-img">
        <div class="logo-text">
            <h3 class="logo-name">Direction</h3>
            <h5 class="logo-name"><span class="academy">Academy</span></h5>
        </div>
    </a>
    <div id="nav">
        <a href="/admin">
            Home
        </a>
        <a href='/admin/videocourses'>
            Manage Online Classes
        </a>
        <hr>
        <a href='/admin/sectors'>
            Manage Sectors
        </a>
        <a href='/admin/exams'>
            Manage Exams
        </a>
        <a href='/admin/testpacks'>
            Manage Testpacks
        </a>
        <hr>
        <a href='/admin/users'>
            Users
        </a>
        <a href='/admin/petitioners'>
            Petitioners
        </a>
        <a href='/admin/orders'>
            Orders
        </a>
    </div>
    <div on:click={logout} class="btn">Logout</div>
</div>