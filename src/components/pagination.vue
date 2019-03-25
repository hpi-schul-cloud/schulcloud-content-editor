<template>
	<div class="pagination">
		<BaseButton v-if="config.page == 1" :disabled="true" :round_shape="true">
			<img src="@/assets/icon-arrow_back.svg" />
		</BaseButton>
		<BaseButton
			v-else
			:secondary="true"
			:raised="true"
			:round_shape="true"
			@ButtonClicked="config.page -= 1"
		>
			<img src="@/assets/icon-arrow_back.svg" />
		</BaseButton>

		<BaseButton id="page-number" :primary="true" :raised="true">
			<input v-model.lazy="pageString" type="number" min="1" :max="maxPages" />
		</BaseButton>

		<BaseButton
			v-if="config.page == maxPages"
			:disabled="true"
			:round_shape="true"
		>
			<img src="@/assets/icon-arrow_forward.svg" />
		</BaseButton>
		<BaseButton
			v-else
			:secondary="true"
			:raised="true"
			:round_shape="true"
			@ButtonClicked="config.page += 1"
		>
			<img src="@/assets/icon-arrow_forward.svg" />
		</BaseButton>
	</div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.md-button {
	margin: 0 8px;
}

.pagination {
	display: block;
	width: 100%;
	margin-top: 2rem;
	text-align: center;
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
	&.md-toggle {
		background: rgba(0, 0, 0, 0.1);
	}
}
</style>
