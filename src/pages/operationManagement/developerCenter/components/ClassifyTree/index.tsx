import React from 'react';
import { useUpdateEffect, useMount } from '@pms/hooks';
import { Button, message, Modal } from 'antd';
import { Title, useSetReactive } from '@pms/middleground-share';
import { findDocumentsList, delDocument } from '../../servers/api';
import CatalogueTree from './components/CatalogueTree';
import { PlusDataNode, ClassifyTreeProps } from '../../type';
import AddOrEditClaModal from '../AddOrEditClaModal/index';
import { findDefaultSelected, findLeafLayer, dealTreeData } from '@/utils/treeFunction';
import { useGunbossFunAuth } from '@pms/gboss';
import './index.less';

function ClassifyTree(props: ClassifyTreeProps) {
	const { curCatalogue, changeCatalogue } = props;

	const { confirm } = Modal;
	const auth = useGunbossFunAuth({
		'/classificationAdd': { value: '新增分类', status: false },
		'/developerOperate': { value: '操作', status: false },
	});
	// 目录列表树
	const [treeReactive, setTreeReactive] = useSetReactive({
		treeData: [],
		maxLevel: 5,
		expandedKeys: [],
		selectedKeys: [],
		curOperateData: undefined,
	});
	// 新增分类或目录面板
	const [addModalReactive, setAddModalReactive] = useSetReactive({
		isClassify: true,
		visible: false,
		title: '新增分类',
		isEdit: false,
	});

	// 获取目录列表数据
	const getData = async () => {
		const res = await findDocumentsList();
		const newTreeData = dealTreeData(res.data, { type: 1, treeId: 'root' }, 1);
		console.log('newTreeData', newTreeData);
		// 默认右边展示第一套分类的第一个目录 
		if (!curCatalogue?.documentId) {
			const defaultSelected: PlusDataNode = findDefaultSelected(newTreeData);
			if (defaultSelected?.documentId) {
				changeCatalogue(defaultSelected);
			}
		}
		treeReactive.treeData = newTreeData;
	};

	const treeClick = (nodeData: PlusDataNode) => {
		changeCatalogue(nodeData);
	};

	// 目录树操作
	const operateFun = (type: string, nodeData?: PlusDataNode) => {
		treeReactive.curOperateData = nodeData;
		switch (type) {
			// 新增分类;
			case 'addClassify':
				setAddModalReactive({
					isClassify: true,
					visible: true,
					title: '新增分类',
					isEdit: false,
				});
				break;
			// 新增目录;
			case 'addCatalogue':
				setAddModalReactive({
					isClassify: false,
					visible: true,
					title:
						treeReactive.curOperateData.type === 1
							? `新增目录(${treeReactive.curOperateData.documentName})`
							: `新增目录(${treeReactive.curOperateData.parent.documentName})`,
					isEdit: false,
				});
				break;
			// 编辑分类;
			case 'editClassify':
				setAddModalReactive({
					isClassify: true,
					visible: true,
					title: '编辑分类',
					isEdit: true,
				});
				break;
			// 删除分类;
			case 'deleteClassify':
				deleteComfirm('deleteClassify');
				break;
			// 编辑目录;
			case 'editCatalogue':
				setAddModalReactive({
					isClassify: false,
					visible: true,
					title:
						treeReactive.curOperateData.type === 1
							? `编辑目录(${treeReactive.curOperateData.documentName})`
							: `编辑目录(${treeReactive.curOperateData.parent.documentName})`,
					isEdit: true,
				});
				break;
			// 删除目录
			case 'deleteCatalogue':
				deleteComfirm('deleteCatalogue');
				break;
		}
	};

	// 删除目录或者分类
	const deleteComfirm = (type: string) => {
		let deleteText = '确定删除此目录？确认删除后将无法找回。';
		if (type === 'deleteClassify') {
			if (treeReactive.curOperateData?.children?.length) {
				message.error('当前分类下存在分类或者目录，不可删除！');
				return;
			}
			deleteText = '确定删除此分类？确认删除后将无法找回。';
		}
		confirm({
			title: '提示',
			content: <div>{deleteText}</div>,
			onOk() {
				const documentId = treeReactive.curOperateData!.documentId;
				delDocument(documentId).then(res => {
					if (!res.success) {
						message.error('删除失败');
						return;
					}
					// 判断当前删除的目录是否是被选中的目录
					if (documentId === curCatalogue.documentId) {
						// 当前删除项是右边展示的项
						changeCatalogue({});
						return
					}
					getData();
				});
			},
			onCancel() { },
		});
	};

	const editSuccess = async (curCatalogue?: any) => {
		await getData();
		// 新增目录或者编辑的是右边展示的目录
		if (curCatalogue) {
			changeCatalogue(curCatalogue);
		}
		addModalReactive.visible = false;
	};

	useMount(() => {
		// 获取分类列表树
		getData();
	});

	// 监听当前选择的目录并展开与选择
	useUpdateEffect(() => {
		if (curCatalogue?.documentId) {
			const expandKeys = findLeafLayer(treeReactive.treeData, curCatalogue.documentId, 'documentId');
			treeReactive.selectedKeys = [curCatalogue.documentId];
			treeReactive.expandedKeys = expandKeys;
		}
		// 删除了右边展示的文档
		if (!curCatalogue.documentId) {
			getData();
		}
	}, [curCatalogue]);

	return (
		<div className="classify-container">
			<div className="title-box">
				<Title title="分类列表" />
				{auth['/classificationAdd']?.status && (
					<Button type="primary" onClick={() => operateFun('addClassify')}>
						新增分类
					</Button>
				)}
			</div>
			<div className="margin-top-15">
				<CatalogueTree
					treeData={treeReactive.treeData}
					showOperate={auth['/developerOperate']?.status}
					expandedKeys={treeReactive.expandedKeys}
					selectedKeys={treeReactive.selectedKeys}
					maxLevel={treeReactive.maxLevel}
					treeClick={treeClick}
					operateMenuClick={operateFun}
				/>
			</div>
			<AddOrEditClaModal
				addModalReactive={addModalReactive}
				setAddModalReactive={setAddModalReactive}
				operateData={treeReactive.curOperateData}
				curCatalogue={curCatalogue}
				onEditSuccess={editSuccess}
			/>
		</div>
	);
}

export default ClassifyTree;
