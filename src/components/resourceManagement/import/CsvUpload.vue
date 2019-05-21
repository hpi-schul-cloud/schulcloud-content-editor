<template>
	<div>
		<Dropzone @files="handleFileChosen" :inputAttributes="{ accept: '.csv' }">
			<template slot="description">
				Lade hier eine CSV-Datei hoch
			</template>
		</Dropzone>
		<div v-if="csv.content.length != 0" class="loaded-csv-entries">
			{{ csv.content.length }}
			<span>Einträge wurden hochgeladen aus {{ csv.fileName }}</span>
		</div>
	</div>
</template>

<script>
import Dropzone from "@/components/resourceManagement/Dropzone";

export default {
	components: {
		Dropzone,
	},
	model: {
		prop: "csv",
		event: "input",
	},
	props: {
		csv: {
			type: Object,
			required: true,
		},
	},
	methods: {
		handleFileChosen(files) {
			this.loadCSV(files[0]);
		},
		loadCSV(file) {
			if (!file) {
				console.error("no file loaded");
			}
			if (file.type !== "application/vnd.ms-excel") {
				// TODO is CSV always of this type?
				return this.$toasted.error(
					"Wrong file type! Please choose a csv-file."
				);
			}
			if (!window.FileReader) {
				return this.$toasted.error(
					"FileReader is not supported in this browser."
				);
			}

			this.csv.fileName = file.name;
			var reader = new FileReader();

			reader.readAsText(file, "ISO-8859-1");
			reader.onload = (event) => {
				this.csv.content = this.parseCSV(event.target.result);
				this.$emit("input", this.csv);
			};
			reader.onerror = (evt) => {
				alert("Cannot read file !");
			};
		},
		parseCSV(csv) {
			const lines = csv.split("\n");
			// read headers as array and remove it from lines
			this.csv.headers = lines.splice(0, 1)[0].split(";");

			const result = [];
			lines.forEach((line, indexLine) => {
				const obj = {};
				const currentline = line.split(";");

				// ignore blank lines
				if (currentline.length < this.csv.headers.length) {
					return;
				}

				this.csv.headers.forEach((header, indexHeader) => {
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
.loaded-csv-entries {
	margin: 1em 0;
	font-size: 24px;
	text-align: center;

	span {
		display: block;
		font-size: initial;
	}
}
</style>
