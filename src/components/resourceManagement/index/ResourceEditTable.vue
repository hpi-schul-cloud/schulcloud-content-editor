<template>
	<table class="table edit sticky">
		<thead>
			<tr>
				<th style="width: 3em" />
				<th v-for="coloumn in visibleColoumns" :key="coloumn">
					{{ $lang.resources[coloumn] }}
				</th>
				<th class="fit-content">
					Actions
				</th>
			</tr>
		</thead>
		<tbody>
			<EditTableRow
				v-for="bulkInput in bulkInputs"
				:key="bulkInput.name"
				:resource="bulkInput"
				:row-name="bulkInput.name"
				:visible-coloumns="visibleColoumns"
			/>
			<tr v-if="bulkInputs.length" class="spacer"></tr>
			<EditTableRow
				v-for="(resource, rowIndex) in resources"
				:key="resource._id"
				:resource="resource"
				:row-name="indexStart + rowIndex + 1"
				:visible-coloumns="visibleColoumns"
				@patchResource="passThroughSubmit"
			/>
		</tbody>
	</table>
</template>

<script>
import EditTableRow, { keyInputMapping } from "./EditTable/EditTableRow";

export const availableColoumns = keyInputMapping;

export default {
	components: {
		EditTableRow,
	},
	props: {
		bulkInputs: {
			type: Array,
			default: () => [],
		},
		resources: {
			type: Array,
			required: true,
		},
		indexStart: {
			type: Number,
			default: 0,
		},
		visibleColoumns: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			availableColoumns,
		};
	},
	methods: {
		passThroughSubmit(resource) {
			this.$emit("patchResource", resource);
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
	border-collapse: collapse;
	tbody tr {
		&:nth-of-type(2n) {
			background-color: #eee;
		}
		&:hover {
			background-color: #ccc;
		}
	}
}
.spacer {
	height: 2rem;
}
table.sticky {
	th {
		position: sticky;
		z-index: 1;
		font-size: 1.1em;
		background: #fff;
	}
	thead th {
		top: 80px;
	}
}
</style>
