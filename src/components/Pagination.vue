<template>
	<div class="pagination">
		<BaseButton
			styling="secondary"
			:disabled="config.page == 1"
			:raised="config.page != 1"
			:round-shape="true"
			class="pagination-button"
			@click="config.page -= 1"
		>
			<i class="material-icons">arrow_back</i>
		</BaseButton>

		<BaseButton id="page-number" styling="primary" :raised="true">
			<input v-model.lazy="pageString" type="number" min="1" :max="maxPages" />
		</BaseButton>

		<BaseButton
			styling="secondary"
			:disabled="config.page == maxPages"
			:raised="config.page != maxPages"
			:round-shape="true"
			class="pagination-button"
			@click="config.page += 1"
		>
			<i class="material-icons">arrow_forward</i>
		</BaseButton>
	</div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";

export default {
	name: "Pagination",
	components: {
		BaseButton,
	},
	props: {
		config: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			pageString: "1", // needed to display current page (only strings allowed for v-model)
			maxPages: "1",
		};
	},
	watch: {
		"config.totalEntrys": function() {
			this.calcMaxPages();
		},
		"config.itemsPerPage": function() {
			this.calcMaxPages();
		},
		"config.page": function() {
			if (this.config.scroll) {
				window.scroll(this.config.scroll);
			}
			this.pageString = this.config.page.toString();
			this.$emit("pageChanged", this.config.page);
		},
		pageString(to) {
			if (to) {
				this.config.page = Number.parseInt(this.pageString);
			}
		},
	},
	created() {
		this.pageString = this.config.page.toString();
		this.calcMaxPages();
	},
	methods: {
		calcMaxPages() {
			this.maxPages = (
				Math.ceil(this.config.totalEntrys / this.config.itemsPerPage) || 1
			).toString();
		},
	},
};
</script>

<style lang="scss" scoped>
.pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-top: 2rem;

	.pagination-button {
		font-size: 0;
		line-height: 0;
	}
}
[disabled] {
	visibility: hidden;
}
#page-number {
	height: 40px;
	padding: 0;
	margin: 0;
	input {
		width: 100%;
		max-width: 88px;
		height: 40px;
		padding: 0;
		margin: 0;
		font-size: 1.2em;
		font-weight: bold;
		line-height: 1em;
		color: inherit;
		text-align: center;
		background: transparent;
		border: none;
		outline: none;
		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			margin: 0;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
		}
	}
}
</style>
