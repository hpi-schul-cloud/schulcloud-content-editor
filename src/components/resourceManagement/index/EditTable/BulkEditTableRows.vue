<template>
	<tr>
		<td style="text-align: right;">{{ rowName }}</td>
		<td
			v-for="coloumn in visibleColoumns"
			:key="coloumn"
			v-bind="getComponent(coloumn).wrapperAttributes"
		>
			<div class="table-cell">
				<component
					:is="getComponent(coloumn).component"
					v-model="resource[coloumn]"
					:label="coloumn"
					:name="coloumn"
					v-bind="getComponent(coloumn).attributes"
					:class="{ input: true, invisible: !active[coloumn] }"
				/>
				<input
					v-model="active[coloumn]"
					class="active-toggle"
					type="checkbox"
				/>
			</div>
		</td>
		<td style="text-align: right;">
			<BaseButton type="button" class="action">
				<i class="material-icons">
					check
				</i>
			</BaseButton>
		</td>
	</tr>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";
import EditTableRow, { keyInputMapping } from "./EditTableRow";

const activeObj = {};
const oldResourceObj = {};
keyInputMapping.forEach((e) => {
	oldResourceObj[e.key] = null;
	activeObj[e.key] = false;
});

export default {
	components: {
		BaseButton,
		EditTableRow,
	},
	props: {
		resource: {
			type: Object,
			required: true,
		},
		rowName: {
			type: [Number, String],
			default: 0,
		},
		visibleColoumns: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			disabled: true,
			oldResource: {},
			active: activeObj,
			oldActive: {},
		};
	},
	watch: {
		resource: {
			handler(to) {
				const from = this.oldResource;
				Object.entries(to).forEach(([key, value]) => {
					const before = from[key];
					const after = value;
					const isActive = this.active[key];

					if (after || after === false) {
						this.active[key] = true;
						this.oldResource[key] = value;
					} else if (
						before !== undefined &&
						isActive &&
						!after &&
						after !== false
					) {
						this.resource[key] = undefined;
						this.active[key] = false;
						this.oldResource[key] = value;
					}
				});
			},
			deep: true,
		},
		active: {
			handler(to) {
				const from = this.oldActive;
				Object.entries(to).forEach(([key, value]) => {
					const before = from[key];
					const after = value;
					if (before !== after) {
						if (after && this.resource[key] === undefined) {
							const restoredVal = this.oldResource[key];
							if (!restoredVal && restoredVal !== false) {
								restoredVal = "";
							}
							this.oldResource[key] = undefined;
							this.resource[key] = restoredVal;
						} else if (!after) {
							this.resource[key] = undefined;
						}
						this.oldActive[key] = value;
					}
				});
			},
			deep: true,
		},
	},
	methods: {
		getComponent(key) {
			return keyInputMapping.find((coloumn) => coloumn.key === key);
		},
	},
};
</script>

<style lang="scss" scoped>
td {
	position: relative;
	padding: 0 4px;
	overflow: hidden;
	overflow-x: auto;
	white-space: nowrap;
	border: 1px solid #333;
	&:focus-within:not(:last-of-type) {
		box-shadow: inset 0 0 0 2px var(--primaryColor);
	}
}
.fit-content {
	width: 1px;
	white-space: nowrap;
}
.action {
	padding: 0;
	margin: 0 0.25em;
}
.table-cell {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	.input {
		flex: 1;
	}
	.active-toggle {
		margin: 0;
	}
}
.invisible {
	opacity: 0;
	&:focus,
	&:hover {
		opacity: 1;
	}
}
</style>
