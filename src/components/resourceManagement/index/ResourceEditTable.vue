<template>
	<div class="overflow-container">
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
			<tfoot>
				<tr>
					<th style="width: 3em" />
					<th v-for="coloumn in visibleColoumns" :key="coloumn">
						{{ $lang.resources[coloumn] }}
					</th>
					<th class="fit-content">
						Actions
					</th>
				</tr>
			</tfoot>
			<tbody>
				<BulkEditTableRow
					v-for="bulkInput in bulkInputs"
					:key="bulkInput.name"
					:resource="bulkInput"
					:row-name="bulkInput.name"
					:visible-coloumns="visibleColoumns"
					@submit="passThroughBulkSubmit"
				/>
				<tr v-if="bulkInputs.length" class="spacer"></tr>
				<EditTableRow
					v-for="(resource, rowIndex) in resources"
					:key="resource._id"
					:resource="resource"
					:row-name="indexStart + rowIndex + 1"
					:visible-coloumns="visibleColoumns"
					@submit="passThroughResourceSubmit"
				/>
			</tbody>
		</table>
	</div>
</template>

<script>
import EditTableRow, { keyInputMapping } from "./EditTable/EditTableRow";
import BulkEditTableRow from "./EditTable/BulkEditTableRows";

export const availableColoumns = keyInputMapping;

export default {
	components: {
		EditTableRow,
		BulkEditTableRow,
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
		passThroughBulkSubmit(resource) {
			this.$emit("patchBulk", resource);
		},
		passThroughResourceSubmit(resource) {
			this.$emit("patchResource", resource);
		},
	},
};
</script>

<style lang="scss" scoped>
.overflow-container {
	width: 100%;
	overflow-x: auto;
}
.table {
	box-sizing: border-box;
	// width: 100%;
	width: calc(100% - 2px);
	border-collapse: collapse;
	th {
		padding: 0 4px;
		text-align: left;
		&:last-of-type {
			text-align: right;
		}
	}
	tbody tr {
		/*
		&:nth-of-type(2n) {
			background-color: #eee;
		}
		*/
		&:hover {
			background-color: #ccc;
		}
	}
}
.spacer {
	height: 2rem;
}

/*
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
*/
</style>
