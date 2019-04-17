<template>
	<table class="fixed">
		<thead>
			<tr>
				<th class="state-column"></th>
				<th>Metadaten Felder</th>
				<th>CSV-Felder</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(value, key) in metadataFieldMapping" :key="key">
				<td>
					<i v-if="metadataFieldMapping[key] != ''" class="material-icons">
						done
					</i>
				</td>
				<td>{{ $lang.resources[key] }}</td>
				<td>
					<BaseSelect
						:options="mappingOptions"
						:disabled-options="disabledOptions"
						label=""
						name="FieldMapping"
						:selected="metadataFieldMapping[key]"
						@input="handleInput($event, key)"
					/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect";

export default {
	components: {
		BaseSelect,
	},
	model: {
		prop: "metadataFieldMapping",
		event: "input",
	},
	props: {
		metadataFieldMapping: {
			type: Object,
			required: true,
		},
		csvHeaders: {
			type: Array,
			required: true,
		},
	},
	computed: {
		mappingOptions: function() {
			let options = [{ key: "none", value: "kein Match" }];

			options.push(
				...this.csvHeaders.map((headerField) => {
					let obj = {};
					obj.key = headerField;
					obj.value = headerField;
					return obj;
				})
			);

			return options;
		},
		disabledOptions: function() {
			const selected = Object.values(this.metadataFieldMapping);
			return selected.filter((option) => {
				return option !== this.mappingOptions[0].key;
			});
		},
	},
	methods: {
		handleInput(event, key) {
			this.metadataFieldMapping[key] = event;
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

.fixed {
	table-layout: fixed;

	.state-column {
		width: 40px;
	}
}
</style>
