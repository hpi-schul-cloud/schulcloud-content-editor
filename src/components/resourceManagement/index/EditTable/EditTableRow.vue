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
			<!-- eslint-disable-next-line vue/require-component-is -->
			<component
				:is="getComponent(coloumn).component"
				v-model="resource[coloumn]"
				:form="formId"
				:label="coloumn"
				:name="coloumn"
				v-bind="getComponent(coloumn).attributes"
			/>
		</td>
		<td style="text-align: right;">
			<BaseButton :form="formId" type="submit" class="action">
				<i class="material-icons">
					check
				</i>
			</BaseButton>
			<RouterLink
				v-if="resource._id"
				:to="{
					name: 'resourceManagement/edit',
					params: { id: resource._id },
				}"
				class="action"
			>
				<i class="material-icons">
					edit
				</i>
			</RouterLink>
			<BaseButton @click="$emit('delete', resource)" class="action">
				<i class="material-icons">
					delete
				</i>
			</BaseButton>
		</td>
	</tr>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";

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
		keyInputMapping: {
			type: Array,
			required: true,
		},
	},
	computed: {
		formId() {
			return `table-form-${this.rowName}`;
		},
	},
	methods: {
		getComponent(key) {
			return this.keyInputMapping.find((coloumn) => coloumn.key === key);
		},
		handleFormSubmit(resource) {
			this.$emit("submit", resource);
		},
	},
};
</script>

<style lang="scss" scoped>
td {
	position: relative;
	max-width: 300px;
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
