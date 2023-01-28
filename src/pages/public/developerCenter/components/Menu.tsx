import React, { useState, useMemo, uesEffect } from 'react'
import { Menu as AntdMenu, Input, Empty } from 'antd'
import { findDocumentsList } from '../servers/api';
import { findDefaultSelected, findLeafLayer, dealTreeData, findTarget } from '@/utils/treeFunction';
import { useSetReactive } from '@pms/middleground-share';
import { useUpdateEffect, useMount } from '@pms/hooks';
import '../index.less'
import { menuTreeData } from './data'
import {
	SearchOutlined,
} from '@ant-design/icons'
import { debounce } from 'lodash'

interface IProps {
	changeSelectedMenu?: (value: any) => void;
}

const Menu = (props: IProps) => {
	const [menuTree, setmenuTree] = useState([])
	const [treeParams, settreeParams] = useSetReactive({
		openKeys: [],
		selectedKeys: [],
		selectedMenu: {}
	})
	const [menufilterText, setmenufilterText] = useState('')
	const changeFilterText = debounce((val: string) => {
		setmenufilterText(val)
	}, 200)

	// 点击选择菜单
	const onSelect = (e: any) => {
		const selectedMenu = findTarget(menuTree, e.selectedKeys[0])
		// console.log(e, e.selectedKeys, selectedMenu)
		settreeParams({
			selectedKeys: e.selectedKeys,
			selectedMenu
		})
		push(e.selectedKeys[0])
	}

	// 初始化获取菜单数据
	const getTreeData = () => {
		// const res = await findDocumentsList();
		const res = menuTreeData
		const treeData = dealTreeData(res.data, { type: 1, treeId: 'root' }, 1, true);
		setmenuTree(treeData)
		const urlArray = window.location.hash.split('#');
		// console.log(urlArray)
		// 默认右边展示第一套分类的第一个目录 
		const defaultSelected = urlArray[1] ? findTarget(treeData, urlArray[1]) : findDefaultSelected(treeData);
		if (defaultSelected?.key) {
			const openKeys = findLeafLayer(treeData, defaultSelected.key, 'key');
			settreeParams({
				openKeys,
				selectedMenu: { ...defaultSelected },
				selectedKeys: [defaultSelected.key],
			})
			push(defaultSelected.key)
		}
		// console.log('treeData', treeData, 'treeParams', treeParams);
	};

	// 路由跳转
	const push = (url: string, title?: string) => {
		window.location.assign(`${window.location.pathname}#${url}`);
	};

	// 过滤菜单方法
	const filterMenu = (
		menuList: any[],
		hasSearchText: boolean,
		searchText: string
	) => {
		let menu: any[] = (menuList || []).map((item) => {
			// console.log(item)
			const newItem = { ...item }
			newItem.data.hasSearchText = hasSearchText
			if (newItem.data.documentName.includes(searchText)) {
				newItem.data.hasSearchText = true
				newItem.data.documentNameRender = searchText
					? newItem.data.documentName
						.split(searchText)
						.join(
							`<span class="developer-center-menu-hight-light">${searchText}</span>`
						)
					: newItem.data.documentName
			}
			let children = []
			if (newItem.children && newItem.children.length > 0) {
				children = filterMenu(
					newItem.children,
					newItem.data.hasSearchText,
					searchText
				)
				if (children.length > 0) {
					newItem.data.hasSearchText = true
				}
			}
			// console.log(hasSearchText, item.documentName, item.documentName.includes(searchText), searchText, item.hasSearchText, item.children.length > 0)
			return {
				...newItem,
				children: children.length > 0 ? children : undefined
			}
		})
		menu = menu.filter((item) => item.data.hasSearchText || hasSearchText)
		return menu
	}

	// 实时获取过滤菜单
	const filterMenuTree = useMemo(() => {
		const tree = filterMenu([...menuTree], false, menufilterText)
		console.log(
			'menuTree',
			menuTree,
			'menufilterText',
			menufilterText
		)
		return tree
	}, [menufilterText, menuTree])

	// 渲染菜单名
	const renderTreeName = (item: any) => {
		// console.log(item)
		if (item.key === treeParams.selectedKeys[0]) {
			return item.label
		} else {
			return item.data.documentNameRender ? (
				<span dangerouslySetInnerHTML={{ __html: item.data.documentNameRender }}></span>
			) : (
				item.label
			)
		}
	}

	// 渲染树状菜单
	const renderSubMenu = (item: any) => {
		if (item.children?.length > 0) {
			return (
				<AntdMenu.SubMenu
					key={item.key}
					// icon={
					// 	<span>
					// 	</span>
					// }
					title={
						<span style={{ marginLeft: 16, color: '#fff' }}>
							{renderTreeName(item)}
						</span>
					}
				>
					{item.children.map((child: any) => renderSubMenu(child))}
				</AntdMenu.SubMenu>
			)
		}
		return (
			<AntdMenu.Item
				key={item.key}
			>
				<span>
					{renderTreeName(item)}
				</span>
			</AntdMenu.Item>
		)
	}

	useUpdateEffect(() => {
		// console.log('变了！！！！！', treeParams.selectedKeys, treeParams.selectedMenu)
		props.changeSelectedMenu && props.changeSelectedMenu(treeParams.selectedMenu)
	}, [treeParams.selectedKeys])

	useMount(() => {
		getTreeData()
	})

	return (
		<div className='developer-center-menu'>
			<div className="developer-center-menu-filter">
				<Input
					// value={menufilterText}
					onChange={(e) => {
						// setmenufilterText(e.target.value)
						changeFilterText(e.target.value)
					}}
					allowClear
					placeholder="输入名称"
					style={{ color: '#fff' }}
					prefix={<SearchOutlined style={{ color: '#fff' }} />}
					bordered={false}
				/>
			</div>
			{
				filterMenuTree.length > 0
					? (
						<AntdMenu
							theme={'dark'}
							openKeys={treeParams.openKeys}
							selectedKeys={treeParams.selectedKeys}
							onSelect={onSelect}
							onOpenChange={(openKeys) => { treeParams.openKeys = openKeys }}
							style={{ width: '100%', height: '100%', border: 'none' }}
							mode="inline"
						// items={filterMenuTree}
						>
							{filterMenuTree.map((item) => renderSubMenu(item))}
						</AntdMenu>
					)
					: (
						<Empty description={(<span style={{ color: '#fff' }}>暂无数据</span>)} />
					)
			}
		</div>
	)
}

export default Menu