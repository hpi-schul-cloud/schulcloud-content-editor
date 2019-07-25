<template>
	<div class="fab-position">
		<FabMain
			:config="cfg"
			:open="open"
			@click="handleMainClick(cfg)"
			@keypress.enter="handleMainClick(cfg)"
			class="fab-main"
		/>
		<div class="actions-container">
			<transition-group
				:css="false"
				@before-enter="beforeEnter"
				@enter="enter"
				@leave="leave"
				name="staggered-fade"
				tag="div"
			>
				<FabOption
					v-for="(option, index) in options"
					:key="option.icon"
					:config="option"
					@click="handleActionClick(option)"
					@keypress.enter="handleActionClick(option)"
					@keydown.tab="closeOnLastTab(option, index)"
					:tabindex="options.length ? '0' : '-1'"
					class="action"
				/>
			</transition-group>
		</div>
	</div>
</template>

<script>
import FabMain from "./FabMain";
import FabOption from "./FabOption";

import Velocity from "velocity-animate";

export default {
	components: { FabMain, FabOption },
	props: {
		config: {
			type: Object,
			required: true,
		},
		isOpen: {
			type: Boolean,
		},
	},
	data() {
		return {
			open: false,
		};
	},
	computed: {
		cfg() {
			return Object.assign({ icon: "add" }, this.config);
		},
		options() {
			return this.open ? this.cfg.options : [];
		},
	},
	watch: {
		isOpen: function(to) {
			if (to !== this.open) {
				this.open = to;
			}
		},
		open: function(to) {
			this.$emit("update:isOpen", to);
		},
	},
	methods: {
		closeOnLastTab(option, index) {
			if (index === this.options.length - 1) {
				this.open = false;
			}
		},
		handleMainClick(targetConfig) {
			if (!this.cfg.options || this.cfg.options.length !== 0) {
				this.open = !this.open;
			} else {
				this.$emit(targetConfig.event, targetConfig.payload);
			}
		},
		handleActionClick(targetConfig) {
			this.open = false;
			this.$emit(targetConfig.event, targetConfig.payload);
		},
		beforeEnter: function(el) {
			el.style.opacity = 0;
			el.style.height = 0;
		},
		enter: function(el, done) {
			var delay = el.dataset.index * 150;
			setTimeout(function() {
				Velocity(el, { opacity: 1, height: "40px" }, { complete: done });
			}, delay);
		},
		leave: function(el, done) {
			var delay = el.dataset.index * 150;
			setTimeout(function() {
				Velocity(el, { opacity: 0, height: 0 }, { complete: done });
			}, delay);
		},
	},
};
</script>

<style lang="scss" scoped>
.fab-position {
	position: fixed;
	right: 5rem;
	bottom: 2.5rem;
	z-index: 10;
}
.fab-main {
	z-index: 2;
}
.actions-container {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
}

.staggered-transition {
	opacity: 1;
	transition: all 0.5s ease;
}
.staggered-enter,
.staggered-leave {
	opacity: 0;
}
</style>
