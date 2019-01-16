<template>
  <MdCard
    id="login-card"
    class="card-content"
  >
    <MdCardHeader>
      <h2 class="md-title">
        {{ $lang.login.title }}
      </h2>
    </MdCardHeader>

    <MdCardContent>
      <form
        id="loginForm"
        @submit.prevent="validateBeforeSubmit"
      >
        <MdField>
          <label>{{ $lang.login.username }}</label>
          <MdInput
            v-model="login.username"
            name="username"
            required
          />
        </MdField>
        <MdField md-has-password>
          <label>{{ $lang.login.password }}</label>
          <MdInput
            v-model="login.password"
            name="password"
            type="password"
            required
          />
        </MdField>
        <a :href="this.$config.API.baseUrl + this.$config.API.pwRecoveryPath">
          {{ $lang.login.forgot_password }}?
        </a>
      </form>
    </MdCardContent>

    <MdCardActions>
      <MdButton
        class="md-primary"
        type="submit"
        form="loginForm"
      >
        {{ $lang.buttons.login }}
      </MdButton>
    </MdCardActions>
  </MdCard>
</template>

<script>
export default {
	name: 'Login',
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
			if (this.login.username != '' && this.login.password != '') {
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
					alert('Login fehlgeschlagen!');
					console.error(e); // eslint-disable-line no-console
				});
		},
		getUserInfo(jwt) {
			const base64Url = jwt.split('.')[1];
			const base64 = base64Url.replace('-', '+').replace('_', '/');
			const payload = JSON.parse(window.atob(base64));
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
					console.error(e); // eslint-disable-line no-console
				});
		},
	},
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  #login-card {
    max-width: 600px;
    margin: 1em auto;
  }
</style>
<style lang="scss">
  #app {
    &:after {
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
