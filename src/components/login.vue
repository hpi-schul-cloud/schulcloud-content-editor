<template>
  <md-card class="card-content">
    <md-card-header>
      <h2 class="md-title">Login</h2>
    </md-card-header>

    <md-card-content>
      <form id="loginForm" @submit.prevent="validateBeforeSubmit">
        <md-input-container :class="{'md-input-invalid': errors.has('url')}">
          <label>Benutzername</label>
          <md-input v-model="login.username" v-validate name="username" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('username')}}</span>
        </md-input-container>
        <md-input-container md-has-password :class="{'md-input-invalid': errors.has('url')}">
          <label>Passwort</label>
          <md-input v-model="login.password" v-validate name="password" type="password" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('password')}}</span>
        </md-input-container>
        <a :href="this.$config.API.baseUrl + this.$config.API.pwRecoveryPath">Passwort vergessen?</a>
      </form>
    </md-card-content>
      
    <md-card-actions>
      <md-button class="md-accent" type="submit" form="loginForm">Login</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);
import axios from 'axios';

export default {
  name: 'login',
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    };
  },
  created() {
    if(this.$cookies.get('jwt')){
        localStorage.setItem("jwt", this.$cookies.get('jwt'));
        this.$router.go();
    }
  },
  methods: {
    getToken: function(){
        axios.post(this.$config.API.baseUrl + this.$config.API.port + this.$config.API.authPath, this.login)
        .then(response => {
          // JSON responses are automatically parsed.
          const jwt = response.data.accessToken;
          localStorage.setItem("jwt", jwt);
          this.$cookies.set('jwt', jwt, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
          this.$router.go();
        })
        .catch(e => {
            alert("Login gescheitert!");
            console.error(e);
        })
    },
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.getToken();
          return;
        }
        alert('Correct the errors!');
      });
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
