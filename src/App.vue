<template>
  <div id="app">
    <header class="md-elevation-1 md-primary"><div class="container-fluid-max">
      <md-toolbar md-elevation="0" class="md-primary">
        <router-link to="/" style="flex: 1">
            <h2 class="cloud-logo md-title" style="flex: 1">{{title}}</h2>
        </router-link>

        <router-link v-if="jwt" to="/create"><md-button>{{$lang.buttons.create}}</md-button></router-link>
        <router-link v-if="jwt" to="/stats"><md-button>{{$lang.buttons.stats}}</md-button></router-link>
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

@import "./default";
body {padding: 90px 0 15px;}

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


.grid{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 5px;
}

@for $i from 1 through 12{
    .hide-xl{
        display: none;
    }
  .grid-xl-#{$i}{
    grid-column: span $i;
  }
}

@media (max-width: 1903px){
    .hide-l{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-l-#{$i}{
        grid-column: span $i;
      }
    }
}
@media (max-width: 1264px){
    .hide-m{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-m-#{$i}{
        grid-column: span $i;
      }
    }
}
@media (max-width: 944px){
    .hide-s{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-s-#{$i}{
        grid-column: span $i;
      }
    }
}
@media (max-width: 600px){
    .hide-s{
        display: none;
    }
    @for $i from 1 through 12{
      .grid-xs-#{$i}{
        grid-column: span $i;
      }
    }
}

@for $i from 0 through 10{
  .height-#{$i*10}{
    height: percentage($i/10);
  }
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
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    padding-right: 16px !important;
    background: var(--md-theme-default-accent-on-background, #b10438);
    .md-title{
        font-size: 1.5rem !important;
        &:hover{
            text-decoration: none !important;
        }
    }
    .md-button{
        margin: 0;
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
