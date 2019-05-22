<template>
	<form id="loginForm" @submit.prevent="validateBeforeSubmit">
		<BaseCard id="login-card">
			<template slot="head">
				<div class="title">{{ $lang.registration.title }}</div>
			</template>
			<template slot="body">
				<BaseInput
					v-model="userData.fullName"
					:label="$lang.registration.fullName"
					name="fullName"
					type="text"
					placeholder="Vorname Nachname *"
					required
				/>
				<BaseInput
					v-model="userData.email"
					:label="$lang.registration.username"
					name="username"
					type="text"
					placeholder="Benutzername *"
					required
				/>
				<BaseInput
					ref="passwordInput"
					v-model="userData.password"
					:type="pwInputType"
					:label="$lang.registration.password"
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
			</template>
			<template slot="footer">
				<div class="button_wrapper">
					<BaseButton type="submit">{{ $lang.buttons.registrate }}</BaseButton>
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
			userData: {
				fullName: "",
				email: "",
				password: "",
				strategy: "local",
			},
			pwInputType: "password",
			pwVisible: false,
		};
	},
	methods: {
		...mapActions("user", {
			submitRegistration: "REGISTRATION",
		}),
		validateBeforeSubmit() {
			if (
				this.userData.email != "" &&
				this.userData.password != "" &&
				this.userData.fullName != ""
			) {
				return this.submitRegistration(this.userData);
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
