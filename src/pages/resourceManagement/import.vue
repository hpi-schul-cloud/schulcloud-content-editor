<template>
	<div>
		<h2>CSV-Import</h2>
		<StepProgress
			:steps="progressbarSteps"
			:current-step="progressbarCurrentStep"
		/>
		<div v-if="progressbarCurrentStep === 0" class="dropzone content">
			<CsvUpload v-model="csv" />
		</div>
		<div v-if="progressbarCurrentStep === 1" class="content">
			<MetadataMapping v-model="metadataFieldMapping" :options="getOptions" />
		</div>
		<div v-if="progressbarCurrentStep === 2" class="content">
			<PreviewTable
				:header-fields="getPreviewTableHeader"
				:content="getPreviewTableContent"
			/>
			<div class="flex">
				<h4 class="subtitle">Inhalte veröffentlichen?</h4>
				<BaseCheckbox v-model="isPublished" label="published"></BaseCheckbox>
			</div>
		</div>
		<div class="button-wrapper">
			<BaseButton
				styling="primary"
				:disabled="csv.content.length === 0"
				@click="incrementCurrentStep"
			>
				Nächster Schritt
			</BaseButton>
		</div>
	</div>
</template>
<script>
import StepProgress from "@/components/StepProgress.vue";
import CsvUpload from "@/components/import/CSV_upload.vue";
import MetadataMapping from "@/components/import/MappingMetadata.vue";
import PreviewTable from "@/components/import/PreviewTable.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";

export default {
	name: "CsvImport",
	components: {
		StepProgress,
		CsvUpload,
		MetadataMapping,
		PreviewTable,
		BaseButton,
		BaseCheckbox,
	},
	data() {
		return {
			progressbarSteps: [
				{ name: "Datei hochladen" },
				{ name: "Metadaten zuordnen" },
				{ name: "Importieren" },
			],
			progressbarCurrentStep: 0,
			csv: {
				content: [],
				headers: [],
				fileName: "",
			},
			metadataFieldMapping: {
				Titel: "",
				Beschreibung: "",
				Lizenz: "",
				Kategorie: "",
				"MIME-type": "",
				Tags: "",
				URL: "",
				"Thumbnail-URL": "",
			},
			disabledOptions: [],
			isPublished: false,
		};
	},
	computed: {
		getOptions: function() {
			let options = [{ key: "none", value: "kein Match" }];

			this.csv.headers.forEach((headerField) => {
				let obj = {};
				obj.key = headerField;
				obj.value = headerField;
				options.push(obj);
			});

			return options;
		},
		getPreviewTableHeader() {
			let header = Object.keys(this.metadataFieldMapping);
			return header;
		},
		getPreviewTableContent() {
			let content = [];
			this.csv.content.forEach((row) => {
				let rowContent = [];
				Object.values(this.metadataFieldMapping).forEach((metadata) => {
					if (row[metadata]) {
						rowContent.push(row[metadata]);
					} else rowContent.push("");
				});
				content.push(rowContent);
			});
			return content;
		},
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
	margin: 8em auto 1em;
}
.dropzone {
	max-width: 800px;
}
.button-wrapper {
	display: flex;
	justify-content: center;
}
.flex {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.subtitle {
	margin-bottom: 0;
}
</style>
