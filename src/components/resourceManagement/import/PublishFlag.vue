<template>
	<div class="center-column">
		<h4 class="title">Inhalte veröffentlichen?</h4>
		<BaseCheckbox
			v-model="isPublished"
			label="published"
			@input="$emit('input', $event)"
		></BaseCheckbox>
		<div class="center-row">
			<p>
				<b>! Hinweis:</b>
				Nur vollständige und valide Inhalte werden veröffentlicht.
			</p>
			<i
				v-if="isPublished"
				class="hint-icon material-icons"
				@click="showValidationDialog = true"
			>
				feedback
			</i>
		</div>
		<ValidationResultDialog
			:active.sync="showValidationDialog"
			:validation-results="validationResult"
		/>
	</div>
</template>
<script>
import ValidationResultDialog from "@/components/resourceManagement/import/ValidationResultDialog";
import BaseCheckbox from "@/components/base/BaseCheckbox";

export default {
	components: {
		ValidationResultDialog,
		BaseCheckbox,
	},
	props: {
		value: {
			type: Boolean,
		},
		validationResult: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			showValidationDialog: false,
		};
	},
	computed: {
		isPublished: {
			get() {
				return this.value;
			},
			set(isPublished) {
				this.$emit("input", isPublished);
			},
		},
	},
	watch: {
		isPublished: function(to, from) {
			if (to === true) {
				this.showValidationDialog = true;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.center-column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.center-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.title {
	margin-bottom: 0;
}
.hint-icon {
	cursor: pointer;
}
</style>
