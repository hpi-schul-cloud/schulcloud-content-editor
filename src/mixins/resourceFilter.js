import { inputs, layouts } from "vue-filter-ui";
import BaseSelect from "@/components/base/BaseSelect";
import BaseInput from "@/components/base/BaseInput";

const resourceAttributes = [
	"contentCategory",
	"description",
	"isPublished",
	"licenses",
	"mimeType",
	"providerName",
	"tags",
	"thumbnail",
	"title",
	"url",
	"createdAt",
	"updatedAt",
];

import { options as mimeTypes } from "@/components/resourceManagement/edit/inputs/ContentMimetype.vue";

export default {
	computed: {
		$_filterConfig() {
			const resourceOptions = resourceAttributes.map((attr) => {
				return { value: attr, label: this.$lang.resources[attr] };
			});
			const mimeTypeOptions = mimeTypes.map((m) => ({
				value: m.key,
				label: m.value,
			}));
			return [
				{
					title: "Einträge pro Seite",
					chipTemplate: "Einträge pro Seite: %1",
					required: true,
					filter: [
						{
							attribute: "$limit",
							operator: "=",
							input: inputs.Radio,
							options: [
								{ value: 10, label: "10" },
								{ value: 25, label: "25" },
								{ value: 50, label: "50" },
								{ value: 100, label: "100" },
								{ value: 250, label: "250" },
								{ value: 500, label: "500" },
							],
						},
					],
				},
				{
					title: "Sortieren",
					chipTemplate: ([attribute, order]) =>
						`Sortieren nach: ${
							resourceOptions.find((v) => v.value === attribute).label
						} ${order ? "↗" : "↘"}`,
					required: true,
					layout: layouts.Sort,
					filter: [
						{
							attribute: "$sort-attribute",
							operator: "=",
							input: BaseSelect,
							options: resourceOptions,
						},
						{
							attribute: "$sort-order",
							operator: "=",
							input: inputs.Toggle,
							options: [{ value: -1, label: "↘" }, { value: 1, label: "↗" }],
						},
					],
				},
				{
					title: "Feld enthält",
					chipTemplate: ([attribute, value]) =>
						`${this.$lang.resources[attribute]} enthält: ${value}`,
					parser: {
						generator: (filterGroupConfig, values) => {
							const configs = filterGroupConfig.filter;
							const query = {};
							query[`${values[configs[0].id]}[$match]`] = values[configs[1].id];
							return query;
						},
					},
					filter: [
						{
							attribute: "$contains-attribute",
							operator: "=",
							input: BaseSelect,
							options: resourceOptions,
						},
						{
							attribute: "$contains-value",
							operator: "=",
							input: BaseInput,
						},
					],
				},
				{
					title: "Veröffentlicht?",
					chipTemplate: ([isPublished]) =>
						isPublished ? "veröffentlicht" : "unveröffentlicht",
					parser: {
						generator: (filterGroupConfig, values) => {
							const configs = filterGroupConfig.filter;
							const value = values[configs[0].id];
							if (value === false) return { "isPublished[$ne]": true };
							if (value === true) {
								return { isPublished: true };
							}
							return {};
						},
					},
					filter: [
						{
							attribute: "isPublished",
							operator: "=",
							input: inputs.TriSwitch,
							options: [
								{ value: false, label: "false" },
								{ value: undefined, label: "undefined" },
								{ value: true, label: "true" },
							],
						},
					],
				},
				{
					title: "Datentyp",
					chipTemplate: "Datentyp: %1",
					filter: [
						{
							attribute: "mimeType",
							operator: "=",
							input: BaseSelect,
							options: mimeTypeOptions,
						},
					],
				},
			];
		},
	},
};
