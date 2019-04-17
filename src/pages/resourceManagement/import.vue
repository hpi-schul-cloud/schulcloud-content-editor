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
			<MetadataMapping
				v-model="metadataFieldMapping"
				:csv-headers="csv.headers"
			/>
		</div>
		<div v-if="progressbarCurrentStep === 2" class="content">
			<h3>Vorschau</h3>
			<PreviewTable
				:header-fields="previewTableHeader"
				:content="clippedContentRows"
				:clipped="clipped"
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
				@click="handleNextStep"
			>
				{{ buttonText }}
			</BaseButton>
		</div>
	</div>
</template>
<script>
import StepProgress from "@/components/StepProgress";
import CsvUpload from "@/components/resourceManagement/import/CsvUpload";
import MetadataMapping from "@/components/resourceManagement/import/MappingMetadata";
import PreviewTable from "@/components/resourceManagement/import/PreviewTable";
import BaseButton from "@/components/base/BaseButton";
import BaseCheckbox from "@/components/base/BaseCheckbox";

import api from "@/mixins/api.js";

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
	mixins: [api],
	data() {
		return {
			progressbarSteps: [
				{ name: "Datei hochladen" },
				{ name: "Metadaten zuordnen" },
				{ name: "Importieren" },
			],
			progressbarCurrentStep: 0,
			csv: {
				headers: [],
				content: [],
				fileName: "",
			},
			metadataFieldMapping: {
				title: "",
				description: "",
				licenses: "",
				contentCategory: "",
				mimeType: "",
				tags: "",
				url: "",
				thumbnail: "",
			},
			disabledOptions: [],
			isPublished: false,
			maxRows: 5,
		};
	},
	computed: {
		buttonText: function() {
			if (this.progressbarCurrentStep === 2) return "Importieren";
			else return "Nächster Schritt";
		},
		previewTableHeader() {
			let header = Object.keys(this.metadataFieldMapping);
			return header;
		},
		importedResources: function() {
			let newData = [];
			this.csv.content.forEach((row, index) => {
				let resource = {
					title: "Test",
					description: "Testbeschreibung",
					licenses: [],
					contentCategory: "atomic",
					mimeType: "image",
					tags: [],
					url: "https://schul-cloud.org/",
					thumbnail: "",
					providerName: "TestProvider",
					userId: "0000d231816abba584714c9e",
					originId: Date.now().toString() + index,
				};
				Object.entries(this.metadataFieldMapping).forEach(([key, value]) => {
					if (key === "tags" || key === "licenses") {
						if (row[value]) {
							resource[key] = row[value].split(",").map((each) => each.trim());
						}
					} else {
						if (row[value]) {
							resource[key] = row[value];
						}
					}
				});
				resource.contentCategory = "atomic";

				newData.push(resource);
			});
			return newData;
		},
		clipped: function() {
			return this.importedResources.length > this.maxRows;
		},
		clippedContentRows: function() {
			return this.importedResources.slice(0, this.maxRows);
		},
	},
	methods: {
		handleNextStep() {
			if (this.progressbarCurrentStep < 2) {
				this.incrementCurrentStep();
			} else this.importCSV();
		},
		incrementCurrentStep() {
			this.progressbarCurrentStep = this.progressbarCurrentStep + 1;
		},
		importCSV() {
			let newData = this.importedResources;

			return this.$_resourceCreate(newData)
				.then((error) => {
					this.$toasted.show(`Saved`);
				})
				.catch((error) => {
					this.$toasted.error(`Failed to save`);
				});
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
