<template>
	<div>
		<h3 class="title">Inhalte veröffentlichen?</h3>
		<BaseCheckbox
			v-model="isPublished"
			label="published"
			@input="$emit('input', $event)"
		>
			<template v-if="isPublished" slot="icon">
				<i
					class="hint-icon material-icons"
					@click.prevent="showValidationDialog = true"
				>
					feedback
				</i>
			</template>
		</BaseCheckbox>
		<div>
			<p class="hint-text">
				<b>! Hinweis:</b>
				Nur vollständige und valide Inhalte werden veröffentlicht.
			</p>
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
.title {
	margin: 2em 0 0.5em;
}
.hint-text {
	margin: 0.5em 0;
}
.hint-icon {
	cursor: pointer;
}
</style>
