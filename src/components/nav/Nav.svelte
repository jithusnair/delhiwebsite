<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	
	import { navigationStore } from '../../store/navigation.js';

	const dispatch = createEventDispatcher();

	onMount( async () => {
		(function (jQuery, window, document, undefined) {
			var Navigation = {
				
				init: function (options, caller) {
					var self = this;

					self.options = jQuery.extend({}, jQuery.fn.nav.options, options);

					self.jQuerybody = jQuery('body');
					self.jQuerynav = jQuery(caller);
					self.jQuerymenuButton = jQuery(self.options.navButton);
					self.jQuerysubMenu = jQuery(self.options.subMenu);
					self.subMenu = self.options.subMenu;
					self.mobileMode = self.isCurrentlyMobile(self);
					self.mouseOver = self.options.mouseOver;
					self.disableSubMenuLink = self.options.disableSubMenuLink;
					self.slideSpeed = self.options.slideSpeed;

					jQuery('html').removeClass('nav-no-js');
					self.collapseSubMenus(self);
					self.bindEvents(self);
				},

				bindEvents: function (self) {
					// Click menu button (mobile)
					self.jQuerymenuButton.on('click', function (event) {
						self.toggleNav(self);
						event.preventDefault();
					});

					// Click sub menu link
					self.jQuerynav.on('click', self.subMenu + ' > a', function (event) {
						var a = jQuery(this);

						// Check if link behavior should be disabled (option)
						// If not, then there is no use in toggling the sub menu
						if (self.isSubMenuLinkDisabled(self, a)) {
							self.toggleSubMenu(self, a.parent());
							event.preventDefault();
						}
					});

					if (self.mouseOver == true) {
						// Mouse enter sub menu
						self.jQuerynav.on('mouseenter', self.subMenu, function () {
							if (self.mobileMode == false) {
								// Don't use mouse enter in mobile mode
								self.openSubMenu(self, jQuery(this));
							}
						});

						// Mouse leave sub menu
						self.jQuerynav.on('mouseleave', self.subMenu, function () {
							if (self.mobileMode == false) {
								// Don't use mouse leave in mobile mode
								self.closeSubMenu(self, jQuery(this));
							}
						});
					}

					// Window Resize Event
					jQuery(window).on('resize', function () {
						self.resetNav(self);
					});
				},

				isSubMenuLinkDisabled: function (self, a) {
					return self.disableSubMenuLink == 'always'
						|| a.attr('href') == '#'
						|| (self.disableSubMenuLink == 'mobile' && self.mobileMode == true)
						|| (self.disableSubMenuLink == 'desktop' && self.mobileMode == false);
				},

				// Show or hide the navigation (mobile)
				toggleNav: function (self) {
					self.jQuerynav.stop().clearQueue().slideToggle(self.slideSpeed, function () {
						var nav = jQuery(this);
						if (nav.is(':hidden')) {
							self.collapseSubMenus(self);
							// Clean up unwanted inline styles if someone spam clicks
							jQuery(this).attr('style', 'display: none;');
						} else {
							// Clean up unwanted inline styles if someone spam clicks
							jQuery(this).attr('style', 'display: block;');
						}
					});
					self.jQuerybody.toggleClass('nav-lock-scroll');
				},

				toggleSubMenu: function (self, li) {
					li.hasClass('nav-active')
						? self.closeSubMenu(self, li)
						: self.openSubMenu(self, li);
				},

				openSubMenu: function (self, li) {
					// Activate clicked menu
					li.addClass('nav-active')
						// And open it
						.children('ul').stop().clearQueue().slideDown(self.slideSpeed, function () {
							// Clean up unwanted inline styles if someone spam clicks
							jQuery(this).attr('style', 'display: block;');
						});

					// Deactivate all siblings
					li.siblings(self.subMenu).removeClass('nav-active')
						// Close all sibling sub menu's
						.children('ul').slideUp(self.slideSpeed, function () {
							jQuery(this).clearQueue();
						})
						// Then deactivate their sub menu's
						.find('.nav-active').removeClass('nav-active')
						// And close them
						.children('ul').slideUp(self.slideSpeed, function () {
							jQuery(this).clearQueue();
						});

				},

				closeSubMenu: function (self, li) {
					// Deactivate clicked sub menu
					li.removeClass('nav-active')
						// And close it
						.children('ul').stop().clearQueue().slideUp(self.slideSpeed, function () {
							// Clean up unwanted inline styles if someone spam clicks
							jQuery(this).attr('style', 'display: none;');
						})
						// Deactivate sub menu's of the clicked sub menu
						.find('.nav-active').removeClass('nav-active')
						// And close them
						.children('ul').slideUp(self.slideSpeed, function () {
							jQuery(this).clearQueue();
						});
				},

				// Reset nav when we switch from mobile
				// to desktop mode and vice versa
				resetNav: function (self) {
					var currentMobileMode = self.isCurrentlyMobile(self);

					if (self.mobileMode !== currentMobileMode) {
						// Remove inline styling
						self.jQuerynav.removeAttr('style')
							.find('ul').removeAttr('style');

						// Unlock scrolling
						self.jQuerybody.removeClass('nav-lock-scroll');

						self.collapseSubMenus(self);
						self.mobileMode = currentMobileMode;
					}
				},

				collapseSubMenus: function (self) {
					self.jQuerysubMenu.removeClass('nav-active')
						.children('ul').hide();
				},

				// If .nav-button is visible then
				// we're in mobile mode!
				isCurrentlyMobile: function (self) {
					return self.jQuerymenuButton.is(':visible');
				}
			};

			jQuery.fn.nav = function (options) {
				return this.each(function () {
					var nav = Object.create(Navigation);
					nav.init(options, this);
				});
			};

			jQuery.fn.nav.options = {
				// Mobile menu button selector
				navButton: '.nav-button',
				// Sub menu selector (<li>)
				subMenu: '.nav-submenu',
				// Open sub menu's on mouse over
				// when not in mobile mode
				mouseOver: true,
				// When clicking/touching a sub menu link, it will open the sub menu...
				// Not disabling the links will make sub menu's unreachable on touch devices!
				// A link with [href="#"] will always be disabled, regardless of this setting.
				// Disable the actual link in a particular mode:
				//   always|never|mobile|desktop
				disableSubMenuLink: 'always',
				// How fast should a sub menu open/close? (ms)
				slideSpeed: 200
			};

		}(jQuery, window, document));
		
	// IE 8 doesn't know Object.create
		if (typeof Object.create !== 'function')
			{
				Object.create = function(obj) {
					function F() {}
					F.prototype = obj;
					return new F();
				};
			}
		jQuery('.nav').nav();
});

