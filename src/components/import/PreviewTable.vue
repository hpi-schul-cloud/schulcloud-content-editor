<template>
	<table>
		<tr>
			<th v-for="(header, index) in headerFields" :key="index">
				{{ header }}
			</th>
		</tr>
		<tr v-for="(row, index) in content" :key="index">
			<td v-for="(field, key) in row" :key="key">
				{{ field }}
			</td>
		</tr>
	</table>
</template>
<script>
export default {
	name: "PreviewTable",
	props: {
		headerFields: {
			type: Array,
			required: true,
		},
		content: {
			type: Array,
			required: true,
		},
	},
};
</script>
<style lang="scss" scoped>
table,
th,
td {
	border-collapse: collapse;
	border: 1px solid black;
}

th,
td {
	padding: 8px;
}

table {
	width: 100%;
}
</style>
