import React from 'react'
import './index.less'
import { getCurrentTitle } from '@/utils/routesUtils'

const Index = () => {
	return (
		<div className='gboss-header'>
			<div className="gboss-header-title">{getCurrentTitle()}</div>
		</div>
	)
}

export default Index