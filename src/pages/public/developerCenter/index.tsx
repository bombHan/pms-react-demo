import React, { useState } from 'react'
import logosrc from '@/assets/images/logo.png'
import Menu from './components/Menu'
import './index.less'

const Index = (props: any) => {
	const [selectedMenu, setselectedMenu] = useState({})
	return (
		<div className='developer-center'>
			<div className="developer-center-header">
				<div className="developer-center-header-left">
					<img src={logosrc} className='logo' />
					<span className='title'>
						han的demo中心
					</span>
				</div>
			</div>
			<Menu changeSelectedMenu={setselectedMenu} />
			<div className="developer-center-content">
				{/* {JSON.stringify(selectedMenu)} */}
				{props.children}
			</div>
		</div>
	)
}

export default Index