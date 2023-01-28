import React from 'react'
import './index.less'

const Index = (props: any) => {
	return (
		<div className='gboss-content'>
			{props.children}
		</div>
	)
}

export default Index