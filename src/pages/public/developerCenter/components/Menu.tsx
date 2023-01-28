import React, { useState, useEffect } from 'react'
import { Menu as AntdMenu, Input } from 'antd'
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
	}, 500)
	const onSelect = (e: any) => {
		const selectedMenu = findTarget(menuTree, e.selectedKeys[0])
		// console.log(e, e.selectedKeys, selectedMenu)
		settreeParams({
			selectedKeys: e.selectedKeys,
			selectedMenu
		})
		push(e.selectedKeys[0])
	}
	const getTreeData = async () => {
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

	const push = (url: string, title?: string) => {
		window.location.assign(`${window.location.pathname}#${url}`);
	};

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
			<AntdMenu
				theme={'dark'}
				openKeys={treeParams.openKeys}
				selectedKeys={treeParams.selectedKeys}
				onSelect={onSelect}
				onOpenChange={(openKeys) => { treeParams.openKeys = openKeys }}
				style={{ width: '100%', height: '100%', border: 'none' }}
				mode="inline"
				items={menuTree}
			/>
		</div>
	)
}

export default Menu