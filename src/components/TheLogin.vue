<template>
	<form id="loginForm" @submit.prevent="validateBeforeSubmit">
		<BaseCard id="login-card">
			<template slot="head">
				<div class="title">{{ $lang.login.title }}</div>
			</template>
			<template slot="body">
				<BaseInput
					v-model="login.username"
					name="username"
					type="text"
					:label="$lang.login.username"
					placeholder="Benutzername *"
					required
				/>
				<BaseInput
					ref="passwordInput"
					v-model="login.password"
					name="password"
					:type="pwInputType"
					:label="$lang.login.password"
					placeholder="Passwort *"
					required
				>
					<template slot="icon">
						<span class="visibility-icon-wrapper">
							<BaseButton
								v-if="pwVisible"
								styling="secondary"
								:round-shape="true"
								@click="toggleVisibility"
							>
								<img ref="visibilityIcon" src="@/assets/icon-visibility.svg" />
							</BaseButton>
							<BaseButton
								v-else
								styling="secondary"
								:round-shape="true"
								@click="toggleVisibility"
							>
								<img
									ref="visibilityIcon"
									src="@/assets/icon-visibility_off.svg"
								/>
							</BaseButton>
						</span>
					</template>
				</BaseInput>
				<a :href="this.$config.API.baseUrl + this.$config.API.pwRecoveryPath">
					{{ $lang.login.forgot_password }}?
				</a>
			</template>
			<template slot="footer">
				<div class="button_wrapper">
					<BaseButton type="submit">{{ $lang.buttons.login }}</BaseButton>
				</div>
			</template>
		</BaseCard>
	</form>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseInput from "@/components/base/BaseInput.vue";

export default {
	name: "Login",
	components: {
		BaseButton,
		BaseCard,
		BaseInput,
	},
	data() {
		return {
			login: {
				username: "",
				password: "",
			},
			pwInputType: "password",
			pwVisible: false,
		};
	},
	created() {
		if (this.$cookies.get("jwt")) {
			localStorage.setItem("jwt", this.$cookies.get("jwt"));
			this.$router.go();
		}
	},
	methods: {
		validateBeforeSubmit() {
			if (this.login.username != "" && this.login.password != "") {
				return this.getToken();
			}
		},
		getToken() {
			this.$http
				.post(
					this.$config.API.serverServerUrl + this.$config.API.authPath,
					this.login
				)
				.then((response) => {
					// JSON responses are automatically parsed.
					const jwt = response.data.accessToken;
					localStorage.setItem("jwt", jwt);
					this.$cookies.set(
						"jwt",
						jwt,
						new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
					);
					this.getUserInfo(jwt);
				})
				.catch((e) => {
					alert("Login fehlgeschlagen!");
					console.error(e); // eslint-disable-line no-console
				});
		},
		getUserInfo(jwt) {
			const base64Url = jwt.split(".")[1];
			const base64 = base64Url.replace("-", "+").replace("_", "/");
			const payload = JSON.parse(window.atob(base64));
			this.$http
				.get(
					this.$config.API.serverServerUrl +
						this.$config.API.userInfoPath +
						payload.userId,
					{
						headers: {
							Authorization: `Bearer ${jwt}`,
						},
					}
				)
				.then((response) => {
					localStorage.setItem("userInfo", JSON.stringify(response.data));
					this.$router.go();
				})
				.catch((e) => {
					console.error(e); // eslint-disable-line no-console
				});
		},
		toggleVisibility() {
			this.pwVisible = !this.pwVisible;
			if (this.pwInputType === "password") {
				this.pwInputType = "text";
			} else {
				this.pwInputType = "password";
			}
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
.button_wrapper {
	display: flex;
	justify-content: flex-end;
}
.visibility-icon-wrapper {
	position: absolute;
	right: 0;
	bottom: 0;
}
</style>
