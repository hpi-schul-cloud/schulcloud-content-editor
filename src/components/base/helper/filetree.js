export default {
	methods: {
		//this.value.saved.push(leave.id);
		traverseTree(tree, callback) {
			if (typeof tree === "object") {
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
				if (leave.type === "file") {
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
			srcTree = JSON.parse(JSON.stringify(srcTree.slice(0))); // TODO test if we can remove JSON... here

			newTree.forEach((newNode) => {
				const indexInSrc = srcTree.findIndex((item) => item.id === newNode.id);
				if (indexInSrc === -1) {
					// new
					this.recursiveSetState(newNode, "new");
					srcTree.push(newNode);
				} else {
					// merge
					srcTree[indexInSrc].state = "updated";
					if (srcTree[indexInSrc].type === "folder") {
						// recursive
						srcTree[indexInSrc].objects = this.mergeIntoTree(
							srcTree[indexInSrc].objects,
							newNode.objects
						);
					} else {
						newNode.state = "updated";
						srcTree[indexInSrc] = newNode;
					}
				}
			});
			this.$forceUpdate();

			return srcTree;

			// upload implementation
			/*
			const newFiletree = JSON.parse(JSON.stringify(this.filetree.slice(0))); // create copy
			newItemsTree = this.markAllTreeItemsAsNew(newItemsTree);
			newItemsTree.forEach((newItem) => {
				const existingItemIndex = newFiletree.findIndex(
					(item) => item.id === newItem.id
				);
				if (existingItemIndex === -1) {
					newItem.state = "new";
					newFiletree.push(newItem);
				} else {
					newFiletree[existingItemIndex].state = "updated"; // TODO do recursive for folders
					// TODO maybe this needs to be implemented inside filetree as well.
				}
			});

			// Filetree implementation

			newItemsTree = this.markAllTreeItemsAsNew(newItemsTree);
			// create copy
			const newfiletree = this.filetree.slice(0);
			newItemsTree.forEach((newItem) => {
				newfiletree[itemIndex].objects.push(newItem);
			});*/
		},
	},
};
