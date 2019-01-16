<template>
  <MdDialog :md-active.sync="isActive">
    <MdDialogTitle>{{ $lang.filter.provider.modal_title }}</MdDialogTitle>

    <div id="provider-picker">
      <MdField>
        <label for="selectedProviders">
          {{ $lang.filter.provider.placeholder }}
        </label>
        <MdSelect
          id="selectedProviders"
          v-model="selectedProviders"
          md-dense
        >
          <!-- multiple> -->
          <MdOption value="">
            kein Provider
          </MdOption>
          <MdOption value="Khan Academy">
            Khan Academy
          </MdOption>
          <MdOption value="Serlo">
            Serlo
          </MdOption>
          <MdOption value="Youtube">
            Youtube
          </MdOption>
          <MdOption value="LEIFI Physik">
            LEIFI Physik
          </MdOption>
        </MdSelect>
      </MdField>
    </div>

    <MdDialogActions>
      <MdButton @click="onCancle">
        {{ $lang.buttons.cancel }}
      </MdButton>
      <MdButton
        class="md-primary"
        @click="onConfirm"
      >
        {{ $lang.buttons.add }}
      </MdButton>
    </MdDialogActions>
  </MdDialog>
</template>

<script>
export default {
	name: 'DialogConfirm',
	props: {
		identifier: {
			type: String,
			default: ""
		},
		active: {
			type: Boolean
		}
	},
	data() {
		return {
			isActive: false,
			selectedProviders: '', // []
			apiQuery: {},
			urlQuery: {},
		};
	},
	watch: {
		active(to) {
			this.isActive = to;
		},
		isActive(to) {
			if (to == false) {
				this.onCancle();
			}
		},
	},
	created() {
		this.$parent.$on('reset', this.resetProviders);
	},
	methods: {
		onConfirm() {
			let displayString;

			if (this.selectedProviders.length != 0) {
				// this.apiQuery["providerName[$in]"] = this.selectedProviders; // corret but api seems broken
				this.apiQuery['providerName[$match]'] = this.selectedProviders;
				this.urlQuery = {provider: this.selectedProviders}; // .reduce((prev, curr) => prev +','+ curr )}
				displayString = `Provider: ${this.selectedProviders}`; // .reduce((prev, curr) => prev +', '+ curr );
			} else {
				this.apiQuery = {};
				this.urlQuery = {};
				displayString = null;
			}
			this.$emit('set', this.identifier, {
				apiQuery: this.apiQuery,
				urlQuery: this.urlQuery,
				displayString,
			});
		},
		onCancle() {
			this.$emit('cancle');
		},
		resetProviders(key) {
			if (key == this.identifier) {
				this.selectedProviders = '';
			}
		},
	},
};
</script>

<style lang="scss" scoped>
  #provider-picker {
    padding: 16px;
  }
</style>
