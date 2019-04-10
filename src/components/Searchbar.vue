<template>
	<BaseInput class="searchbar" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import BaseInput from "@/components/base/BaseInput.vue";
export default {
	components: {
		BaseInput,
	},
};
</script>

<style lang="scss" scoped>
.searchbar {
	max-width: 500px;
	padding: 0 1rem;
}
</style>
