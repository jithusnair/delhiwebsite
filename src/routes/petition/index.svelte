<script>
    import SignPetition from '../../components/petition/SignPetition.svelte';
</script>

<style>
    .petition-container {
        width: 95%;
        margin: -5rem auto 0 auto;
        display: grid;
        grid-template-columns: 70% 30%;
        grid-auto-flow: dense;
    }

    img {
        width: 100%;
        margin-bottom: 2rem;
    }

    ul {
        list-style-type: "→";
        list-style-position: inside;
        margin-bottom: 2rem;
    }

    li {
        padding: 1rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
    }

    .demands {
        padding: 1rem;
        width: 95%;
        margin: 0 auto;
    }

    .sign-petition {
        position: fixed;
        right: 2%;
        top: 50%;
        transform: translateY(-50%);
        min-width: 350px;
    }

    @media only screen and (max-width: 1100px) {
        .petition-container {
            grid-template-columns: 100%;
        }
        
        .sign-petition {
            position: unset;
            display: flex;
            justify-content: center;
            text-align: center;
            top: initial;
            right: initial;
            width: 100%;
            min-width: 300px;
            transform: unset;
            padding-bottom: 3rem;
        }
    }
</style>

<div class="petition-container">
    <div class="demands">
        <h1>Water Movement</h1>
        <img src="/images/petition/water.jpg" alt="Girl carrying water">
        <p>राज्य व  केंद्र सरकार को शेखावाटी क्षेत्र में पेयजल समस्या के लिए युवाओं  के द्वारा याचिका 
        (यह याचिका जिला कलेक्टर , सांसद व संबंधित  क्षेत्र  के विधायक को सौंपी जायेगी )</p>
        <ul>
            <li>जल स्वालंबन योजना के तहत हर  घर जल घर हो |</li>
            <li>कुम्भाराम नहर लिफ्ट परियोजना को 1 साल में ज़मीनी स्तर पर लाया जाए |</li>
            <li>हर घर में फ्लोराइड मुक्त ,TDS के अनुकूल पीने योग्य पानी की समुचित व्यवस्था हो |</li>
            <li>जब तक  सरकार पीने  योग्य पानी नहीं पहुँचाती  हे तब तक पानी के टैंक का खर्च सरकार  उठाएगी |</li>
            <li>गांव में जो सरकारी बंजर जमीन हे वहां  पर सार्वजनिक तालाब का निर्माण किया जावे (तालाब में प्लास्टिक बिछायी जावे)</li>
            <li>ग्राम पंचायतो को निर्देश दिए जाये की हर वर्ष आर्थिक रूप से उपयोगी कम से कम 50 पेड़ गांव में लगावें |</li>
            <li>हर गांव के विधा लय में बरसात के पानी का संचय हो उस पानी से विधा लय परिसर में फलदार पेड़ लगाए जाये |</li>
            <li>किसानों को वर्षा जल संचय के प्रभवि तरीके सिखाये  जावे|</li>
            <li>गावों  के सार्वजनिक तालाब का उपयोग गांव की सड़को के किनारे बंजर भूमि पर आर्थिक रूप उपयोगी पद लगाने में किया जाये |</li>
            <li>पानी का दुरुपयोग न हो इसके लिए ग्राम पंचायतों  को सख्त निर्देश दिए जायें |</li>
        </ul>
    </div>
    <div class="sign-petition">
        <SignPetition/>
    </div>
</div>