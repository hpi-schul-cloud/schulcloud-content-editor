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
	</div>
</template>
<script>
export default {
	props: {
		config: {
			type: Object,
			required: true,
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
}
</style>
