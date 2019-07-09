<template>
	<div class="wrapper">
		<label>
			<span
				v-if="!hiddenLabel && label"
				:class="{ label: true, invalid: !!error }"
			>
				{{ label }}
			</span>
			<input
				v-bind="$attrs"
				:name="name"
				:type="type"
				:value="value"
				:placeholder="placeholder"
				@input="$emit('input', $event.target.value)"
				:aria-label="hiddenLabel ? label : undefined"
				class="input"
			/>
			<slot name="icon"></slot>
		</label>
		<span v-if="!!error" class="invalid">{{ error }}</span>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
		type: {
			type: String,
			default: "text",
		},
		label: {
			type: String,
			required: true,
		},
		hiddenLabel: {
			type: Boolean,
		},
		placeholder: {
			type: String,
			default: "",
		},
		error: {
			type: String,
			default: "",
		},
		name: {
			type: String,
			default: "",
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	position: relative;
	width: 100%;
	margin: 0.5rem 0 1rem;
}
.label {
	font-size: 0.9em;
	font-weight: 500;
	color: black;
}
.input {
	display: block;
	width: 100%;
	font-size: 1.15em;
	line-height: 32px;
	color: #333;
	background: rgba(255, 255, 255, 0);
	border: none;
	border-bottom: 1px solid #949494;
	::placeholder {
		color: #999;
	}
	&:focus {
		border-bottom-color: var(--primaryColor);
		border-bottom-width: 2px;
		outline: none;
	}
}
span {
	font-size: 0.75em;
}
.invalid {
	color: var(--primaryColor);
}
</style>
