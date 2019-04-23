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
					v-model="resourceInput[coloumn]"
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
			<BaseButton
				type="button"
				class="action"
				@click="$emit('submit', resource)"
			>
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

const constructors = {};
keyInputMapping.forEach((e) => {
	constructors[e.key] = e.type;
});

const getActiveObj = () => {
	const obj = {};
	keyInputMapping.forEach((e) => {
		obj[e.key] = false;
	});
	return obj;
};

const getResourceObj = () => {
	const obj = {};
	keyInputMapping.forEach((e) => {
		obj[e.key] = e.type();
	});
	return obj;
};

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
			oldResourceInput: getResourceObj(),
			resourceInput: getResourceObj(),
			oldActive: getActiveObj(),
			active: getActiveObj(),
		};
	},
	watch: {
		visibleColoumns: function(to) {
			Object.keys(constructors).forEach((key) => {
				if (!this.visibleColoumns.includes(key)) {
					this.resource[key] = undefined;
				}
			});
		},
		resourceInput: {
			handler(to) {
				this.getObjDiffs(to, this.oldResourceInput).forEach(([key, value]) => {
					if (this.isDefined(value)) {
						this.active[key] = true;
						this.resource[key] = value;
					} else {
						this.active[key] = false;
					}
					this.oldResourceInput[key] = this.deepCopy(value);
				});
			},
			deep: true,
		},
		active: {
			handler(to) {
				this.getObjDiffs(to, this.oldActive).forEach(([key, isActive]) => {
					const value = this.isDefined(this.resourceInput[key])
						? this.resourceInput[key]
						: constructors[key]();
					this.resource[key] = isActive ? value : undefined;
					this.oldActive[key] = this.deepCopy(isActive);
				});
			},
			deep: true,
		},
	},
	methods: {
		getComponent(key) {
			return keyInputMapping.find((coloumn) => coloumn.key === key);
		},
		getObjDiffs(objA, objB) {
			return Object.entries(objA).filter(
				([key, val]) => JSON.stringify(val) !== JSON.stringify(objB[key])
			);
		},
		isDefined(val) {
			return (
				typeof val === "boolean" ||
				((typeof val === "string" || Array.isArray(val)) && val.length > 0)
			);
		},
		deepCopy(obj) {
			return typeof obj === "object" ? JSON.parse(JSON.stringify(obj)) : obj;
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
	&:focus-within,
	&:hover {
		opacity: 1;
	}
}
</style>
