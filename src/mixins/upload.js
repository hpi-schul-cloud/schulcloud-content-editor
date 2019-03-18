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

function uploadFile(item, filepath, that) {
	return PromiseFile(item).then((file) => {
		let url = `http://localhost:4040/files/upload?path=${filepath}`;

		const formData = new FormData();
		formData.append("file", file);

		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener(
			"progress",
			(evt) => {
				if (evt.lengthComputable) {
					this.progress = (evt.loaded / evt.total) * 100;
				}
			},
			false
		);
		xhr.addEventListener(
			"load",
			(res) => {
				const response = JSON.parse(res.srcElement.responseText);
				this.progress = undefined;
				if (response.status !== 200) {
					this.status = "upload-error";
					console.error("Error after upload", res);
					return;
				}
				this.id = response.message;
			},
			false
		);
		xhr.addEventListener(
			"error",
			(res) => {
				this.progress = undefined;
				this.status = "upload-error";
				console.error("Error during upload", res);
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
			xhr.setRequestHeader(header[0], header[1]);
		});
		xhr.send(formData);
		return xhr;
	});
}

export default {
	methods: {
		traverseFiles(item, prefix) {
			if (item.isFile) {
				const itemFullPath = prefix + item.fullPath;
				const fileMetaObject = {
					id: itemFullPath,
					name: item.name,
					type: "file",
					progress: 0, // initialize it here, to let vue create an observer for it
					upload: uploadFile,
				};
				// call `upload` from here, so we can access `fileMetaObject` as `this` inside the function
				return fileMetaObject
					.upload(item, itemFullPath, this)
					.then((xhrUpload) => {
						fileMetaObject.xhr = xhrUpload;
						return new Promise((resolve) => resolve(fileMetaObject));
					});
			}
			if (item.isDirectory) {
				return PromiseReader(item)
					.then((entries) =>
						Promise.all(
							entries.map((entry) => this.traverseFiles(entry, prefix))
						)
					)
					.then((subFileForest) => ({
						id: prefix + item.fullPath,
						name: item.name,
						type: "folder",
						objects: subFileForest,
					}));
			}
		},
		dropFile(event, prefix = "") {
			return Promise.all(
				Array.from(event.dataTransfer.items).map((rawItem) => {
					let item = rawItem.webkitGetAsEntry();
					if (item) {
						return this.traverseFiles(item, prefix);
					}
				})
			);
		},
	},
};
