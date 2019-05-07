<template>
	<div>
		<h3>Mapping</h3>
		<table class="fixed">
			<thead>
				<tr>
					<th class="icon-column"></th>
					<th>Metadaten Felder</th>
					<th class="icon-column"></th>
					<th>CSV-Felder</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(value, key) in metadataFieldMapping" :key="key">
					<td class="icon-column">
						<i v-if="value.mappedHeader != ''" class="material-icons">
							done
						</i>
					</td>
					<td>
						{{ $lang.resources[key] }}
						<span v-if="value.required" class="required-flag">*</span>
						<p class="field-description">{{ value.description }}</p>
					</td>
					<td class="icon-column">
						<i class="material-icons">
							arrow_right_alt
						</i>
					</td>
					<td>
						<BaseSelect
							:options="mappingOptions"
							:disabled-options="disabledOptions"
							label=""
							name="Mapping"
							:selected="value.mappedHeader"
							@input="handleInput($event, key)"
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<p>* required Felder</p>
	</div>
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
		validOptions: {
			type: Object,
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
			let disabledValues = Object.values(this.metadataFieldMapping)
				.map((value) => {
					return value.mappedHeader;
				})
				.filter((option) => {
					return option && option !== this.mappingOptions[0].key;
				});

			Object.entries(this.validOptions).forEach(([key, value]) => {
				if (value === false) disabledValues.push(key);
			});

			return disabledValues;
		},
	},
	methods: {
		handleInput(event, key) {
			this.metadataFieldMapping[key].mappedHeader = event;
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
	border-right: none;
	border-left: none;
}

th {
	text-align: left;
}

th,
td {
	padding: 8px;
}

table {
	width: 100%;
}

.icon-column {
	width: 50px;
	text-align: center;

	i {
		vertical-align: middle;
	}
}

.fixed {
	table-layout: fixed;
}
.field-description {
	margin: 0;
	font-size: 0.8em;
	color: #828282;
}
.required-flag {
	font-size: 0.8em;
	vertical-align: top;
}
</style>
