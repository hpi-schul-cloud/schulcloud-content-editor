<template>
	<div class="pagination">
		<MdButton v-if="config.page == 1" class="md-icon-button md-raised" disabled>
			<MdIcon>arrow_back</MdIcon>
		</MdButton>
		<MdButton v-else class="md-icon-button md-raised" @click="config.page -= 1">
			<MdIcon>arrow_back</MdIcon>
		</MdButton>

		<MdButton id="pageNumber" class="md-button md-primary md-raised">
			<input v-model.lazy="pageString" type="number" min="1" :max="maxPages" />
		</MdButton>

		<MdButton
			v-if="config.page == maxPages"
			class="md-icon-button md-raised"
			disabled
		>
			<MdIcon>arrow_forward</MdIcon>
		</MdButton>
		<MdButton v-else class="md-icon-button md-raised" @click="config.page += 1">
			<MdIcon>arrow_forward</MdIcon>
		</MdButton>
	</div>
</template>

<script>
export default {
	name: "Pagination",
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

.paginationWrapper {
	width: 100%;
}

.pagination {
	display: block;
	width: 100%;
	margin-top: 2rem;
	text-align: center;
}

#pageNumber {
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
