<template>
	<div>
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
		<div v-if="csv.content.length != 0" class="loaded-csv-entries">
			{{ csv.content.length }}
			<span>Einträge wurden hochgeladen aus {{ csv.fileName }}</span>
		</div>
	</div>
</template>

<script>
import Dropzone from "@/components/Dropzone.vue";

export default {
	name: "CsvUpload",
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
		loadCSV(ev) {
			let file = ev.target.files[0];

			if (file.type === "application/vnd.ms-excel") {
				this.csv.fileName = file.name;
				if (window.FileReader) {
					var reader = new FileReader();

					reader.readAsText(file, "ISO-8859-1");
					reader.onload = (event) => {
						this.csv.content = this.parseCSV(event.target.result);
					};
					reader.onerror = (evt) => {
						if (evt.target.error.name == "NotReadableError") {
							alert("Cannot read file !");
						}
					};
					this.$emit("input", this.csv);
				} else {
					alert("FileReader is not supported in this browser.");
				}
			} else alert("Wrong file type! Please choose a csv-file.");
		},
		parseCSV(csv) {
			const lines = csv.split("\n");
			let result = [];
			this.csv.headers = lines.splice(0, 1)[0].split(";");

			lines.forEach((line, indexLine) => {
				let obj = {};
				let currentline = line.split(";");

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
