<template>
	<form id="loginForm" @submit.prevent="validateBeforeSubmit">
		<h2>Registrierung</h2>
		<div v-if="userRole === 'superhero'">
			<h3>Anbieter</h3>
			<ProviderDataInput v-model="providerData" />
		</div>
		<h3>Nutzer</h3>
		<UserDataInput v-model="userData" />
		<div class="button_wrapper">
			<BaseButton type="submit">{{ $lang.buttons.registrate }}</BaseButton>
		</div>
	</form>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";
import UserDataInput from "@/components/userManagement/userDataInput";
import ProviderDataInput from "@/components/userManagement/providerDataInput";

import { mapActions, mapGetters } from "vuex";

export default {
	components: {
		BaseButton,
		UserDataInput,
		ProviderDataInput,
	},
	data() {
		return this.initialDataState();
	},
	computed: {
		...mapGetters("user", {
			userInfo: "GET_USER",
		}),
		userRole() {
			return (this.userInfo || {}).role || "superhero";
		},
	},
	methods: {
		...mapActions("user", {
			submitProviderRegistration: "REGISTER_PROVIDER",
			submitUserRegistration: "REGISTER_USER",
		}),
		validateBeforeSubmit() {
			if (
				this.userData.email != "" &&
				this.userData.password != "" &&
				this.userData.forename != "" &&
				this.userData.familyname != "" &&
				this.userData.username != ""
			) {
				if (this.userRole === "superhero" && this.providerData.name != "") {
					// SC creates new provider and its Admin
					this.registerProviderWithAdmin();
				} else if (this.userRole === "admin") {
					// Admin of a provider creates his colleagues
					this.registerUser();
				}
			}
		},
		registerUser() {
			// Admin can only create users of its own company
			this.userData.providerId = this.userInfo.providerId;
			this.submitUserRegistration(this.userData).then(
				(response) => {
					this.$toasted.show(`Registratrated`);
					this.clearForm();
				},
				(error) => {
					this.$toasted.error(`Failed to registrate user` + error);
				}
			);
		},
		registerProviderWithAdmin() {
			return this.submitProviderRegistration(this.providerData).then(
				(response) => {
					this.userData.providerId = response._id;
					this.submitUserRegistration(this.userData).then(
						(response) => {
							this.$toasted.show(
								`Registrated ${this.userData.forename} ${
									this.userData.familyname
								}`
							);
							this.clearForm();
						},
						(error) => {
							this.$toasted.error(`Failed to registrate user` + error);
						}
					);
				},
				(error) => {
					this.$toasted.error(`Failed to registrate provider` + error);
				}
			);
		},
		clearForm() {
			Object.assign(this.$data, this.initialDataState());
		},
		initialDataState() {
			return {
				userData: {
					familyname: "",
					forename: "",
					email: "",
					username: "",
					password: "",
					providerId: "",
				},
				providerData: {
					name: "",
				},
			};
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
</style>
