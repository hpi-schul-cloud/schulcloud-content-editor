export default {
	data() {
		return {
			pathPrefix: "",
		};
	},
	methods: {
		traverseFiles(item) {
			if (item.isFile) {
				// read file
				item.file((file) => {
					this.uploadFile(file, item.fullPath);
				});
			} else if (item.isDirectory) {
				let directoryReader = item.createReader();
				directoryReader.readEntries((entries) => {
					entries.forEach((entry) => {
						this.traverseFiles(entry);
					});
				});
			}
		},
		setPathPrefix(prefix) {
			this.pathPrefix = prefix;
		},
		async uploadFile(file, path) {
			let url = `http://localhost:4040/files/upload?path=${
				this.pathPrefix
			}${path}`;
			let formData = new FormData();
			formData.append("file", file);

			const xhr = new XMLHttpRequest();

			// Update progress bar
			xhr.upload.addEventListener(
				"progress",
				(evt) => {
					if (evt.lengthComputable) {
						//console.log("progress:", (evt.loaded / evt.total) * 100 + "%");
						//progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
					} else {
						// No data to calculate on
					}
				},
				false
			);

			// File uploaded
			xhr.addEventListener(
				"load",
				(res) => {
					//console.log("Uploaded!");
				},
				false
			);

			xhr.addEventListener(
				"error",
				(res) => {
					//console.log("upload failed!");
				},
				false
			);

			xhr.open("post", url, true);
			// Set appropriate headers
			xhr.setRequestHeader("X-File-Name", file.name);
			xhr.setRequestHeader("X-File-Size", file.size);
			xhr.setRequestHeader("X-File-Type", file.type);

			// Send the file (doh)
			xhr.send(formData);
		},
		dropFile(event) {
			event.preventDefault();
			Array.from(event.dataTransfer.items).forEach((rawItem) => {
				let item = rawItem.webkitGetAsEntry();
				if (item) {
					this.traverseFiles(item);
				}
			});
		},
	},
};
