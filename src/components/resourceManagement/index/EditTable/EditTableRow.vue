<template>
	<tr>
		<td style="text-align: right;">{{ rowName }}</td>
		<td
			v-for="(coloumn, coloumnIndex) in visibleColoumns"
			:key="coloumn"
			v-bind="getComponent(coloumn).wrapperAttributes"
		>
			<form
				v-if="coloumnIndex === 0"
				:id="formId"
				@submit.prevent="handleFormSubmit(resource)"
			></form>
			<component
				:is="getComponent(coloumn).component"
				v-model="resource[coloumn]"
				:form="formId"
				:label="coloumn"
				:name="coloumn"
				v-bind="getComponent(coloumn).attributes"
			/>
		</td>
		<td style="text-align: center;">
			<BaseButton type="submit" :form="formId" class="action">
				<i class="material-icons">
					check
				</i>
			</BaseButton>
			<RouterLink
				v-if="resource._id"
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
</template>

<script>
import BaseButton from "@/components/base/BaseButton";
import TableCheckbox from "./TableCheckbox";
import TableInput from "./TableInput";
import TableTextarea from "./TableTextarea";
import TableSelect from "./TableSelect";
import TableTags from "./TableTags";

import { options as MimeTypeOptions } from "@/components/resourceManagement/edit/inputs/ContentMimetype";
import { options as CategoryOptions } from "@/components/resourceManagement/edit/inputs/ContentCategory";

export const keyInputMapping = [
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
	},
	props: {
		resource: {
			type: Object,
			required: true,
		},
		rowName: {
			type: [Number, String],
			default: 0,
		},
		visibleColoumns: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		formId() {
			return `table-form-${this.rowName}`;
		},
	},
	methods: {
		getComponent(key) {
			return keyInputMapping.find((coloumn) => coloumn.key === key);
		},
		handleFormSubmit(resource) {
			this.$emit("submit", resource);
		},
	},
};
</script>

<style lang="scss" scoped>
td {
	padding: 0 4px;
	overflow: hidden;
	overflow-x: auto;
	white-space: nowrap;
	border: 1px solid #333;
	&:focus-within:not(:last-of-type) {
		box-shadow: inset 0 0 0 2px var(--primaryColor);
	}
}
.fit-content {
	width: 1px;
	white-space: nowrap;
}
.action {
	padding: 0;
	margin: 0 0.25em;
}
</style>
