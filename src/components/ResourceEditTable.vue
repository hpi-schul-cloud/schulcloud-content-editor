<template>
	<div>
		Data:
		<pre v-if="resources.length">{{ JSON.stringify(resources, null, 2) }}</pre>
		<p v-else>Nothing found :(</p>
	</div>
</template>

<script>
export default {
	props: {
		resources: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
pre {
	padding: 1rem;
	font-family: monospace;
	background: #eee;
}
</style>
