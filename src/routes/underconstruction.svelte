<style>
    section {
        height: 100%;
        margin: 0 auto;
    }

    img {
        display: block;
        margin: 0 auto;
        width: 75%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @media screen and (max-width: 600px){
        img {
            width: 700px;
            object-fit: cover;
        }
    }

    @media screen and (min-width: 768px) and (orientation: landscape){
        img {
            width: 600px;
            object-fit: cover;
        }
    }   

    @media screen and (min-width: 768px) and (orientation: portrait){
        img {
            width: 768px;
            object-fit: cover;
        }
    } 

    @media screen and (min-width: 1000px){
        img {
            width: 1000px;
            object-fit: cover;
        }
    }

</style>

<section>
    <img src="/images/under_construction.jpg" alt="page under construction">
</section>