<template>
	<div class="card">
		<div v-if="withMedia === true" class="media">
			<slot name="media"></slot>
		</div>
		<div class="header">
			<slot name="head"></slot>
		</div>
		<div class="content">
			<slot name="content"></slot>
		</div>
		<div class="footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: "BaseCard",
	props: {
		withMedia: {
			type: Boolean,
			default: false,
		},
	},
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
.media {
	img {
		width: 100%;
		border-top-left-radius: 2px;
		border-top-right-radius: 2px;
	}

	+ .header {
		padding-top: 8px;
	}
}
.content {
	padding: 8px 16px;
	word-break: break-word;
}
.footer {
	padding: 8px 16px 16px;
}
</style>
