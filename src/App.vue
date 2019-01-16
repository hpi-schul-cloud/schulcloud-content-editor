<template>
  <div id="app">
    <VueProgressBar />
    <header class="md-elevation-1 md-primary">
      <div class="container-fluid-max">
        <MdToolbar
          md-elevation="0"
          class="md-primary"
        >
          <RouterLink
            to="/"
            style="flex: 1"
          >
            <h2
              class="cloud-logo md-title"
              style="flex: 1"
            >
              {{ title }}
            </h2>
          </RouterLink>
          <div v-if="jwt">
            <RouterLink to="/hosting">
              <MdButton>{{ $lang.buttons.hosting }}</MdButton>
            </RouterLink>
            <RouterLink to="/create">
              <MdButton>{{ $lang.buttons.create }}</MdButton>
            </RouterLink>
            <RouterLink to="/stats">
              <MdButton>{{ $lang.buttons.stats }}</MdButton>
            </RouterLink>
            <MdMenu
              md-direction="bottom-end"
              :md-align-trigger="true"
            >
              <MdButton
                id="userName"
                md-menu-trigger
              >
                {{ userInfo.displayName }}
                <MdIcon>
                  <i class="material-icons">
                    arrow_drop_down
                  </i>
                </MdIcon>
              </MdButton>
              <MdMenuContent>
                <MdMenuItem @click="logout">
                  {{ $lang.buttons.logout }}
                </MdMenuItem>
              </MdMenuContent>
            </MdMenu>
          </div>
        </MdToolbar>
      </div>
    </header>
    <main class="page-container container-fluid-max">
      <Transition
        name="fade"
        mode="out-in"
        appear
      >
        <RouterView v-if="jwt" />
      </Transition>
      <AppLogin v-if="!jwt" />
      <AppFooter />
    </main>
  </div>
</template>

<script>
  /* load login async */
const login = () => import(/* webpackChunkName: "login" */ './components/base/helper/login.vue');
/* load hpiFooter async */
const hpiFooter = () => import(/* webpackChunkName: "hpiFooter" */ './components/base/footer.vue');

export default {
	name: 'App',
	components: {
		'AppLogin': login,
		'AppFooter': hpiFooter,
	},
	data() {
		return {
			title: 'Schul-Cloud Content',
			jwt: localStorage.getItem('jwt'),
			userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
		};
	},
	created() {
		this.$Progress.start();

		this.$router.beforeEach((to, from, next) => {
			this.$Progress.start();
			next()
		});

		this.$router.afterEach(() => {
			this.$Progress.finish()
		});
	},
	methods: {
		logout() {
			localStorage.clear();
			this.$cookies.remove('jwt');
			window.location.href = '/';
		},
	},
};
</script>


<style lang="scss">

  @import "./default";

  .container-fluid {
    width: 100%;
    max-width: 900px;
    margin: 0 auto 0;
  }

  .container-fluid-max {
    width: 100%;
    max-width: 1750px;
    margin: 0 auto 0;
  }

  .grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 5px;
  }

  @for $i from 1 through 12 {
    .hide-xl {
      display: none;
    }
    .grid-xl-#{$i} {
      grid-column: span $i;
    }
  }

  @media (max-width: 1903px) {
    .hide-l {
      display: none;
    }
    @for $i from 1 through 12 {
      .grid-l-#{$i} {
        grid-column: span $i;
      }
    }
  }

  @media (max-width: 1264px) {
    .hide-m {
      display: none;
    }
    @for $i from 1 through 12 {
      .grid-m-#{$i} {
        grid-column: span $i;
      }
    }
  }

  @media (max-width: 944px) {
    .hide-s {
      display: none;
    }
    @for $i from 1 through 12 {
      .grid-s-#{$i} {
        grid-column: span $i;
      }
    }
  }

  @media (max-width: 600px) {
    .hide-s {
      display: none;
    }
    @for $i from 1 through 12 {
      .grid-xs-#{$i} {
        grid-column: span $i;
      }
    }
  }

  @for $i from 0 through 10 {
    .height-#{$i*10} {
      height: percentage($i/10);
    }
  }

  #app {
    display: flex;
    flex-direction: column;
    padding: 0;
    max-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  main {
    margin: 0 auto !important;
    padding: 0;
    max-width: 100% !important;
    display: contents;
  }

  header {
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 999;
    padding-right: 16px !important;
    background: var(--md-theme-default-accent-on-background, #b10438);
    .md-title {
      font-size: 1.5rem !important;
      &:hover {
        text-decoration: none !important;
      }
    }
    .md-button {
      margin: 0;
    }
    #userName {
      .md-icon {
        min-height: 1em;
        height: 1em;
        min-width: 1em;
        width: 1em;
        font-size: 1em !important;
      }
    }
    .cloud-logo::before {
      content: "";
      display: inline-block;
      width: 1.8em;
      height: 1.1em;
      margin: 0 .25em -.16em 0;
      background: url(./assets/cloud-transparent-mono.svg) no-repeat center;
      background-size: contain;
    }
  }

  .md-menu-content {
    z-index: 9999;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
