<template>
	<div>
		<BaseInput
			v-model="userData.username"
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
						styling="secondary"
						@click="toggleVisibility"
					>
						<i class="material-icons">visibility</i>
					</BaseButton>
					<BaseButton
						v-else
						:round-shape="true"
						styling="secondary"
						@click="toggleVisibility"
					>
						<i class="material-icons">visibility_off</i>
					</BaseButton>
				</span>
			</template>
		</BaseInput>
		<BaseInput
			v-model="userData.email"
			:label="$lang.registration.email"
			name="email"
			type="email"
			placeholder="E-Mail-Adresse *"
			required
		/>
		<BaseInput
			v-model="userData.forename"
			:label="$lang.registration.forename"
			name="forename"
			type="text"
			placeholder="Vorname *"
			required
		/>
		<BaseInput
			v-model="userData.familyname"
			:label="$lang.registration.familyname"
			name="familyname"
			type="text"
			placeholder="Nachname *"
			required
		/>
	</div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";

import { mapActions } from "vuex";

export default {
	components: {
		BaseButton,
		BaseInput,
	},
	props: {
		value: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			pwInputType: "password",
			pwVisible: false,
		};
	},
	computed: {
		userData: {
			get() {
				return this.value;
			},
			set(userData) {
				this.$emit("input", userData);
			},
		},
	},
	methods: {
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
.visibility-icon-wrapper {
	position: absolute;
	right: 0;
	bottom: 0;
}
</style>
