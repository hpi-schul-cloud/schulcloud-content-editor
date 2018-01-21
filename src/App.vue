<template>
  <div>
    <div v-if="$route.query.noframe == 'true'">
        <router-view v-if="jwt"></router-view>
    </div>
    <div id="app" v-else>
    <header class="md-elevation-1 md-accent"><div class="container-fluid-max">
      <md-toolbar md-elevation="0" class="md-toolbar md-theme-default">
        <router-link to="/" class="md-title" style="flex: 1">
            <h3 class="cloud-logo">
                {{title}}
            </h3>
        </router-link>

        <router-link v-if="jwt" to="/create"><md-button>{{$lang.buttons.create}}</md-button></router-link>
        <router-link v-if="jwt" to="/search"><md-button>{{$lang.buttons.search}}</md-button></router-link>
        <md-button v-if="jwt" v-on:click="logout">{{$lang.buttons.logout}}</md-button>
      </md-toolbar>
    </div>
    </header>
    <main class="page-container container-fluid-max">
        <router-view v-if="jwt"></router-view>
        <app-login v-else></app-login>
    </main>
  </div>
  </div>
</template>

<script>
import login from './components/login.vue';

export default {
  components: {
    'app-login': login,
  },
  name: 'app',
  data() {
    return {
      title: 'Schul-Cloud Content',
      jwt: localStorage.getItem('jwt'),
    };
  },
  methods: {
    logout() {
        localStorage.removeItem("jwt");
        this.$cookies.remove("jwt");
        window.location.href = "/";
    }
  },
};
</script>


<style lang="scss">

body {}

.container-fluid{
  width: 100%;
  max-width: 900px;
  margin: 0 auto 0;
}
.container-fluid-max{
  width: 100%;
  max-width: 1750px;
  margin: 0 auto 0;
}

#app {
  padding: 90px 0 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  margin: 0 auto !important;
  padding: 0 15px;
}

header{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #b10438;
    .md-theme-default.md-toolbar{
        background: transparent;
        color: #fff !important;
        a{
            color: #fff !important;
        }
        .md-title,
        .md-title:hover{
            text-decoration: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .cloud-logo::before{
        content: "";
        display: inline-block;
        width: 1.8em;
        height: 1.1em;
        margin: 0 .25em -.16em 0;
        background: url(./assets/cloud-transparent-mono.svg) no-repeat center;
        background-size: contain;
    }
}
</style>
