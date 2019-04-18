<template>
	<EditTableRow v-bind="$attrs" v-on="$listeners">
		<div
			slot="editable"
			:class="{ disabled }"
			@click="disabled = !disabled"
		></div>
	</EditTableRow>
</template>

<script>
import EditTableRow from "./EditTableRow";

export default {
	components: {
		EditTableRow,
	},
	data() {
		return {
			disabled: true,
		};
	},
};
</script>

<style lang="scss" scoped>
.disabled {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #333a;
}
</style>
