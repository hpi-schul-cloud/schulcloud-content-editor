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
		<template v-if="progressbarCurrentStep === 1" class="content">
			<p>Metadaten</p>
		</template>
		<template v-if="progressbarCurrentStep === 2" class="content">
			<p>Import</p>
		</template>
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

export default {
	name: "CsvImport",
	components: {
		StepProgress,
		Dropzone,
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
			csv_content: [],
			csv_headers: [],
			csv_fileName: "",
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
	max-width: 800px;
	margin: 8em auto 1em;
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
</style>
