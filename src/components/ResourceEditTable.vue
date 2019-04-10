<template>
	<div>
		<table v-if="resources.length" class="sticky">
			<thead>
				<tr>
					<th></th>
					<th v-for="column in visibleColoumns" :key="column">
						{{ column }}
					</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th></th>
					<th v-for="column in visibleColoumns" :key="column">
						{{ column }}
					</th>
				</tr>
			</tfoot>
			<tbody>
				<tr v-for="(resource, index) in resources" :key="resource._id">
					<td>{{ indexStart + index + 1 }}</td>
					<td v-for="column in visibleColoumns" :key="column">
						{{ resource[column] }}
					</td>
				</tr>
			</tbody>
		</table>
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
		indexStart: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			availableColoumns: [],
			visibleColoumns: ["title", "url", "contentCategory", "tags"],
		};
	},
};
</script>

<style lang="scss" scoped>
table {
	border-collapse: collapse;
	td {
		padding: 2px 4px;
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
		tfoot th {
			bottom: 0;
		}
	}
}
tbody tr:nth-of-type(2n) {
	background-color: #ddd;
}
</style>
