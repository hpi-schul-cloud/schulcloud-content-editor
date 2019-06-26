<template>
	<div>
		<Dropzone @drop.prevent="handleDrop">
			<label class="input-label">
				<i class="material-icons upload-icon">cloud_upload</i>
				Lade hier eine CSV-Datei hoch
				<input
					@input="handleFileChosen"
					class="hidden-but-accessible"
					type="file"
					accept=".csv"
				/>
			</label>
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
		handleDrop(ev) {
			this.loadCSV(ev.dataTransfer.files[0]);
		},
		handleFileChosen(ev) {
			let file = ev.target.files[0];
			this.loadCSV(file);
		},
		loadCSV(file) {
			if (!file.type === "application/vnd.ms-excel") {
				// TODO is CSV always of this type?
				return alert("Wrong file type! Please choose a csv-file.");
			}
			if (!window.FileReader) {
				return alert("FileReader is not supported in this browser.");
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
.hidden-but-accessible {
	/* https://snook.ca/archives/html_and_css/hiding-content-for-accessibility */
	position: absolute !important;
	top: 0;
	left: 0;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
	clip: rect(1px, 1px, 1px, 1px);
}
.input-label {
	position: relative;
	flex: 1;
	padding: 2em;
	text-align: center;
	cursor: pointer;
	&:focus-within {
		color: #fff;
		background-color: var(--darkGrey);
		filter: brightness(200%);
	}
}
.upload-icon {
	display: block;
	font-size: 5em;
	color: #aaa;
}
</style>
