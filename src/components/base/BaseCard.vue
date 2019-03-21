<template>
	<div class="card">
		<div class="header">
			<slot name="head"></slot>
		</div>
		<div class="content">
			<slot name="content"></slot>
		</div>
		<div class="action">
			<slot name="action"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "BaseCard",
};
</script>

<style lang="scss" scoped>
.card {
	background: white;
	border-radius: 2px;
	box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
		0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.header {
	padding: 16px 16px 8px;

	.title {
		margin-top: 8px;
		font-size: 24px;
		font-weight: 400;
		line-height: 32px;
	}
}
.content {
	padding: 8px 16px;
}
.action {
	padding: 8px 16px 16px;
}
</style>
