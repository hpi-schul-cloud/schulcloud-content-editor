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
			<h3>Mapping</h3>
			<MetadataMapping
				v-model="metadataFieldMapping"
				:csv-headers="csv.headers"
			/>
			<p>* required Felder</p>
		</div>
		<div v-if="progressbarCurrentStep === 2" class="content">
			<h3>Vorschau</h3>
			<PreviewTable
				:header-fields="previewTableHeader"
				:content="clippedContentRows"
				:clipped="clipped"
				:invalid-fields="invalidFields"
			/>
			<div class="flex-column">
				<h4 class="subtitle">Inhalte veröffentlichen?</h4>
				<BaseCheckbox v-model="isPublished" label="published"></BaseCheckbox>
				<div class="flex-row">
					<p>
						<b>! Hinweis:</b>
						Nur vollständige und valide Inhalte werden veröffentlicht.
					</p>
					<i
						v-if="isPublished"
						class="hint-icon material-icons"
						@click="showValidationDialog = true"
					>
						feedback
					</i>
				</div>
				<ValidationResultDialog
					:active.sync="showValidationDialog"
					:validation-results="invalidFields"
				/>
			</div>
		</div>
		<div v-if="progressbarCurrentStep === 3" class="content">
			<LoadingBooks v-if="!importSuccess && !importError" />
			<div v-if="importError" class="result-wrapper">
				<img
					class="result-image"
					src="https://cdn.shopify.com/s/files/1/1192/5178/products/3D-Book-Character-Sad-wm_large.jpg?v=1515387590"
				/>
				<h3 class="result-title">Import fehlgeschlagen</h3>
				<p class="result-subtitle">Error: {{ importError }}</p>
			</div>
			<div v-if="importSuccess" class="result-wrapper">
				<img
					class="result-image success-icon"
					src="@/assets/icon-check-outline.svg"
				/>
				<p class="result-numbers">
					{{ this.importSuccess }} / {{ importedResources.length }}
				</p>
				<h3 class="result-title">Inhalte erfolgreich importiert</h3>
				<p v-if="isPublished" class="result-subtitle">
					davon konnten
					<b>{{ publishedResourcesCount }}</b>
					Inhalte veröffentlicht werden
				</p>
			</div>
		</div>
		<div class="button-wrapper">
			<BaseButton
				v-if="progressbarCurrentStep != 0 && !importError && !importSuccess"
				styling="secondary"
				@click="handleBackStep"
			>
				Zurück
			</BaseButton>
			<BaseButton
				v-if="!importError && !importSuccess"
				styling="primary"
				:disabled="
					csv.content.length === 0 ||
						(progressbarCurrentStep === 1 &&
							(metadataFieldMapping.title.mappedHeader === '' ||
								metadataFieldMapping.url.mappedHeader === ''))
				"
				@click="handleNextStep"
			>
				{{ forwardButtonText }}
			</BaseButton>
			<BaseButton v-if="importError" styling="primary" @click="importCSV">
				Erneut Versuchen
			</BaseButton>
			<RouterLink v-if="importSuccess" :to="{ name: 'resourceManagement' }">
				<BaseButton styling="secondary">
					Zur Verwaltung
				</BaseButton>
			</RouterLink>
			<RouterLink v-if="importSuccess" :to="{ name: 'resourceManagement' }">
				<BaseButton v-if="importSuccess" styling="primary">
					Importierte Inhalte ansehen
				</BaseButton>
			</RouterLink>
			<RouterLink
				v-if="importSuccess"
				:to="{ name: 'resourceManagement/import' }"
			>
				<BaseButton
					v-if="importSuccess"
					styling="secondary"
					@click="resetImport"
				>
					Zum Import
				</BaseButton>
			</RouterLink>
		</div>
	</div>
</template>
<script>
import StepProgress from "@/components/StepProgress";
import CsvUpload from "@/components/resourceManagement/import/CsvUpload";
import MetadataMapping from "@/components/resourceManagement/import/MappingMetadata";
import PreviewTable from "@/components/resourceManagement/import/PreviewTable";
import ValidationResultDialog from "@/components/resourceManagement/import/ValidationResultDialog";

import BaseButton from "@/components/base/BaseButton";
import BaseCheckbox from "@/components/base/BaseCheckbox";
import LoadingBooks from "@/components/LoadingBooks";

import api from "@/mixins/api.js";

const Ajv = require("ajv");

