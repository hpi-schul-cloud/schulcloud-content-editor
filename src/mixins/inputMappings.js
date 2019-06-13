import TableCheckbox from "@/components/resourceManagement/index/EditTable/TableInputs/TableCheckbox";
import TableInput from "@/components/resourceManagement/index/EditTable/TableInputs/TableInput";
import TableTextarea from "@/components/resourceManagement/index/EditTable/TableInputs/TableTextarea";
import TableSelect from "@/components/resourceManagement/index/EditTable/TableInputs/TableSelect";
import TableTags from "@/components/resourceManagement/index/EditTable/TableInputs/TableTags";
import DateInput from "@/components/resourceManagement/index/EditTable/TableInputs/TableDate";

import { options as MimeTypeOptions } from "@/components/resourceManagement/edit/inputs/ContentMimetype";
import { options as CategoryOptions } from "@/components/resourceManagement/edit/inputs/ContentCategory";

export const resourceInputMapping = [
	{
		key: "title",
		component: TableInput,
		attributes: { type: "text" },
		wrapperAttributes: {
			style: "min-width: 200px",
		},
		type: String,
		required: true,
	},
	{ key: "tags", component: TableTags, attributes: {}, type: Array },
	{
		key: "mimeType",
		component: TableSelect,
		attributes: { options: MimeTypeOptions },
		type: String,
	},
	{
		key: "contentCategory",
		component: TableSelect,
		attributes: { options: CategoryOptions },
		wrapperAttributes: {
			style: "width: 150px",
		},
		type: String,
	},
	{
		key: "description",
		component: TableTextarea,
		attributes: {},
		type: String,
	},
	{
		key: "isPublished",
		component: TableCheckbox,
		attributes: { type: "checkbox" },
		wrapperAttributes: {
			class: "fit-content",
		},
		type: Boolean,
	},
	{
		key: "isProtected",
		component: TableCheckbox,
		attributes: { type: "checkbox" },
		wrapperAttributes: {
			class: "fit-content",
		},
		type: Boolean,
	},
	{
		key: "url",
		component: TableInput,
		attributes: { type: "url" },
		type: String,
		required: true,
	},
	{
		key: "thumbnail",
		component: TableInput,
		attributes: { type: "url" },
		type: String,
	},
	{
		key: "licenses",
		component: TableTags,
		attributes: {},
		wrapperAttributes: {
			style: "width: 150px",
		},
		type: Array,
	},
	{
		key: "createdAt",
		component: DateInput,
		attributes: { readonly: true },
		wrapperAttributes: {},
		type: String,
	},
	{
		key: "updatedAt",
		component: DateInput,
		attributes: { readonly: true },
		wrapperAttributes: {},
		type: String,
	},
];
