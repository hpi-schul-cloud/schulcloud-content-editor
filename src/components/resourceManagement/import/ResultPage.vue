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
		<p
			v-if="config.subtitle"
			class="result-subtitle"
			v-html="config.subtitle"
		></p>
		<div class="button-wrapper">
			<BaseButton
				v-if="config.type === 'error'"
				styling="primary"
				@click="
					$emit('result-page-button-clicked', {
						handler: 'importCSV',
						event: $event,
					})
				"
			>
				Erneut Versuchen
			</BaseButton>
			<template v-else>
				<BaseButton
					v-for="button in successButtonConfig"
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
			</template>
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
					to: { name: "resourceManagement" },
					styling: "primary",
				},
				{
					text: "Zum Import",
					styling: "secondary",
					clickHandler: "resetImport",
				},
			],
		};
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
