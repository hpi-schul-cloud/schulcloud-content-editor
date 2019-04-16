<template>
	<table class="table edit sticky">
		<thead v-if="headerVisible">
			<tr>
				<th style="width: 3em" />
				<th
					v-for="coloumn in visibleColoumns"
					:key="coloumn"
					:class="getComponent(coloumn).class"
				>
					{{ $lang.resources[coloumn] }}
				</th>
				<th class="fit-content">
					Actions
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(resource, rowIndex) in resources" :key="resource._id">
				<td style="text-align: right;">{{ indexStart + rowIndex + 1 }}</td>
				<td
					v-for="(coloumn, coloumnIndex) in visibleColoumns"
					:key="coloumn"
					v-bind="getComponent(coloumn).wrapperAttributes"
				>
					<form
						v-if="coloumnIndex === 0"
						:id="getFormId(rowIndex)"
						@submit.prevent="
							handleFormSubmit(resource, indexStart + rowIndex + 1)
						"
					></form>
					<component
						:is="getComponent(coloumn).component"
						v-model="resource[coloumn]"
						:form="getFormId(rowIndex)"
						:label="coloumn"
						:name="coloumn"
						v-bind="getComponent(coloumn).attributes"
					/>
				</td>
				<td style="text-align: center;">
					<BaseButton type="submit" :form="getFormId(rowIndex)" class="action">
						<i class="material-icons">
							check
						</i>
					</BaseButton>
					<RouterLink
						class="action"
						:to="{
							name: 'resourceManagement/edit',
							params: { id: resource._id },
						}"
					>
						<i class="material-icons">
							edit
						</i>
					</RouterLink>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
import { options as MimeTypeOptions } from "@/components/inputs/ContentMimetype.vue";
import { options as CategoryOptions } from "@/components/inputs/ContentCategory.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import TableCheckbox from "@/components/EditTable/TableCheckbox.vue";
import TableInput from "@/components/EditTable/TableInput.vue";
import TableTextarea from "@/components/EditTable/TableTextarea.vue";
import TableSelect from "@/components/EditTable/TableSelect.vue";
import TableTags from "@/components/EditTable/TableTags.vue";

export const availableColoumns = [
	{ key: "title", component: TableInput, attributes: { type: "text" } },
	{ key: "tags", component: TableTags, attributes: {} },
	{
		key: "mimeType",
		component: TableSelect,
		attributes: { options: MimeTypeOptions },
	},
	{
		key: "contentCategory",
		component: TableSelect,
		attributes: { options: CategoryOptions },
		wrapperAttributes: {
			style: "width: 150px",
		},
	},
	{
		key: "description",
		component: TableTextarea,
		attributes: {},
	},
	{
		key: "isPublished",
		component: TableCheckbox,
		attributes: { type: "checkbox" },
		wrapperAttributes: {
			class: "fit-content",
		},
	},
	{ key: "url", component: TableInput, attributes: { type: "url" } },
	{ key: "thumbnail", component: TableInput, attributes: { type: "url" } },
	{
		key: "licenses",
		component: TableTags,
		attributes: {},
		wrapperAttributes: {
			style: "width: 150px",
		},
	},
];

export default {
	components: {
		BaseButton,
		TableInput,
	},
	props: {
		resources: {
			type: Array,
			required: true,
		},
		indexStart: {
			type: Number,
			default: 0,
		},
		headerVisible: {
			type: Boolean,
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
		getComponent(key) {
			return availableColoumns.find((coloumn) => coloumn.key === key);
		},
		getFormId(index) {
			return `table-form-${index}`;
		},
		handleFormSubmit(resource, index) {
			this.$emit("patchResource", resource);
		},
	},
};
</script>

<style lang="scss" scoped>
.table {
	width: 100%;
	border-collapse: collapse;
	.fit-content {
		width: 1px;
		white-space: nowrap;
	}
	td {
		padding: 0 4px;
		overflow: hidden;
		overflow-x: auto;
		white-space: nowrap;
		border: 1px solid #333;
	}
	tbody tr {
		&:nth-of-type(2n) {
			background-color: #eee;
		}
		&:hover {
			background-color: #ccc;
		}
	}
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
table.edit {
	td {
		&:focus-within:not(:last-of-type) {
			box-shadow: inset 0 0 0 2px var(--primaryColor);
		}
	}
	.action {
		padding: 0;
		margin: 0 0.25em;
	}
}
</style>
