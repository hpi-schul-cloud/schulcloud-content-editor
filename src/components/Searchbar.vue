<template>
	<BaseInput v-bind="$attrs" v-on="$listeners" class="searchbar" />
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