</script>

<style>
	.nav-lock-scroll {
		overflow: hidden;
	}

	.nav .nav-submenu ul .nav-submenu a:hover .link-arrow{
		transform: rotateZ(-90deg);
	}
	.nav .nav-submenu a:hover .link-arrow{
		transform: rotateX(180deg);
	}

	.sub-nav{
		border-radius: 0 0 5px 5px;
		background: rgb(34,39,73);
	}

	.sub-nav li {
		margin-left: 1rem;
	}

	.sub-nav li ul li {
		margin-left: 3rem;
	}

	.sub-nav li ul{
		border-radius: 0.5rem 5px 5px;
	}

	.sub-nav li a{
		min-width: 15rem;
	}
	.sub-nav li a .link-arrow{
		position: absolute;
		right: 15px;
		top: 20px;
	}

	.crown-img {
		margin-left: 4px;
		width: 18px;
	}

	button {
		font-size: 1.6rem;
		line-height: 2.6rem;
		color: #616161;
	}

	.link-arrow {
		width: 11px;
		margin-left: 10px;
		transition: transform .5s ease;
	}

	.logo-img {
		width: 4rem;
		margin-right: 10px;
	}
	.logo-name {
		text-transform: uppercase;
		color: var(--white);
		line-height: 2.3rem;
	}

	.academy {
		letter-spacing: 0.83rem;
	}

	h3 {
		font-family: Manrope, sans-serif;
		font-size: 2.5rem;
		line-height: 3.8rem;
	}

	.btn {
		border: none;	
		font-family: Manrope, sans-serif;
		color: #425066;
		font-weight: 700;
		line-height: 2rem;
		-webkit-appearance: none;
		text-align: center;
		outline: none;
		cursor: pointer;
	}

	.btn:hover {
		background-position:100% 0;
		-moz-transition:all .4s ease-in-out;
		-o-transition:all .4s ease-in-out;
		-webkit-transition:all .4s ease-in-out;
		transition:all .4s ease-in-out;
	}

	.gem-btn{
		font-size: 1.5rem;
		box-shadow: none;
		border-radius: 3px;
		width: 9.5rem;
		padding: 5px 0;
		color: black;
		background:linear-gradient(to right,rgb(200,147,30), rgb(252,225,84));
		transition: color .5s ease;
	}

	.signin-btn{
		font-size: 1.5rem;
		font-weight: normal;
		box-shadow: none;
		border: none;
		border-radius: 3px;
		width: 9.5rem;
		padding: 4px 0;
		margin-left: 3rem;
		background: transparent;
		border: 1px solid #fff;
		color: #fff;
	}

	.header-btns{
		margin-left: auto;
		position: fixed;
		padding: 1.4rem 5%;
		top: 0;
		right: 0;
	}

	.nav{
		display: flex;
		flex-direction: row;
		z-index: 998;
	}

	.nav-menu {
		background: rgb(34,39,73);
	}

	ul{
		list-style: none;
	}

	a {
		font-size: 1.6rem;
		text-decoration: none;
		line-height: 2.6rem;	
	}

	a:active, a:focus {
	outline: 0;
	border: none;
	--moz-outline-style: none;
	}

	button::-moz-focus-inner {
	border: 0;
	}

	.link{
		font-size: 1.5rem;
		padding: 1rem 2vw;
		color: #fff;
		transition: color .5s ease;
	}

	.link:hover{
		color: rgb(136, 136, 247);
	}

	li {
		font-size: 1.6rem;
		line-height: 2.6rem;
	}
		
	.header{
		position: fixed;
		top: 0;
		height: 6rem;
		z-index: 1000;
		width: 100%;
		padding:0 5%;
		display: flex;
		align-items: center;
		background: rgb(34,39,73);;
	}

	.nav{
		display: flex;
		flex-direction: row;
		z-index: 998;
	}

	.logo{
		z-index: 999;
		padding:1rem 2vw 1rem 0;
		color: #fff;;
		display: flex;
	}

	.nav {
		display: none;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 900;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.nav ul {
		display: block;
		position: relative;
		zoom: 1;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	.nav-button{
		display: none;
		background: rgb(34,39,73);
		margin-left: auto;
		color: white;
		z-index: 1001;
		}

	.nav a,
	.nav a:hover,
	.nav a:active,
	.nav a:visited {
		display: block;
		position: relative;
	}

	@media only screen and (min-width: 1001px) {
		.nav {
			display: block;
			position: relative;
			bottom: auto;
			overflow: visible;
		}

		.nav li {
			position: relative;
			white-space: nowrap;
		}

		.nav > ul > li {
			display: inline-block;
		}

		.nav ul {
			display: block;
		}

		.nav ul ul {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			z-index: 901;
		}

		.nav ul ul ul {
			top: 5px;
			left: 95%;
			z-index: 902;
		}

		.nav ul ul ul ul {
			z-index: 903;
		}

		.nav ul ul ul ul ul {
			z-index: 904;
		}
	}

	@media only screen and (max-width: 1000px) {
		.logo{
			background: rgb(34,39,73);
			width: 100vw;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.nav-button{
			display: block;
			background: rgb(34,39,73);
			margin-left: auto;
			cursor: pointer;
		}
		.nav{
			padding-top: 7rem;
			background: rgb(34,39,73);
			width: 100%;
			bottom: auto;
		}
		.link-arrow{
			position: absolute;
			top: 15px;
			right: 6%;
		}
		.link{
			padding-left: 6%;
		}
		.sub-nav li a .link-arrow{
			right: 6%;
		}
		.header-btns{
			margin-left: 0;
			width: 100%;
			position: static;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.nav .nav-submenu ul .nav-submenu a:hover .link-arrow{
			transform: rotateX(180deg);
		}
	}
</style>
<!-- 
<header class="header">
	<a href="/" class="logo"><img src="images/nav/logo.png" alt="" class="logo-img">
		<div class="logo-text">
			<h3 class="logo-name">Direction</h3>
			<h5 class="logo-name"><span class="academy">Academy</span></h5>
		</div>
	</a>
	<nav class="nav">
		<ul class="nav-menu">
			<li class="nav-list"><a href="/onlineclass" class="link">Online Classes</a>
			</li>
			<li class="nav-list"><a href="/underconstruction" class="link">Exams</a>
			</li>
			<li class="nav-list"><a href="/underconstruction" class="link sublink">Test</a></li>
			<li class="nav-list"><a href="/underconstruction" class="link">Resources</a>
			</li>
			<li class="nav-list"><a href="/underconstruction" class="link">Blog</a></li>
			<li class="nav-list"><a href="/contact" class="link">Contact</a></li>
		</ul>
		<div class="header-btns">
			<button on:click={() => dispatch('navlogin')} class="btn signin-btn">Sign In</button>
		</div>
	</nav>
	<div class="nav-button"><i class="fa fa-bars fa-3x"></i></div>
</header> -->

<header class="header">
	<a href="/" class="logo"><img src="images/nav/logo.png" alt="" class="logo-img">
		<div class="logo-text">
			<h3 class="logo-name">Direction</h3>
			<h5 class="logo-name"><span class="academy">Academy</span></h5>
		</div>
	</a>
	<nav class="nav">
		<ul class="nav-menu">
			<li class="nav-list"><a href="/onlineclass" class="link">Online Classes</a></li>
			{#if $navigationStore != 0}
				<li class="nav-submenu nav-list"><a href="#" class="link">Exam<img src="images/nav/arrow.svg" alt="" class="link-arrow"></a>
					<ul class="sub-nav">
					{#each $navigationStore as sector}
						<li class="nav-submenu nav-list"><a href="#" class="link">{sector.sectorTitle} <img src="images/nav/arrow.svg" alt="" class="link-arrow"></a>
							<ul class="sub-nav">
							{#each sector.exams as exam}
								<li class="nav-list"><a href={"/exams/" + exam.examShortTitle} class="link">{exam.examShortTitle.toUpperCase()}</a></li>
							{/each}
							</ul>
						</li>
					{/each}
					</ul>
				</li>
			{/if}
			<li class="nav-list"><a href="/tests" class="link sublink">Tests</a></li>
			<!-- <li class="nav-submenu nav-list"><a href="#" class="link">Resources<img src="images/nav/arrow.svg" alt="" class="link-arrow"></a>
				<ul class="sub-nav">
					<li class="nav-list"><a href="#" class="link">Practice</a></li>
					<li class="nav-list"><a href="pages/gk/gk.html" class="link">Current Affairs and GK</a></li>
				</ul>
			</li>
			<li class="nav-list"><a href="pages/blog/blog.html" class="link">Blog</a></li> -->
			<li class="nav-list"><a href="/contact" class="link">Contact</a></li>
		</ul>
		<div class="header-btns">
			<!-- <button class="btn gem-btn">Gems 
				<img src="images/nav/crown.svg" alt="" class="crown-img"></button> -->
			<button on:click={() => dispatch('navlogin')} class="btn signin-btn">Sign In</button>
		</div>
	</nav>
	<div class="nav-button"><i class="fa fa-bars fa-3x"></i></div>
</header>