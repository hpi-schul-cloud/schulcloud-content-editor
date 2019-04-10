<template>
	<div>
		<table v-if="resources.length" class="table sticky">
			<thead>
				<tr>
					<th></th>
					<th v-for="column in visibleColoumns" :key="column">
						{{ column }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(resource, index) in resources" :key="resource._id">
					<td>{{ indexStart + index + 1 }}</td>
					<td v-for="column in visibleColoumns" :key="column">
						<component
							:is="getColoumnComponent(column)"
							v-model="resource[column]"
							:label="`edit ${column}`"
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<p v-else>Nothing found :(</p>
	</div>
</template>

<script>
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseTags from "@/components/base/BaseTags.vue";

const availableColoumns = [
	{
		key: "title",
		component: BaseInput,
	},
	{
		key: "tags",
		component: BaseTags,
	},
];

export default {
	props: {
		resources: {
			type: Array,
			required: true,
		},
		indexStart: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			visibleColoumns: ["title", "tags"], //, "url", "contentCategory", "tags"],
		};
	},
	methods: {
		getColoumnComponent(key) {
			const coloumn = availableColoumns.find((coloumn) => coloumn.key === key);
			return !!coloumn ? coloumn.component : undefined;
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
	table-layout: fixed;
	border-collapse: collapse;
	td {
		padding: 2px 4px;
		overflow-x: auto;
		white-space: nowrap;
	}
	&.sticky {
		th {
			position: sticky;
			font-size: 1.1em;
			background: #fff;
		}
		thead th {
			top: 0;
		}
	}
}
tbody tr {
	&:nth-of-type(2n) {
		background-color: #eee;
	}
	&:hover {
		background-color: #ddd;
	}
}
</style>
