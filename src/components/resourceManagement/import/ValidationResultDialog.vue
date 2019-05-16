<template>
	<BaseConfirm
		:active="active"
		@confirm="onConfirm"
		@update:active="$emit('update:active', $event)"
		confirm-text="Verstanden"
	>
		<template slot="title">
			Hinweis
			<i class="material-icons">feedback</i>
		</template>
		<template>
			<p v-if="valid" class="infotext">
				Ihre Inhalten sind valide und vollständig, daher können sie
				veröffentlicht werden.
			</p>
			<template v-else>
				<p class="infotext">
					Ihre Inhalte können nur veröffentlicht werden, wenn sie vollständig
					und valide sind. Folgende Spalten sind dies nicht:
				</p>
				<table>
					<tr>
						<th>Spalte</th>
						<th>Validierungs Fehler</th>
					</tr>
					<tr v-for="(value, key) in validationResults" :key="key">
						<td>{{ key }}</td>
						<td>
							<p
								v-for="(errorMessage, index) in value"
								:key="index"
								class="tabletext"
							>
								{{ errorMessage }}
							</p>
						</td>
					</tr>
				</table>

				<p class="infotext">
					Sie können ihre Inhalte dennoch importieren, sie werden dann als
					"nicht-öffentlich" gespeichert. Im nächsten Schritt haben Sie dann die
					Möglichkeit, zu einer gefilterten Ansicht der Verwaltungstabelle
					umgeleitet zu werden. Dort können Sie ihre importierten, nicht
					veröffentlichten Inhalte vervollständigen und anschließend
					veröffentlichen.
				</p>
			</template>
		</template>
	</BaseConfirm>
</template>
<script>
import BaseConfirm from "@/components/base/BaseConfirm";

export default {
	components: {
		BaseConfirm,
	},
	props: {
		validationResults: {
			type: Object,
			required: true,
		},
		active: {
			type: Boolean,
		},
	},
	computed: {
		valid: function() {
			return Object.keys(this.validationResults).length === 0;
		},
	},
	methods: {
		onConfirm() {
			this.$emit("confirm");
		},
	},
};
</script>
<style lang="scss" scoped>
table,
th,
td {
	text-align: left;
	border-collapse: collapse;
	border: 1px solid black;
	border-right: none;
	border-left: none;
}

th,
td {
	padding: 8px;
}

table {
	width: 100%;
}
.infotext {
	margin: 1.3em 0;
}
.tabletext {
	margin: 0;
}
</style>