export default {
	components: {
		StepProgress,
		CsvUpload,
		MetadataMapping,
		PreviewTable,
		ValidationResultDialog,
		BaseButton,
		BaseCheckbox,
		LoadingBooks,
	},
	mixins: [api],
	data() {
		return {
			showValidationDialog: false,
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
				title: {
					mappedHeader: "",
					description: "",
					required: true,
				},
				description: {
					mappedHeader: "",
					description: "",
				},
				url: {
					mappedHeader: "",
					description: "URL where Content is located",
					required: true,
				},
				licenses: {
					mappedHeader: "",
					description: "(ex. MIT ...)",
				},
				contentCategory: {
					mappedHeader: "",
					description:
						"has to be one of the Following: 'atomic', 'learning-object', 'proven-learning-object', 'tool'",
				},
				mimeType: {
					mappedHeader: "",
					description: "(ex. image, audio ...)",
				},
				tags: {
					mappedHeader: "",
					description: "Keywords to search your Content",
				},
				thumbnail: {
					mappedHeader: "",
					description:
						"Image-URL which represents the content for the end user",
				},
			},
			disabledOptions: [],
			isPublished: false,
			maxRows: 5,
			publishedResourcesCount: undefined,
			invalidFields: {},
			importError: "",
			importSuccess: undefined,
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
					providerName: "TestProvider",
					userId: "0000d231816abba584714c9e",
					originId: Date.now().toString() + index,
					isPublished: this.isPublished,
				};
				Object.entries(this.metadataFieldMapping).forEach(([key, value]) => {
					if (key === "tags" || key === "licenses") {
						if (row[value.mappedHeader]) {
							resource[key] = row[value.mappedHeader]
								.split(",")
								.map((each) => each.trim());
						}
					} else {
						if (row[value.mappedHeader]) {
							resource[key] = row[value.mappedHeader];
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
	watch: {
		isPublished: function(to, from) {
			if (to === true) {
				this.showValidationDialog = true;
			}
		},
	},
	created: function() {
		this.resetImport();
	},
	methods: {
		handleNextStep() {
			if (this.progressbarCurrentStep === 1) {
				this.validate();
			}
			if (this.progressbarCurrentStep === 2) {
				this.importCSV();
			}
			this.incrementCurrentStep();
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
			this.importError = "";
			this.importSuccess = undefined;
			let newData = this.importedResources;

			return this.$_resourceCreate(newData)
				.then((response) => {
					if (response.code < 200 || response.code >= 300) {
						throw new Error(response.message);
					}
					this.$toasted.show(`Saved`);
					this.countPublishedResources(response);
					this.importSuccess = response.length;
				})
				.catch((error) => {
					this.$toasted.error(`Failed to save`);
					this.importError = error.message;
				});
		},
		countPublishedResources(array) {
			let published = array.filter((resource) => {
				return resource.isPublished === true;
			});
			this.publishedResourcesCount = published.length;
		},
		async validate() {
			this.invalidFields = {};
			let schema = await this.getResourceSchema();
			delete schema["$schema"];

			const ajv = new Ajv({ allErrors: true, errorDataPath: "property" });

			this.importedResources.forEach((resource) => {
				const valid = ajv.validate(schema, resource);
				if (!valid) {
					ajv.errors.forEach((error) => {
						// remove the "." from the beginning of the String (error.dataPath)
						const errorField = error.dataPath.substring(1);
						if (!Array.isArray(this.invalidFields[errorField])) {
							// for reactivity in object
							this.$set(this.invalidFields, errorField, []);
						}
						if (!this.invalidFields[errorField].includes(error.message)) {
							this.invalidFields[errorField].push(error.message);
						}
					});
				}
			});
		},
		getResourceSchema() {
			return this.$_resourceResourceSchemaGet()
				.then((response) => {
					if (response.code < 200 && response.code >= 300) {
						throw new Error(response.message);
					}
					return response;
				})
				.catch((error) => {
					throw new Error(error);
				});
		},
		resetImport() {
			this.showValidationDialog = false;
			this.progressbarCurrentStep = 0;

			this.csv.headers = [];
			this.csv.content = [];
			this.csv.fileName = "";

			Object.entries(this.metadataFieldMapping).forEach(([key, value]) => {
				value.mappedHeader = "";
			});

			this.disabledOptions = [];
			this.isPublished = false;

			this.publishedResourcesCount = undefined;
			this.invalidFields = {};
			this.importError = "";
			this.importSuccess = undefined;
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
	margin: 2em 0;
}
.flex-column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.flex-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.subtitle {
	margin-bottom: 0;
}
.result-wrapper {
	text-align: center;

	.result-title {
		margin: 0.2em 0;
		font-size: 2.5em;
		font-weight: 400;
	}
	.result-subtitle {
		margin: 0.2em 0;
		font-size: 1.2em;
		font-weight: 300;
	}
	.result-numbers {
		margin: 0.1em;
		font-size: 4em;
		font-weight: bold;
	}
	.result-image {
		width: 18em;
		margin: 1em 0;

		&.success-icon {
			width: 5em;
		}
	}
}
.hint-icon {
	cursor: pointer;
}
</style>
