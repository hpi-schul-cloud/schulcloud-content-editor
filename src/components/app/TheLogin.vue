<template>
	<form id="loginForm" @submit.prevent="validateBeforeSubmit">
		<BaseCard id="login-card">
			<template slot="head">
				<div class="title">{{ $lang.login.title }}</div>
			</template>
			<template slot="body">
				<BaseInput
					v-model="login.username"
					:label="$lang.login.username"
					name="username"
					type="text"
					placeholder="Benutzername *"
					required
				/>
				<BaseInput
					ref="passwordInput"
					v-model="login.password"
					:type="pwInputType"
					:label="$lang.login.password"
					name="password"
					placeholder="Passwort *"
					required
				>
					<template slot="icon">
						<span class="visibility-icon-wrapper">
							<BaseButton
								v-if="pwVisible"
								:round-shape="true"
								@click="toggleVisibility"
								styling="secondary"
							>
								<i class="material-icons">visibility</i>
							</BaseButton>
							<BaseButton
								v-else
								:round-shape="true"
								@click="toggleVisibility"
								styling="secondary"
							>
								<i class="material-icons">visibility_off</i>
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
import BaseButton from "@/components/base/BaseButton";
import BaseCard from "@/components/base/BaseCard";
import BaseInput from "@/components/base/BaseInput";

import api from "@/mixins/api.js";
import { mapActions } from "vuex";

export default {
	components: {
		BaseButton,
		BaseCard,
		BaseInput,
	},
	mixins: [api],
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
		...mapActions("user", {
			submitLogin: "LOGIN",
		}),
		validateBeforeSubmit() {
			if (this.login.username != "" && this.login.password != "") {
				return this.submitLogin(this.login);
			}
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
