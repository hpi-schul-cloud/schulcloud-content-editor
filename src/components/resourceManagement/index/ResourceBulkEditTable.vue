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
					:replace="bulkInputs[0]"
					:search="bulkInputs[1]"
					:visible-coloumns="visibleColoumns"
					@submit="$emit('patchBulk', $event)"
					@delete="$emit('deleteBulk')"
				/>

				<transition
					v-for="(resource, rowIndex) in resources"
					:key="resource._id"
					name="fade"
					mode="out-in"
				>
					<EditTableRow
						:key="resource._id"
						:resource="resource"
						:row-name="indexStart + rowIndex + 1"
						:visible-coloumns="visibleColoumns"
						@submit="$emit('patchResource', $event)"
						@delete="$emit('deleteResource', $event)"
						:keyInputMapping="availableColoumns"
					/>
				</transition>
			</tbody>
		</table>
	</div>
</template>

<script>
import EditTableRow from "./EditTable/EditTableRow";
import { resourceInputMapping } from "@/mixins/inputMappings";
import BulkEditTableRow from "./EditTable/BulkEditTableRows";

export const availableColoumns = resourceInputMapping;

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

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
