export default {
	methods: {
		$_deepCopy(src) {
			return JSON.parse(JSON.stringify(src));
		},
		$_traverseTree(tree, callback) {
			if (!Array.isArray(tree)) {
				tree = callback(tree);
				if (tree.type === "folder") {
					tree.objects = this.$_traverseTree(tree.objects, callback);
				}
				return tree;
			}
			return tree.map((leave) => {
				leave = callback(leave);
				if (leave.type === "folder") {
					leave.objects = this.$_traverseTree(leave.objects, callback);
				}
				return leave;
			});
		},
		$_recursiveSetState(tree, state) {
			this.$_traverseTree(tree, (leave) => {
				leave.state = state;
				return leave;
			});
		},
		$_recursiveSaveAfterUpload(tree) {
			this.$_traverseTree(tree, (leave) => {
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
		$_normalizeTree(tree) {
			return this.$_traverseTree(tree, (node) => {
				return Object.assign(
					{
						state: "",
						objects: [],
						progress: undefined,
						upload: undefined,
						xhr: undefined,
						originalId: undefined,
					},
					node
				);
			});
		},
		$_mergeIntoForest(srcForest, newForest) {
			/*
				srcTree: [ { ... }, { id: a, objects: [], ... } ]
				newTree: [ { id: a, objects: [ {id: b, ... } ]} ]

				out: [ { id: a, objects: [ {id: b, ... } ]} ]
			*/
			// create copy to remove observers
			srcForest = this.$_deepCopy(srcForest);

			newForest.forEach((newNode) => {
				const indexInSrc = srcForest.findIndex(
					(item) => item.name === newNode.name
				);
				if (indexInSrc === -1) {
					// new
					this.$_recursiveSetState(newNode, "new");
					srcForest.push(newNode);
				} else {
					// merge
					if (srcForest[indexInSrc].state !== "new") {
						if (!srcForest[indexInSrc].originalId) {
							newNode.originalId = srcForest[indexInSrc].id;
						} else if (srcForest[indexInSrc].xhr) {
							srcForest[indexInSrc].xhr.abort();
							srcForest[indexInSrc].xhr = undefined;
						}
						newNode.state = "updated";
						srcForest[indexInSrc] = newNode;
					}
					if (srcForest[indexInSrc].type === "folder") {
						// recursive for folders
						srcForest[indexInSrc].objects = this.$_mergeIntoForest(
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
