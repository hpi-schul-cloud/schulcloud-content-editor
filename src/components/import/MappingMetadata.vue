<template>
	<table class="fixed">
		<tr>
			<th id="state-column"></th>
			<th>Metadaten Felder</th>
			<th>CSV-Felder</th>
		</tr>
		<tr v-for="(value, key) in metadataFieldMapping" :key="key">
			<td>
				<i v-if="metadataFieldMapping[key] != ''" class="material-icons">
					done
				</i>
			</td>
			<td>{{ key }}</td>
			<td>
				<BaseSelect
					:options="options"
					:disabled-options="disabledOptions"
					label=""
					name="FieldMapping"
					:selected="metadataFieldMapping[key]"
					@input="handleInput($event, key)"
				/>
			</td>
		</tr>
	</table>
</template>

<script>
import BaseSelect from "@/components/base/BaseSelect.vue";

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
		options: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			disabledOptions: [],
		};
	},
	methods: {
		handleInput(event, key) {
			if (event != this.options[0].key) {
				this.disabledOptions.push(event);
			}
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

	#state-column {
		width: 40px;
	}
}
</style>
