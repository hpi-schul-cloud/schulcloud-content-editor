export default {
	methods: {
		deepCopy(src) {
			return JSON.parse(JSON.stringify(src));
		},
		traverseTree(tree, callback) {
			if (!Array.isArray(tree)) {
				tree = callback(tree);
				if (tree.type === "folder") {
					tree.objects = this.traverseTree(tree.objects, callback);
				}
				return tree;
			}
			return tree.map((leave) => {
				leave = callback(leave);
				if (leave.type === "folder") {
					leave.objects = this.traverseTree(leave.objects, callback);
				}
				return leave;
			});
		},
		recursiveSetState(tree, state) {
			this.traverseTree(tree, (leave) => {
				leave.state = state;
				return leave;
			});
		},
		recursiveSaveAfterUpload(tree) {
			this.traverseTree(tree, (leave) => {
				if (leave.type === "file" && !this.value.save.includes(leave.id)) {
					leave.xhr.addEventListener(
						"load",
						(res) => {
							const response = JSON.parse(res.srcElement.responseText);
							if (response.status === 200) {
								this.value.save.push(response.message);
							}
						},
						false
					);
				}
				return leave;
			});
		},
		normalizeTree(tree) {
			return this.traverseTree(tree, (node) => {
				return Object.assign(
					{
						state: "",
						objects: [],
						progress: undefined,
						upload: undefined,
						xhr: undefined,
					},
					node
				);
			});
		},
		mergeIntoForest(srcForest, newForest) {
			/*
				srcTree: [ { ... }, { id: a, objects: [], ... } ]
				newTree: [ { id: a, objects: [ {id: b, ... } ]} ]

				out: [ { id: a, objects: [ {id: b, ... } ]} ]
			*/
			// create copy to remove observers
			srcForest = this.deepCopy(srcForest);

			newForest.forEach((newNode) => {
				const indexInSrc = srcForest.findIndex(
					(item) => item.name === newNode.name
				);
				if (indexInSrc === -1) {
					// new
					this.recursiveSetState(newNode, "new");
					srcForest.push(newNode);
				} else {
					// merge
					if (srcForest[indexInSrc].state !== "new") {
						// TODO - item can't be "restored". It always stays in the save list
						srcForest[indexInSrc].state = "updated";
						//newNode.state = "updated";
						//srcForest[indexInSrc] = newNode;
					}
					if (srcForest[indexInSrc].type === "folder") {
						// recursive for folders
						srcForest[indexInSrc].objects = this.mergeIntoForest(
							srcForest[indexInSrc].objects,
							newNode.objects
						);
					}
				}
			});
			return srcForest.sort((a, b) =>
				a.type === b.type
					? a.name.localeCompare(b.name)
					: a.type === "file"
					? -1
					: 1
			);
		},
	},
};
