<template>
  <md-card id="login-card" class="card-content">
    <md-card-header>
      <h2 class="md-title">{{$lang.login.title}}</h2>
    </md-card-header>

    <md-card-content>
      <form id="loginForm" @submit.prevent="validateBeforeSubmit">
        <md-field :class="{'md-input-invalid': errors.has('url')}">
          <label>{{$lang.login.username}}</label>
          <md-input v-model="login.username" name="username" required></md-input>
          <span class="md-error">{{errors.first('username')}}</span>
        </md-field>
        <md-field md-has-password :class="{'md-input-invalid': errors.has('url')}">
          <label>{{$lang.login.password}}</label>
          <md-input v-model="login.password" name="password" type="password" required></md-input>
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
const jwtTool = require('jsonwebtoken');

export default {
  name: 'login',
  data() {
    return {
      login: {
        username: '',
        password: '',
      },
    };
  },
  created() {
    if (this.$cookies.get('jwt')) {
      localStorage.setItem('jwt', this.$cookies.get('jwt'));
      this.$router.go();
    }
  },
  methods: {
    validateBeforeSubmit() {
      if(this.login.username != '' && this.login.password != ''){
        return this.getToken();
      }
    },
    getToken() {
      this.$http.post(this.$config.API.baseUrl + this.$config.API.port + this.$config.API.authPath, this.login)
        .then((response) => {
          // JSON responses are automatically parsed.
          const jwt = response.data.accessToken;
          localStorage.setItem('jwt', jwt);
          this.$cookies.set('jwt', jwt, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
          this.getUserInfo(jwt);
        })
        .catch((e) => {
          alert('Login gescheitert!');
          console.error(e);
        });
    },
    getUserInfo(jwt) {
      const payload = (jwtTool.decode(jwt, { complete: true }) || {}).payload;
      this.$http.get(this.$config.API.baseUrl + this.$config.API.port + this.$config.API.userInfoPath + payload.userId, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          this.$router.go();
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#login-card{
    max-width: 600px;
    margin: 0 auto;
}
</style>
<style lang="scss">
#app {
  &:after{
    background: linear-gradient(-3deg, var(--md-theme-default-accent) 15%, #fff 15%);
    display: block;
    position: fixed;
    top: 0;
    bottom: 0;
    content: "";
    right: 0;
    left: 0;
    z-index: -999;
  }
}
</style>
