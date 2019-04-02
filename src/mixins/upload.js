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
		let url = `${this.$config.API.contentServerUrl}${
			this.$config.API.fileUploadPath
		}?path=${filepath}`;

		const formData = new FormData();
		formData.append("file", file);

		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener(
			"progress",
			(evt) => {
				if (evt.lengthComputable) {
					const progress = (evt.loaded / evt.total) * 100;
					if (progress < 100 && progress > 0) {
						this.progress = progress;
					}
				}
			},
			false
		);
		xhr.addEventListener(
			"load",
			(res) => {
				const response = JSON.parse(res.srcElement.responseText);
				if (response.status !== 200) {
					this.state = "upload-error";
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
				this.state = "upload-error";
				console.error("Error during upload", res);
			},
			false
		);
		xhr.addEventListener(
			"timeout",
			(res) => {
				this.state = "upload-error";
				console.error("upload timed out", res);
			},
			false
		);
		xhr.addEventListener(
			"loadend",
			() => {
				this.progress = undefined;
				this.xhr = undefined;
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
		$_traverseFiles(item, prefix) {
			if (item.isFile) {
				const itemFullPath = prefix + item.fullPath;
				const fileMetaObject = {
					id: itemFullPath,
					name: item.name,
					type: "file",
					state: "",
					progress: undefined, // initialize it here, to let vue create an observer for it
					upload: uploadFile,
					xhr: undefined,
				};
				// call `upload` from here, so we can access `fileMetaObject` as `this` inside the function
				return fileMetaObject
					.upload(item, itemFullPath, this)
					.then((xhrUpload) => {
						fileMetaObject.xhr = xhrUpload;
						return fileMetaObject;
					});
			}
			if (item.isDirectory) {
				return PromiseReader(item)
					.then((entries) =>
						Promise.all(
							entries.map((entry) => this.$_traverseFiles(entry, prefix))
						)
					)
					.then((subFileForest) => ({
						id: prefix + item.fullPath,
						name: item.name,
						type: "folder",
						state: "",
						objects: subFileForest,
					}));
			}
		},
		$_dropFile(event, prefix = "") {
			return Promise.all(
				Array.from(event.dataTransfer.items).map((rawItem) => {
					let item = rawItem.webkitGetAsEntry();
					if (item) {
						return this.$_traverseFiles(item, prefix);
					}
				})
			);
		},
	},
};
