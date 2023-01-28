// 处理treeData
export function dealTreeData(treeData: any, parent: any, level: number, isMenu?: boolean) {
	let newTreeData = treeData.map((item: any) => {
		let children = item.children;
		if (item.children && item.children.length > 0) {
			children = dealTreeData(item.children, item, level + 1, isMenu);
		}
		if (item.type === 2) {
			children = undefined
		}
		// ***important: 必须去除children字段，此字段无用于任何判断，且层数多了会导致数据过大内存溢出
		delete parent.children;
		let data = isMenu
			? {
				children,
				level,
				label: item.documentName,
				key: `${item.documentId}`,
				parent,
				data: { ...item }
			}
			: {
				...item,
				children,
				level,
				title: item.documentName,
				key: item.documentId,
				parent,
			};
		return data;
	});
	return newTreeData;
}

// 递归获取当前树的全部目录
export const getTreeCatalogueList = (treeData: any[]) => {
	let catalogueList: any[] = [];
	treeData.map((item: any, index: number) => {
		if (item.children && item.children.length > 0) {
			const data = getTreeCatalogueList(item.children);
			catalogueList.push(...data);
		}
		if (item.type === 2) {
			catalogueList.push(item);
		}
	});
	return catalogueList;
};

// 查找第一个目录
export const findDefaultSelected = (treeData: any[]) => {
	let targetItem: any;

	treeData.find(item => {
		if (item.type === 2 || (item.data && item.data.type === 2)) {
			targetItem = item;
			return true;
		} else if (item.children && item.children.length) {
			// 已经找到则不往下寻找
			if (targetItem?.key) {
				return;
			}
			targetItem = findDefaultSelected(item.children as any[]);
		}
	});
	return targetItem;
};

// 根据id查找树的层级结构
export const findLeafLayer = (
	treeData: any[],
	target: any,
	targetName: string,
	path?: any[],
): any[] => {
	path ? '' : (path = []);
	if (!treeData) return [];
	for (const data of treeData) {
		if (data[targetName] === target) {
			return path;
		}
		path.push(data[targetName]);
		if (data.children) {
			const findChildren = findLeafLayer(data.children, target, targetName, path);
			if (findChildren.length) return findChildren;
		}
		path.pop();
	}
	return [];
};

export const findTarget = (treeData: any[], key: string | number) => {
	let targetObj = null
	treeData.forEach((item) => {
		if (item.key === key) {
			targetObj = { ...item }
		}
		if (item.children && item.children.length > 0) {
			const res = findTarget(item.children, key)
			if (res) {
				targetObj = res
			}
		}
	})
	return targetObj
}
