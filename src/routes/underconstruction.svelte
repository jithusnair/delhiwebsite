<script context="module">
    export async function preload(page, session) {
		const { user } = session;

		if (user) {
			return this.redirect(302, '/user');
        }
	}
</script>

<script>
    import Nav from '../components/nav/Nav.svelte';
</script>

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

    @media screen and (max-width: 850px){
        img {
            width: 100%;
            top: 25%;
        }
    }
</style>

<Nav/>

<section>
    <img src="/images/under_construction.jpg" alt="page under construction">
</section>