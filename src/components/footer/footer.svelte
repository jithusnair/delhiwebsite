<style>
    .section {
        padding: 2rem;
    }

    .footer{
        background-color: var(--nav-color);
        width: 100%;
    }

    .footer a,.footer p{
        font-size: 1.4rem;
        color:var(--dim-white);
    }

    .footer-top{
        display: grid;
        gap: 4rem;
        row-gap: 3rem;
        grid-template-columns: 50% 50%;
        width: 60%;
        margin: 0 auto;
    }

    .footer-address {
        text-align: right;
    }

    .footer-seperator{
        margin-top: 1rem;
        margin-bottom: 1rem;
        background-color:var(--white);
    }

    .footer-btm{
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    /* For Mobile Devices */
    @media only screen and (max-width: 1000px) {
        .footer{
            padding-top: 2rem;
        }

        .footer-top{
            width: 100%;
            grid-template-columns: 320px;
            grid-gap: 0;
            justify-content: center;
        }
        .footer-btm{
            flex-direction: column;
            align-items: center;
        }
        .footer-address {
            text-align: center;
            margin-bottom: 2rem;
        }
        .footer-content {
            text-align: center;
        }
    }
</style>

<footer class="footer section">
    <div class="footer-top">
        <div class="footer-address">
            <p><a href="/policies/privacy">Privacy Policy</a></p>
            <p><a href="/policies/termsofservice">Terms and Conditions</a></p>
            <p><a href="/policies/refundpolicy">Refund Policy</a></p>
            <p><a href="/contact">Contact</a></p>
        </div>

        <div class="footer-content">
            <p>
                Direction Academy is a modest initiative by a group of tremendously 
                passionate individuals. We arduously work towards providing quality
                education to those who seek it. 
            </p>
        </div>

    </div>

    <hr class="footer-seperator">

    <div class="footer-btm">
        <div class="copyright">
            <p>&copy; 2020 Direction Academy - All rights reserved</p>
        </div>
    </div>
</footer>