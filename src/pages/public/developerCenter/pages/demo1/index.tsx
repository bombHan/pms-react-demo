import React, { useState, useEffect } from 'react'
import './index.less'
import { ProcessButton } from './ProcessButton'
import { Button } from 'antd'

const Demo1 = () => {
	let timer: any = null
	const [p, setp] = useState(0);
	useEffect(() => {
		console.log(p)
		if (p > 0) {
			setTimeout(() => {
				if (p < 100) {
					setp(p + 5 > 100 ? 0 : p + 5);
				}
			}, 300);
		}
	}, [p]);
	return (
		<div className='demo'>
			<div className='item'>
				<h2>组件1：左侧树状菜单模糊搜索高亮</h2>
				<a href='https://github.com/bombHan/pms-react-demo/blob/main/src/pages/public/developerCenter/components/Menu.tsx'>源码链接</a>
			</div>

			<div className="item">
				<h2>组件2：进度条按钮</h2>
				<Button
					disabled={p > 0 && p < 100}
					onClick={() => {
						setp(5);
					}}
				>
					点我
				</Button>
				以下主要用于socket长连文件导入状态显示
				<br />
				<ProcessButton process={p} text="超级导入中" />
			</div>

		</div>
	)
}

export default Demo1