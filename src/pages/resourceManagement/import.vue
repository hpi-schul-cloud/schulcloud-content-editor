<template>
	<!-- TODO:
	- Buttons in die Step-Komponenten
	- Teilüberschriften der Steps in die Step Komponenten schmeißen
	- v-if an die Step-Komponenten packen und divs entfernen
	- data() { return reset()}, wobei reset das zurückgibt, was aktuell in data steht + die metadatamapping "methode" oben
-->
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
			<LoadingBooks v-if="!successfullyImported && !importError" />
			<ResultPage v-if="importError" :config="errorConfig" />
			<ResultPage v-if="successfullyImported" :config="successConfig" />
		</div>
		<div v-if="progressbarCurrentStep < 3" class="button-wrapper">
			<BaseButton
				v-if="progressbarCurrentStep != 0"
				styling="secondary"
				@click="handleBackStep"
			>
				Zurück
			</BaseButton>
			<BaseButton
				styling="primary"
				:disabled="forwardButtonDisabled"
				@click="handleNextStep"
			>
				{{ forwardButtonText }}
			</BaseButton>
		</div>
		<div v-else class="button-wrapper">
			<BaseButton v-if="importError" styling="primary" @click="importCSV">
				Erneut Versuchen
			</BaseButton>
			<template v-if="successfullyImported">
				<BaseButton
					v-for="button in successButtonConfig"
					:key="button.text"
					:to="button.to"
					:styling="button.styling"
					@click="handleButtonClick(button.clickHandler, $event)"
				>
					{{ button.text }}
				</BaseButton>
			</template>
		</div>
	</div>
</template>
<script>
import StepProgress from "@/components/StepProgress";
import CsvUpload from "@/components/resourceManagement/import/CsvUpload";
import MetadataMapping from "@/components/resourceManagement/import/MappingMetadata";
import PreviewTable from "@/components/resourceManagement/import/PreviewTable";
import ValidationResultDialog from "@/components/resourceManagement/import/ValidationResultDialog";
import ResultPage from "@/components/resourceManagement/import/ResultPage";

import BaseButton from "@/components/base/BaseButton";
import BaseCheckbox from "@/components/base/BaseCheckbox";
import LoadingBooks from "@/components/LoadingBooks";

import api from "@/mixins/api.js";

const Ajv = require("ajv");

const metadata = {
	title: "",
	description: "",
	url: "URL where Content is located",
	licenses: "(ex. MIT ...)",
	contentCategory:
		"has to be one of the Following: 'atomic', 'learning-object', 'proven-learning-object', 'tool'",
	mimeType: "(ex. image, audio ...)",
	tags: "Keywords to search your Content",
	thumbnail: "Image-URL which represents the content for the end user",
};

const requiredMetadataFields = ["title", "url"];

const metadataFieldMapping = {};
Object.entries(metadata).forEach(([key, value]) => {
	metadataFieldMapping[key] = {
		mappedHeader: "",
		description: value,
		required: requiredMetadataFields.includes(key),
	};
});

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
		ResultPage,
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
			metadataFieldMapping,
			disabledOptions: [],
			isPublished: false,
			maxRows: 5,
			publishedResourcesCount: undefined,
			invalidFields: {},
			importError: "",
			successfullyImported: undefined,

			successButtonConfig: [
				{
					text: "Zur Verwaltung",
					to: { name: "resourceManagement" },
					styling: "secondary",
				},
				{
					text: "Importierte Inhalte ansehen",
					to: { name: "resourceManagement" },
					styling: "primary",
				},
				{
					text: "Zum Import",
					styling: "secondary",
					clickHandler: this.resetImport,
				},
			],
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
					userId: JSON.parse(localStorage.getItem("userInfo"))._id,
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
		successConfig: function() {
			const config = {
				type: "success",
				iconSrc: require("@/assets/icon-check-outline.svg"),
				numbers:
					this.successfullyImported + " / " + this.importedResources.length,
				title: "Inhalte erfolgreich importiert",
			};
			if (this.isPublished) {
				config.subtitle =
					"davon konnten <b>" +
					this.publishedResourcesCount +
					"</b> Inhalte veröffentlicht werden";
			}
			return config;
		},
		errorConfig: function() {
			return {
				type: "error",
				iconSrc:
					"https://cdn.shopify.com/s/files/1/1192/5178/products/3D-Book-Character-Sad-wm_large.jpg?v=1515387590",
				title: "Import fehlgeschlagen",
				subtitle: "Error: " + this.importError,
			};
		},
		forwardButtonDisabled: function() {
			return (
				this.csv.content.length === 0 ||
				(this.progressbarCurrentStep === 1 &&
					(this.metadataFieldMapping.title.mappedHeader === "" ||
						this.metadataFieldMapping.url.mappedHeader === ""))
			);
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
		handleButtonClick(handler, event) {
			if (handler) {
				return handler(event);
			}
		},
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
			this.successfullyImported = undefined;
			let newData = this.importedResources;

			return this.$_resourceCreate(newData)
				.then((response) => {
					if (response.code < 200 || response.code >= 300) {
						throw new Error(response.message);
					}
					this.$toasted.show(`Saved`);
					this.countPublishedResources(response);
					this.successfullyImported = response.length;
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
			this.successfullyImported = undefined;
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
.hint-icon {
	cursor: pointer;
}
</style>
