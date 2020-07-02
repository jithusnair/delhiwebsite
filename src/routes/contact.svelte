<style>
    .map-section {
        position: relative;
        min-height: calc(100vh - 25rem);
    }

    .contact-details {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 5rem 5%;
    }

    .contact-details h2 {
        font-size: 4.5rem;
        padding-bottom: 6rem;
    }

    .contact-cards {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .contact-option {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #fff;
        width: 40rem;
        height:25rem;
        border-radius: 1rem;
        padding: 3rem 5rem;
        text-align: center;
        margin: 0 2rem 5rem 2rem;
        box-shadow: 0 1.5em 2em -1em #999;
        color: #333;
    }

    #phone-card {
        background: rgb(244, 146, 120);
        background: linear-gradient(
            309deg,
            rgba(244, 146, 120, 1) 0%,
            rgba(255, 74, 77, 1) 100%
        );
    }
    #email-card {
        background: rgb(168, 167, 255);
        background: linear-gradient(
            309deg,
            rgba(168, 167, 255, 1) 0%,
            rgba(88, 100, 237, 1) 100%
        );
    }
    #address-card {
        background: rgb(225, 95, 254);
        background: linear-gradient(
            309deg,
            rgba(225, 95, 254, 1) 0%,
            rgba(150, 109, 238, 1) 100%
        );
    }

    .content{
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
    }

    .contact-option h3, a, p, i {
        color: #fff;
    }

    .contact-option h3 {
        padding: 1.2rem 0 0.5rem;
    }

    .contact-option p {
        align-self: start;
        text-align: left;
    }
    .contact-option a {
        font-weight: 500;
        text-align: left;
    }
    .contact-option p {
        margin-bottom: 1rem;
        font-weight: 600;
        text-align: center;
    }
    #address {
        text-align: left;
    }
    .contact-icon {
        font-size: 4rem !important;
    }
    @media screen and (max-width: 600px) {
        .contact-details h2{
            font-size: 3.4rem;
            padding-bottom: 3rem;
        }
        .contact-details{
            padding: 3rem 5%;
        }
    }

    @media screen and (max-width: 500px) {
        .contact-option {
            width: 85%;
            height:58%;
        }
    }
</style>

<div class="map-section">
    <section class="contact-details">
        <h2>Contact Us</h2>
        <div class="contact-cards">
            <div class="contact-option" id="phone-card">
                <i class="fa fa-phone contact-icon"></i>
                <h3>Call Us</h3>
                <div class="content">
                    <a href="tel:+911234567890">+91&nbsp;8851799173</a>
                    <a href="tel:0495123123123">+91&nbsp;9400747680</a>
                    <a href="tel:0495123123123">+91&nbsp;7827805868</a>
                </div>
            </div>
            <div class="contact-option" id="email-card">
                <i class="fa fa-envelope contact-icon"></i>
                <h3>Send an e-mail</h3>
                <div class="content">
                    <a href="mailto:support@direction-academy.com">support@direction-academy.com</a>
                </div>
            </div>
            <div class="contact-option" id="address-card">
                <i class="fa fa-map-marker contact-icon"></i>
                <h3>Mail Us</h3>
                <div class="content">
                    <p id="address">W/o, Bansi lal Jat, <br> 
                        Chandeli ka Bas, chandeli ka bas <br>
                        Dholasari, Dantaramgarh, Sikar<br>
                        Rajasthan - 332703</p>
                </div>
            </div>
        </div>
    </section>
</div>