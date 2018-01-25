<template>
  <md-card id="login-card" class="card-content">
    <md-card-header>
      <h2 class="md-title">{{$lang.login.title}}</h2>
    </md-card-header>

    <md-card-content>
      <form id="loginForm" @submit.prevent="validateBeforeSubmit">
        <md-field :class="{'md-input-invalid': errors.has('url')}">
          <label>{{$lang.login.username}}</label>
          <md-input v-model="login.username" v-validate name="username" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('username')}}</span>
        </md-field>
        <md-field md-has-password :class="{'md-input-invalid': errors.has('url')}">
          <label>{{$lang.login.password}}</label>
          <md-input v-model="login.password" v-validate name="password" type="password" data-vv-rules="required"></md-input>
          <span class="md-error">{{errors.first('password')}}</span>
        </md-field>
        <a :href="this.$config.API.baseUrl + this.$config.API.pwRecoveryPath">{{$lang.login.forgot_password}}?</a>
      </form>
    </md-card-content>
      
    <md-card-actions>
      <md-button class="md-primary" type="submit" form="loginForm">{{$lang.buttons.login}}</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

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
        this.$http.post(this.$config.API.baseUrl + this.$config.API.port + this.$config.API.authPath, this.login)
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
#login-card{
    max-width: 600px;
    margin: 0 auto;
}
</style>
