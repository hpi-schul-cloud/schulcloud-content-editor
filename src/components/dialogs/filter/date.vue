<template>
	<MdDialog :md-active.sync="isActive">
		<MdDialogTitle>{{ $lang.filter.createdAt.modal_title }}</MdDialogTitle>

		<div id="provider-picker">
			<MdDatepicker
				v-model="createdDateRange.from"
				:md-disabled-dates="disabledFromDates"
			>
				<label>{{ $lang.filter.createdAt.from }}</label>
			</MdDatepicker>

			<MdDatepicker
				v-model="createdDateRange.to"
				:md-disabled-dates="disabledToDates"
			>
				<label>{{ $lang.filter.createdAt.to }}</label>
			</MdDatepicker>
		</div>

		<MdDialogActions>
			<MdButton @click="onCancle">
				{{ $lang.buttons.cancel }}
			</MdButton>
			<MdButton class="md-primary" @click="onConfirm">
				{{ $lang.buttons.add }}
			</MdButton>
		</MdDialogActions>
	</MdDialog>
</template>

<script>
export default {
	name: "DialogConfirm",
	props: {
		identifier: {
			type: String,
			default: "",
		},
		active: {
			type: Boolean,
		},
	},
	data() {
		return {
			isActive: false,
			createdDateRange: {
				from: undefined,
				to: undefined,
			},
			apiQuery: {},
			urlQuery: {},
		};
	},
	computed: {
		firstDayOfAWeek: {
			get() {
				return 1;
			},
		},
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
		"createdDateRange.from": function() {
			this.orderDated();
		},
		"createdDateRange.to": function() {
			this.orderDated();
		},
	},
	created() {
		this.$parent.$on("reset", this.resetDates);
	},
	methods: {
		onConfirm() {
			let displayString;
			let fromString;
			let toString;

			if (this.createdDateRange.from || this.createdDateRange.to) {
				if (this.createdDateRange.from) {
					const from = new Date(this.createdDateRange.from);
					this.apiQuery["createdAt[$gte]"] = this.createdDateRange.from; // startDate
					this.urlQuery.createdAtFrom = this.createdDateRange.from;
					fromString = `${from.getDate()}.${from.getMonth() +
						1}.${from.getFullYear()}`;
				} else {
					delete this.apiQuery["createdAt[$gte]"];
					delete this.urlQuery.createdAtFrom;
					fromString = "∞";
				}
				if (this.createdDateRange.to) {
					const to = new Date(this.createdDateRange.to);
					this.apiQuery["createdAt[$lte]"] = this.createdDateRange.to; // endDate
					this.urlQuery.createdAtTo = this.createdDateRange.to;
					toString = `${to.getDate()}.${to.getMonth() + 1}.${to.getFullYear()}`;
				} else {
					delete this.apiQuery["createdAt[$gte]"];
					delete this.urlQuery.createdAtTo;
					toString = "∞";
				}

				displayString = `${fromString} - ${toString}`;
			} else {
				this.apiQuery = {};
				(displayString = null), (this.urlQuery = {});
			}
			this.$emit("set", this.identifier, {
				apiQuery: this.apiQuery,
				urlQuery: this.urlQuery,
				displayString,
			});
		},
		onCancle() {
			this.$emit("cancle");
		},
		resetDates(key) {
			if (key == this.identifier) {
				this.createdDateRange.from = undefined;
				this.createdDateRange.to = undefined;
			}
		},
		disabledFromDates: (date) => {
			const today = new Date();
			return today < date;

			// not working
			//const earlier = !((this.createdDateRange || {}).to && (this.createdDateRange.to) > date);
			//return (earlier && (today < date));
		},
		disabledToDates: (date) => {
			const today = new Date();
			return today < date;

			// not working
			//const later = !((this.createdDateRange || {}).from && (this.createdDateRange.from > date));
			//return (later && (today < date));
		},
		orderDated() {
			const a = this.createdDateRange.from;
			const b = this.createdDateRange.to;
			if (a && b) {
				this.createdDateRange.from = Math.min(a, b);
				this.createdDateRange.to = Math.max(a, b);
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
