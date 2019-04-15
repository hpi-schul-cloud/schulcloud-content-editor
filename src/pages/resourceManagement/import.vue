<template>
	<div>
		<h2>CSV-Import</h2>
		<StepProgress
			:steps="progressbarSteps"
			:current-step="progressbarCurrentStep"
		/>
		<div v-if="progressbarCurrentStep === 0" class="dropzone content">
			<Dropzone>
				<label class="input-label">
					Lade hier eine CSV-Datei hoch
					<input
						class="hidden-but-accessible"
						type="file"
						accept=".csv"
						@input="loadCSV"
					/>
				</label>
			</Dropzone>
			<div v-if="csv_content.length != 0" class="loaded-csv-entries">
				{{ csv_content.length }}
				<span>Einträge wurden hochgeladen aus {{ csv_fileName }}</span>
			</div>
		</div>
		<div v-if="progressbarCurrentStep === 1" class="content">
			<table style="width:100%">
				<tr>
					<th id="state-column"></th>
					<th>Metadaten Felder</th>
					<th>CSV-Felder</th>
				</tr>
				<tr v-for="(value, key) in metadataFieldMapping" :key="key">
					<td>
						<i v-if="metadataFieldMapping[key] != ''" class="material-icons">
							done
						</i>
					</td>
					<td>{{ key }}</td>
					<td>
						<BaseSelect
							:options="options"
							label=""
							name="FieldMapping"
							:selected="metadataFieldMapping[key]"
							@input="metadataFieldMapping[key] = $event"
						/>
					</td>
				</tr>
			</table>
		</div>
		<div v-if="progressbarCurrentStep === 2" class="content">
			<table>
				<tr>
					<th v-for="(value, key) in metadataFieldMapping" :key="key">
						{{ key }}
					</th>
				</tr>
				<tr v-for="(row, index) in csv_content" :key="index">
					<td v-for="(value, key) in metadataFieldMapping" :key="key">
						{{ row[metadataFieldMapping[key]] }}
					</td>
				</tr>
			</table>

			<p v-for="(field, index) in csv_content" :key="index">{{ field }}</p>
		</div>
		<div class="button-wrapper">
			<BaseButton
				styling="primary"
				:disabled="csv_content.length === 0"
				@click="incrementCurrentStep"
			>
				Nächster Schritt
			</BaseButton>
		</div>
	</div>
</template>
<script>
import StepProgress from "@/components/StepProgress.vue";
import Dropzone from "@/components/Dropzone.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";

export default {
	name: "CsvImport",
	components: {
		StepProgress,
		Dropzone,
		BaseButton,
		BaseSelect,
	},
	data() {
		return {
			progressbarSteps: [
				{ name: "Datei hochladen" },
				{ name: "Metadaten anpassen" },
				{ name: "Veröffentlichen" },
			],
			progressbarCurrentStep: 0,
			csv_content: [],
			csv_headers: [],
			csv_fileName: "",
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
			options: [{ key: "none", value: "kein Match" }],
		};
	},
	methods: {
		incrementCurrentStep() {
			if (this.progressbarCurrentStep < 2) {
				this.progressbarCurrentStep = this.progressbarCurrentStep + 1;
			} else this.progressbarCurrentStep = 0;
		},
		loadCSV(ev) {
			let file = ev.target.files[0];

			if (file.type === "application/vnd.ms-excel") {
				this.csv_fileName = file.name;
				if (window.FileReader) {
					var reader = new FileReader();

					reader.readAsText(file);
					reader.onload = (event) => {
						this.csv_content = this.parseCSV(event.target.result);
					};
					reader.onerror = (evt) => {
						if (evt.target.error.name == "NotReadableError") {
							alert("Cannot read file !");
						}
					};
				} else {
					alert("FileReader is not supported in this browser.");
				}
			} else alert("Wrong file type! Please choose a csv-file.");
		},
		parseCSV(csv) {
			const lines = csv.split("\n");
			let result = [];
			this.csv_headers = lines.splice(0, 1)[0].split(";");

			this.csv_headers.forEach((headerField) => {
				let obj = {};
				obj.key = headerField;
				obj.value = headerField;
				this.options.push(obj);
			});

			lines.forEach((line, indexLine) => {
				let obj = {};
				let currentline = line.split(";");

				if (currentline.length < this.csv_headers.length) {
					return;
				}

				this.csv_headers.forEach((header, indexHeader) => {
					obj[header] = currentline[indexHeader];
				});

				result.push(obj);
			});
			return result;
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
.loaded-csv-entries {
	margin: 1em 0;
	font-size: 24px;
	text-align: center;

	span {
		display: block;
		font-size: initial;
	}
}
.hidden-but-accessible {
	position: absolute;
	width: 0;
	height: 0;
}
.input-label {
	flex: 1;
	padding: 2em;
	text-align: center;
}

.table-wrapper {
	margin: 1em 0;
}

table,
th,
td {
	border-collapse: collapse;
	border: 1px solid black;
}

th,
td {
	padding: 8px;
}

table {
	table-layout: fixed;

	#state-column {
		width: 40px;
	}
}
</style>
