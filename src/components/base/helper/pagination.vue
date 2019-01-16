<template>
  <div class="pagination">
    <MdButton
      v-if="config.page == 1"
      class="md-icon-button md-raised"
      disabled
    >
      <MdIcon>arrow_back</MdIcon>
    </MdButton>
    <MdButton
      v-else
      class="md-icon-button md-raised"
      @click="config.page -= 1"
    >
      <MdIcon>arrow_back</MdIcon>
    </MdButton>

    <MdButton
      id="pageNumber"
      class="md-button md-primary md-raised"
    >
      <input
        v-model.lazy="pageString"
        type="number"
        min="1"
        :max="maxPages"
      >
    </MdButton>

    <MdButton
      v-if="config.page == maxPages"
      class="md-icon-button md-raised"
      disabled
    >
      <MdIcon>arrow_forward</MdIcon>
    </MdButton>
    <MdButton
      v-else
      class="md-icon-button md-raised"
      @click="config.page += 1"
    >
      <MdIcon>arrow_forward</MdIcon>
    </MdButton>
  </div>
</template>

<script>
export default {
	name: 'Pagination',
	props: {
		config: {
			type: Object,
			required: true
		},
	},
	data() {
		return {
			pageString: '1', // needed to display current page (only strings allowed for v-model)
			maxPages: '1',
		};
	},
	watch: {
		'config.totalEntrys': function () {
			this.calcMaxPages();
		},
		'config.itemsPerPage': function () {
			this.calcMaxPages();
		},
		'config.page': function () {
			if (this.config.scroll) {
				window.scroll(this.config.scroll);
			}
			this.pageString = this.config.page.toString();
			this.$emit('pageChanged', this.config.page);
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
			this.maxPages = (Math.ceil(this.config.totalEntrys / this.config.itemsPerPage) || 1).toString();
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
    margin-top: 2rem;
    display: block;
    width: 100%;
    text-align: center
  }

  #pageNumber {
    height: 40px;
    padding: 0;
    margin: 0;
    input {
      font-size: 1.2em;
      font-weight: bold;
      line-height: 1em;
      padding: 0;
      margin: 0;
      outline: none;
      background: transparent;
      border: none;
      text-align: center;
      max-width: 88px;
      height: 40px;
      width: 100%;
      color: inherit;
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
      }
    }
    &.md-toggle {
      background: rgba(0, 0, 0, 0.1)
    }
  }
</style>
