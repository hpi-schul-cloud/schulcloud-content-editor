<template>
	<div class="card">
		<slot>
			<div v-if="$slots.media" class="media">
				<slot name="media"></slot>
			</div>
			<div v-if="$slots.head" class="header">
				<slot name="head"></slot>
			</div>
			<div v-if="$slots.body" class="body">
				<slot name="body"></slot>
			</div>
			<div v-if="$slots.footer" class="footer">
				<slot name="footer"></slot>
			</div>
		</slot>
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
	padding: 16px;

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
		max-height: 300px;
		border-top-left-radius: 2px;
		border-top-right-radius: 2px;
	}

	+ .header {
		padding: 8px 16px;
	}
}
.body {
	padding: 8px 16px;
	word-break: break-word;
}
.footer {
	padding: 8px 16px 16px;
}
</style>
