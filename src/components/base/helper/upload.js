function PromiseReader(item) {
	return new Promise((resolve, reject) => {
		try {
			let directoryReader = item.createReader();
			directoryReader.readEntries(resolve);
		} catch (error) {
			return reject(error);
		}
	});
}

function PromiseFile(item) {
	return new Promise((resolve, reject) => {
		try {
			return item.file(resolve);
		} catch (error) {
			return reject(error);
		}
	});
}

export default {
	methods: {
		async traverseFiles(item, prefix) {
			if (item.isFile) {
				// read file
				const fileId = await PromiseFile(item).then((file) => {
					return this.uploadFile(file, prefix + item.fullPath);
				});
				return {
					id: fileId,
					name: item.name,
					type: "file",
				};
			} else if (item.isDirectory) {
				const entries = await PromiseReader(item);

				return Promise.all(
					entries.map(async (entry) => {
						return this.traverseFiles(entry, prefix);
					})
				).then((res) => ({
					id: prefix + item.fullPath,
					name: item.name,
					type: "folder",
					objects: res,
				}));
			}
		},
		async uploadFile(file, filepath) {
			let url = `http://localhost:4040/files/upload?path=${filepath}`;
			let formData = new FormData();
			formData.append("file", file);

			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				// Update progress bar
				xhr.upload.addEventListener(
					"progress",
					(evt) => {
						if (evt.lengthComputable) {
							//console.log("progress:", (evt.loaded / evt.total) * 100 + "%");
						}
					},
					false
				);

				// File uploaded
				xhr.addEventListener(
					"load",
					(res) => {
						const response = JSON.parse(res.srcElement.responseText);
						if (response.status !== 200) {
							reject(response.message);
						}
						resolve(response.message);
					},
					false
				);

				xhr.addEventListener(
					"error",
					(res) => {
						reject(res);
					},
					false
				);

				xhr.open("post", url, true);
				// Set appropriate headers

				[
					["Authorization", `Bearer ${localStorage.getItem("jwt")}`],
					["X-File-Name", file.name],
					["X-File-Size", file.size],
					["X-File-Type", file.type],
				].forEach((header) => {
					if (!header[0] || !header[1]) {
						return;
					}
					header = header.map((str) =>
						(str || "")
							.toString()
							.replace(
								/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
								""
							)
					);
					return xhr.setRequestHeader(header[0], header[1]);
				});

				// Send the file (doh)
				xhr.send(formData);
				//console.log(xhr);
			});
		},
		dropFile(event, prefix) {
			return Promise.all(
				Array.from(event.dataTransfer.items).map(async (rawItem) => {
					let item = rawItem.webkitGetAsEntry();
					if (item) {
						return await this.traverseFiles(item, prefix);
					}
				})
			);
		},
	},
};
