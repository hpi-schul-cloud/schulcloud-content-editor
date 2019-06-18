<template>
	<div v-bind="$attrs" v-on="$listeners" class="action-container">
		<span v-ripple class="action-icon">
			<i class="material-icons">
				{{ config.icon }}
			</i>
		</span>
		<div class="action-label">
			{{ config.text }}
		</div>
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
.action-container {
	position: relative;

	--spacing: 1em;

	margin-bottom: var(--spacing);
}
.action-icon,
.action-label {
	font-size: 14px;
	cursor: pointer;
	user-select: none;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}
.action-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: #fff;
	border-radius: 2em;
	.material-icons {
		font-size: 1.4em;
	}
}
.action-label {
	position: absolute;
	top: 50%;
	right: calc(100% + var(--spacing));
	padding: 4px 8px;
	white-space: nowrap;
	background: #fff;
	border-radius: 0.25em;
	transform: translateY(-50%);
}
</style>
