import React from 'react';
import { Tree, Dropdown, Menu, Empty, Badge } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { useSetReactive } from '@pms/middleground-share'
import { useUpdateEffect } from '@pms/hooks';
import '../index.less';

interface PlusDataNode extends DataNode {
	level: number;
	children?: PlusDataNode[] | undefined
	[propName: string]: any
}

interface Props {
	treeData: PlusDataNode[];
	maxLevel?: number;
	showOperate: boolean;
	expandedKeys?: any[];
	selectedKeys?: any[];
	operCategryMenu?: React.ReactElement;
	operCatalogueMenu?: React.ReactElement;
	treeClick: (nodeData: PlusDataNode) => void;
	operateMenuClick?: (type: string, nodeData: PlusDataNode) => void;
}

function CatalogueTree(props: Props) {
	const { treeData, maxLevel, showOperate } = props
	// 分类列表树
	const [treeReactive, setTreeReactive] = useSetReactive({
		expandedKeys: [],
		selectedKeys: [],
		curOperateData: undefined,
	});

	// 记录当前操作的树节点
	const operateClick = (nodeData: PlusDataNode) => {
		treeReactive.curOperateData = nodeData
	};

	// 点击目录
	const treeClick = (nodeData: PlusDataNode) => {
		props.treeClick(nodeData)
	};

	// 自定义树状节点渲染
	const titleRender = (nodeData: any) => {
		if (nodeData.type === 1) {
			return (
				<div className='flex-center'>
					<div className='flex-center'>
						<FolderOpenOutlined />
						<div className={'tree-title-' + nodeData.level} style={{ marginLeft: '5px' }}>
							{nodeData.title}
						</div>
					</div>
					{
						showOperate ? (
							<Dropdown trigger={['click']} overlay={() => operCategryMenu(nodeData)} placement="bottom">
								<span className='active-text' onClick={() => operateClick(nodeData)}>
									操作
								</span>
							</Dropdown>
						) : ''
					}
				</div>
			);
		}
		return (
			<div className='flex-center'>
				<div className='tree-title' style={{ display: 'flex', flex: 1 }} onClick={() => treeClick(nodeData)}>
					<Badge color="#aaa" dot />
					<div className={'tree-title-' + nodeData.level}>{nodeData.title}</div>
				</div>
				{
					showOperate ? (
						<Dropdown trigger={['click']} overlay={() => operCatalogueMenu()} placement="bottom">
							<span className='active-text' onClick={() => operateClick(nodeData)}>
								操作
							</span>
						</Dropdown>
					) : ''
				}
			</div>
		);
	};

	const onExpand = (keys: any[]) => {
		treeReactive.expandedKeys = keys
	}

	// 不设置操作菜单，采用组件内部的默认设置，返回操作类型，和操作的数据
	const operateFun = (type: string) => {
		props.operateMenuClick && props.operateMenuClick(type, treeReactive.curOperateData)
	};

	// 分类操作菜单列表
	const operCategryMenu = (nodeData: PlusDataNode) => {
		if (props.operCategryMenu) {
			return props.operCategryMenu
		}
		const menuItems = [
			{
				key: 'addClassify',
				label: <div onClick={() => operateFun('addClassify')}>新增分类</div>,
			},
			{
				key: 'addCatalogue',
				label: <div onClick={() => operateFun('addCatalogue')}>新增目录</div>,
			},
			{
				key: 'editClassify',
				label: <div onClick={() => operateFun('editClassify')}>编辑</div>,
			},
			{
				key: 'deleteClassify',
				label: <div onClick={() => operateFun('deleteClassify')}>删除</div>,
			},
		]
		// 倒数第二层不显示新增分类
		if (maxLevel && nodeData.level === maxLevel - 1) {
			menuItems.splice(0, 1)
		}
		return (
			<Menu
				style={{ textAlign: 'center' }}
				items={menuItems}
			/>
		);
	}

	// 目录操作菜单列表
	const operCatalogueMenu = () => {
		if (props.operCatalogueMenu) {
			return props.operCatalogueMenu
		}
		return (
			<Menu
				style={{ textAlign: 'center' }}
				items={[
					{
						key: 'editCatalogue',
						label: <div onClick={() => operateFun('editCatalogue')}>编辑</div>,
					},
					{
						key: 'deleteCatalogue',
						label: <div onClick={() => operateFun('deleteCatalogue')}>删除</div>,
					},
				]}
			/>
		);
	}

	useUpdateEffect(() => {
		setTreeReactive({
			expandedKeys: Array.from(new Set([...treeReactive.expandedKeys, ...(props.expandedKeys || [])])),
			selectedKeys: props.selectedKeys || []
		})
	}, [props.expandedKeys, props.selectedKeys])

	return (
		<div>
			{treeData.length ? (
				<Tree
					blockNode
					titleRender={titleRender}
					treeData={treeData}
					expandedKeys={treeReactive.expandedKeys}
					selectedKeys={treeReactive.selectedKeys}
					onExpand={onExpand}
				/>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
			)}
		</div>
	);
}

export default CatalogueTree;
