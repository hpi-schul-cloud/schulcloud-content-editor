<template>
	<div class="result-wrapper">
		<img
			:class="{
				'result-image': true,
				'success-icon': config.type === 'success',
			}"
			:src="config.iconSrc"
		/>
		<p v-if="config.numbers" class="result-numbers">
			{{ config.numbers }}
		</p>
		<h3 class="result-title">{{ config.title }}</h3>
		<!-- eslint-disable vue/no-v-html -->
		<p
			v-if="config.subtitle"
			class="result-subtitle"
			v-html="config.subtitle"
		/>
		<!-- eslint-enable vue/no-v-html -->

		<div class="button-wrapper">
			<BaseButton
				v-for="button in buttonConfig"
				:key="button.text"
				:to="button.to"
				:styling="button.styling"
				@click="
					$emit('result-page-button-clicked', {
						handler: button.clickHandler,
						event: $event,
					})
				"
			>
				{{ button.text }}
			</BaseButton>
		</div>
	</div>
</template>
<script>
import BaseButton from "@/components/base/BaseButton";

export default {
	components: {
		BaseButton,
	},
	props: {
		config: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			successButtonConfig: [
				{
					text: "Zur Verwaltung",
					to: { name: "resourceManagement" },
					styling: "secondary",
				},
				{
					text: "Importierte Inhalte ansehen",
					to: {
						name: "resourceManagement",
						params: {
							defaultQuery: {
								createdAt: {
									$gt: Date.now() - 2 * 60 * 1000, // now before 5 mins
								},
								userId: this.$store.getters["user/GET_USER"]._id,
							},
						},
					},
					styling: "primary",
				},
				{
					text: "Zum Import",
					styling: "secondary",
					clickHandler: "resetImport",
				},
			],
			errorButtonConfig: [
				{
					text: "Zum Import",
					styling: "secondary",
					clickHandler: "resetImport",
				},
				{
					text: "Erneut Versuchen",
					styling: "primary",
					clickHandler: "importCSV",
				},
			],
		};
	},
	computed: {
		buttonConfig() {
			if (this.config.type === "error") {
				return this.errorButtonConfig;
			} else return this.successButtonConfig;
		},
	},
};
</script>
<style lang="scss" scoped>
.result-wrapper {
	text-align: center;

	.result-title {
		margin: 0.2em 0;
		font-size: 2em;
		font-weight: 300;
	}
	.result-subtitle {
		margin: 0.2em 0;
		font-size: 1.2em;
		font-weight: 300;
	}
	.result-numbers {
		margin: 0.1em;
		font-size: 3em;
		font-weight: bold;
	}
	.result-image {
		width: 18em;
		margin: 1em 0;

		&.success-icon {
			width: 5em;
		}
	}
	.button-wrapper {
		display: flex;
		justify-content: center;
		margin: 2em 0;
	}
}
</style>
