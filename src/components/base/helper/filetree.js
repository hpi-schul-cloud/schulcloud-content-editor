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
		recursiveSave(tree) {
			this.traverseTree(tree, (leave) => {
				if (leave.type === "file" && !this.value.saved.includes(leave.id)) {
					this.value.saved.push(leave.id);
				}
				return leave;
			});
		},
		mergeIntoTree(srcTree, newTree) {
			/*
				srcTree: [ { ... }, { id: a, objects: [], ... } ]
				newTree: [ { id: a, objects: [ {id: b, ... } ]} ]

				out: [ { id: a, objects: [ {id: b, ... } ]} ]
			*/
			// create copy to remove observers
			srcTree = this.deepCopy(srcTree);

			newTree.forEach((newNode) => {
				const indexInSrc = srcTree.findIndex((item) => item.id === newNode.id);
				if (indexInSrc === -1) {
					// new
					this.recursiveSetState(newNode, "new");
					srcTree.push(newNode);
				} else {
					// merge
					if (srcTree[indexInSrc].state !== "new") {
						srcTree[indexInSrc].state = "updated";
					}
					if (srcTree[indexInSrc].type === "folder") {
						// recursive for folders
						srcTree[indexInSrc].objects = this.mergeIntoTree(
							srcTree[indexInSrc].objects,
							newNode.objects
						);
					}
				}
			});
			return srcTree;
		},
	},
};
