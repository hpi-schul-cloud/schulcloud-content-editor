<template>
	<!-- TODO: Buttons in die Step-Komponenten (?) -->
	<div>
		<h2>CSV-Import</h2>
		<StepProgress
			:steps="progressbarSteps"
			:current-step="progressbarCurrentStep"
		/>
		<div class="content">
			<CsvUpload
				v-if="progressbarCurrentStep === 0"
				v-model="csv"
				class="dropzone"
			/>
			<MetadataMapping
				v-if="progressbarCurrentStep === 1"
				v-model="metadataFieldMapping"
				:csv-headers="csv.headers"
				:valid-options="validCSVHeaders"
			/>
			<div v-if="progressbarCurrentStep === 2">
				<PreviewTable
					:header-fields="previewTableHeader"
					:content="clippedContentRows"
					:clipped="clipped"
					:invalid-fields="invalidFields"
				/>
				<PublishFlag v-model="isPublished" :validation-result="invalidFields" />
			</div>
			<div v-if="progressbarCurrentStep === 3">
				<LoadingBooks v-if="!successfullyImported && !importError">
					<h3 style="text-align: center">... Inhalte werden importiert ...</h3>
				</LoadingBooks>
				<ResultPage
					v-if="importError"
					:config="errorConfig"
					@result-page-button-clicked="handleButtonClick"
				/>
				<ResultPage
					v-if="successfullyImported"
					:config="successConfig"
					@result-page-button-clicked="handleButtonClick"
				/>
			</div>
		</div>
		<div v-if="progressbarCurrentStep < 3" class="button-wrapper">
			<BaseButton
				v-if="progressbarCurrentStep != 0"
				styling="secondary"
				@click="handleBackStep"
			>
				{{ backwardButtonText }}
			</BaseButton>
			<BaseButton
				:disabled="forwardButtonDisabled"
				styling="primary"
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
import PublishFlag from "@/components/resourceManagement/import/PublishFlag";
import ResultPage from "@/components/resourceManagement/import/ResultPage";

import BaseButton from "@/components/base/BaseButton";
import LoadingBooks from "@/components/LoadingBooks";

import { mapGetters } from "vuex";
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

const chunkSize = 250;

// Promise-trick that sets a timeout allowing the browser to render UI or handle User events before executing resolve
const promiseYield = (duration) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, duration);
	});
};

export default {
	components: {
		StepProgress,
		CsvUpload,
		MetadataMapping,
		PreviewTable,
		BaseButton,
		LoadingBooks,
		ResultPage,
		PublishFlag,
	},
	mixins: [api],
	data() {
		return this.initialDataState();
	},
	computed: {
		...mapGetters("user", {
			userInfo: "GET_USER",
		}),
		validCSVHeaders() {
			let validHeaders = {};
			this.csv.headers.forEach((header) => {
				validHeaders[header] = true;
			});

			this.csv.content.forEach((row) => {
				if (!Object.values(validHeaders).includes(true)) {
					return validHeaders;
				}
				Object.keys(validHeaders).forEach((header) => {
					if (row[header] === "") {
						validHeaders[header] = false;
					}
				});
			});
			return validHeaders;
		},
		backwardButtonText: function() {
			if (this.progressbarCurrentStep === 1) return "Zurücksetzen";
			else return "Zurück";
		},
		forwardButtonText: function() {
			if (this.progressbarCurrentStep === 2) return "Importieren";
			else return "Nächster Schritt";
		},
		previewTableHeader() {
			let header = Object.keys(this.metadataFieldMapping);
			return header;
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
				this.csv.fileName === "" ||
				(this.progressbarCurrentStep === 1 &&
					(this.metadataFieldMapping.title.mappedHeader === "" ||
						this.metadataFieldMapping.url.mappedHeader === ""))
			);
		},
	},
	async created() {
		this.resourceSchema = await this.getResourceSchema();
	},
	methods: {
		initialDataState() {
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
				metadataFieldMapping: this.initializeMetadataFieldMapping(),
				disabledOptions: [],
				isPublished: false,
				maxRows: 5,
				publishedResourcesCount: undefined,
				invalidFields: {},
				importError: "",
				successfullyImported: undefined,
				resourceSchema: {},
				importedResources: [],
			};
		},
		initializeMetadataFieldMapping() {
			const metadataFieldMapping = {};
			Object.entries(metadata).forEach(([key, value]) => {
				metadataFieldMapping[key] = {
					mappedHeader: "",
					description: value,
					required: requiredMetadataFields.includes(key),
				};
			});
			return metadataFieldMapping;
		},
		handleButtonClick(payload) {
			if (payload.handler) {
				return this[payload.handler](payload.event);
			}
		},
		handleNextStep() {
			this.incrementCurrentStep();
			if (this.progressbarCurrentStep === 2) {
				this.formatImportedResources().then(this.validateResourcesBeforeImport);
			}
			if (this.progressbarCurrentStep === 3) {
				this.importCSV();
			}
		},
		handleBackStep() {
			if (this.progressbarCurrentStep <= 0) return;
			if (this.progressbarCurrentStep === 1) {
				this.resetImport();
				return;
			}
			this.decrementCurrentStep();
		},
		incrementCurrentStep() {
			this.progressbarCurrentStep = this.progressbarCurrentStep + 1;
		},
		decrementCurrentStep() {
			this.progressbarCurrentStep = this.progressbarCurrentStep - 1;
		},
		chunkArray(arr, len) {
			var chunks = [],
				i = 0,
				n = arr.length;
			while (i < n) {
				chunks.push(arr.slice(i, (i += len)));
			}
			return chunks;
		},
		formatImportedResources() {
			const formatResource = (row, index) => {
				let resource = {
					providerId: this.userInfo.providerId,
					userId: this.userInfo._id,
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
				return resource;
			};
			// calculate the first rows synchronously, to display the previewTable quickly
			const firstResources = this.csv.content.splice(
				0,
				Math.min(this.csv.content.length, this.maxRows)
			);
			this.importedResources.push(...firstResources.map(formatResource));

			// create array of chunks, which will be formatted asynchronously with the PromiseYield trick (timeout of 0s allows browser to render UI or handle user events in between)
			const chunkPromises = this.chunkArray(this.csv.content, chunkSize).map(
				(resources) => {
					return promiseYield(0).then(() => {
						return resources.map(formatResource);
					});
				}
			);

			return Promise.all(chunkPromises).then((chunks) => {
				chunks.forEach((resources) => {
					this.importedResources.push(...resources);
				});
			});
		},
		importCSV() {
			this.importError = "";
			this.successfullyImported = undefined;
			let newData = this.importedResources;

			return this.$_resourceCreate(newData)
				.then((response) => {
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
		validateResourcesBeforeImport() {
			this.invalidFields = {};
			const ajv = new Ajv({ allErrors: true, errorDataPath: "property" });

			const validateResource = (resource) => {
				const valid = ajv.validate(this.resourceSchema, resource);
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
			};

			// validation asynchronously in chunks (timeout for 0s trick) so that the browser can handle user events in between
			const chunkPromises = this.chunkArray(
				this.importedResources,
				chunkSize
			).map((resources) => {
				return promiseYield(0).then(() => {
					return resources.map(validateResource);
				});
			});
			return Promise.all(chunkPromises);
		},
		getResourceSchema() {
			return this.$_resourceResourceSchemaGet().then((response) => {
				delete response["$schema"];
				return response;
			});
		},
		resetImport() {
			Object.assign(this.$data, this.initialDataState());
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
	margin: auto;
}
.button-wrapper {
	display: flex;
	justify-content: center;
	margin: 2em 0;
}
</style>
