<template>
	<BaseInput
		v-bind="$attrs"
		v-on="$listeners"
		:hidden-label="true"
		class="searchbar"
		label="Suche nach Inhalten"
	/>
</template>

<script>
import BaseInput from "@/components/base/BaseInput";
export default {
	components: {
		BaseInput,
	},
};
</script>

<style lang="scss" scoped>
.searchbar {
	max-width: 500px;
}
</style>
