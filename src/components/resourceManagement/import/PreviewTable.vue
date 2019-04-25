<template>
	<div>
		<table>
			<tr>
				<th v-for="(header, index) in headerFields" :key="index">
					{{ header }}
				</th>
			</tr>
			<tr v-for="(row, index) in formattedContent" :key="index">
				<td v-for="(field, key) in row" :key="key">
					{{ field }}
				</td>
			</tr>
		</table>

		<div v-if="clipped" class="text-center">
			<i class="material-icons">more_horiz</i>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		headerFields: {
			type: Array,
			required: true,
		},
		content: {
			type: Array,
			required: true,
		},
		clipped: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		formattedContent: function() {
			return this.content.map((row) => {
				return this.headerFields.map((headerField) => {
					if (Array.isArray(row[headerField])) {
						return row[headerField].join(", ");
					}
					return row[headerField];
				});
			});
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
.text-center {
	text-align: center;
}
</style>
