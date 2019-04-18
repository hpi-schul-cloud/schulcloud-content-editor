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
				<p>
					<b>! Hinweis:</b>
					Nur vollständige Inhalte können veröffentlicht werden. Sollten Sie
					einige Felder im vorherigen Schritt nicht zuordnen können, werden ihre
					Inhalte als nicht veröffentlicht gespeichert und Sie werden
					automatisch zu einer gefilterten Ansicht der Verwaltungstabelle
					umgeleitet. Dort können Sie ihre importierten, nicht veröffentlichten
					Inhalte vervollständigen und anschließend veröffentlichen.
				</p>
			</div>
		</div>
		<div v-if="progressbarCurrentStep === 3" class="content">
			<LoadingBooks v-if="publishedResourcesCount === undefined" />
			<div v-else style="text-align: center">
				{{ publishedResourcesCount }} / {{ importedResources.length }} Inhalte
				konnten veröffentlicht werden.
			</div>
		</div>
		<div class="button-wrapper">
			<BaseButton
				v-if="progressbarCurrentStep != 0"
				styling="secondary"
				@click="handleBackStep"
			>
				Zurück
			</BaseButton>
			<BaseButton
				styling="primary"
				:disabled="csv.content.length === 0"
				@click="handleNextStep"
			>
				{{ forwardButtonText }}
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
import LoadingBooks from "@/components/LoadingBooks";

import api from "@/mixins/api.js";

export default {
	components: {
		StepProgress,
		CsvUpload,
		MetadataMapping,
		PreviewTable,
		BaseButton,
		BaseCheckbox,
		LoadingBooks,
	},
	mixins: [api],
	data() {
		return {
			progressbarSteps: [
				{ name: "Datei hochladen" },
				{ name: "Metadaten zuordnen" },
				{ name: "Importieren" },
				{ name: "Fertig" },
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
			publishedResourcesCount: undefined,
		};
	},
	computed: {
		forwardButtonText: function() {
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
					title: "IMPORT" + Date.now().toString() + index,
					url: "https://schul-cloud.org/",
					providerName: "TestProvider",
					userId: "0000d231816abba584714c9e",
					originId: Date.now().toString() + index,
					isPublished: this.isPublished,
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
			if (this.progressbarCurrentStep === 2) {
				this.importCSV();
			} else this.incrementCurrentStep();
		},
		handleBackStep() {
			if (this.progressbarCurrentStep > 0) {
				this.decrementCurrentStep();
			}
		},
		incrementCurrentStep() {
			this.progressbarCurrentStep = this.progressbarCurrentStep + 1;
		},
		decrementCurrentStep() {
			this.progressbarCurrentStep = this.progressbarCurrentStep - 1;
		},
		importCSV() {
			let newData = this.importedResources;
			this.incrementCurrentStep();

			return this.$_resourceCreate(newData)
				.then((response) => {
					if (response.code < 200 && response.code >= 300) {
						throw new Error(response.message);
					}
					this.$toasted.show(`Saved`);
					this.countPublishedResources(response);
				})
				.catch((error) => {
					this.$toasted.error(`Failed to save`);
				});
		},
		countPublishedResources(array) {
			let published = array.filter((resource) => {
				return resource.isPublished === true;
			});
			this.publishedResourcesCount = published.length;
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
