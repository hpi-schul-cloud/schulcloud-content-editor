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
			<div class="flex">
				<h4 class="subtitle">Inhalte veröffentlichen?</h4>
				<BaseCheckbox v-model="isPublished" label="published"></BaseCheckbox>
				<p>
					<b>! Hinweis:</b>
					Nur vollständige und valide Inhalte können veröffentlicht werden.
				</p>
				<ValidationResultDialog
					:active.sync="showValidationDialog"
					:validation-results="invalidFields"
				/>
			</div>
		</div>
		<div v-if="progressbarCurrentStep === 3" class="content">
			<LoadingBooks
				v-if="publishedResourcesCount === undefined && !importError"
			/>
			<div v-if="importError" class="error-wrapper">
				<i class="material-icons error-icon">error</i>
				<p>Es konnten keine Inhalte importiert werden.</p>
				<b>Error:</b>
				{{ importError }}
			</div>
			<div v-if="publishedResourcesCount" style="text-align: center">
				{{ publishedResourcesCount }} / {{ importedResources.length }} Inhalte
				konnten veröffentlicht werden.
			</div>
		</div>
		<div class="button-wrapper">
			<BaseButton
				v-if="progressbarCurrentStep != 0 && !importError"
				styling="secondary"
				@click="handleBackStep"
			>
				Zurück
			</BaseButton>
			<BaseButton
				v-if="!importError"
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
					description: "( ex. atomic, learning-tool ...)",
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
			let newData = this.importedResources;

			return this.$_resourceCreate(newData)
				.then((response) => {
					if (response.code < 200 || response.code >= 300) {
						throw new Error(response.message);
					}
					this.$toasted.show(`Saved`);
					this.countPublishedResources(response);
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
.error-wrapper {
	text-align: center;
	.error-icon {
		display: block;
		font-size: 2em;
	}
}
</style>
