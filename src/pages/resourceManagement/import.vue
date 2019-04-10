<template>
	<div>
		<h2>CSV-Import</h2>
		<StepProgress
			:steps="progressbarSteps"
			:current-step="progressbarCurrentStep"
		/>
		<div v-if="progressbarCurrentStep === 0" class="dropzone content">
			<Dropzone>Lade hier deine CSV-Datei hoch</Dropzone>
		</div>
		<template v-if="progressbarCurrentStep === 1" class="content">
			<p>Metadaten</p>
		</template>
		<template v-if="progressbarCurrentStep === 2" class="content">
			<p>Import</p>
		</template>
		<div class="button-wrapper">
			<BaseButton styling="primary" @click="incrementCurrentStep">
				Nächster Schritt
			</BaseButton>
		</div>
	</div>
</template>
<script>
import stepProgress from "@/components/stepProgress.vue";
import dropzone from "@/components/dropzone.vue";
import BaseButton from "@/components/base/BaseButton.vue";

export default {
	name: "CsvImport",
	components: {
		stepProgress,
		dropzone,
		BaseButton,
	},
	data() {
		return {
			progressbarSteps: [
				{ name: "Datei hochladen" },
				{ name: "Metadaten anpassen" },
				{ name: "Veröffentlichen" },
			],
			progressbarCurrentStep: 0,
		};
	},
	methods: {
		incrementCurrentStep() {
			if (this.progressbarCurrentStep < 2) {
				this.progressbarCurrentStep = this.progressbarCurrentStep + 1;
			} else this.progressbarCurrentStep = 0;
		},
	},
};
</script>
<style lang="scss" scoped>
.content {
	max-width: 800px;
	margin: 8em auto 1em;
}
.button-wrapper {
	display: flex;
	justify-content: center;
}
</style>
