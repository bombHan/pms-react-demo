import React, { useEffect } from 'react'
import './index.less'

const Index = (props: any) => {
	useEffect(() => {
		const rootDom = document.getElementById('root-slave')
		if (rootDom) {
			rootDom.style.background = '#fff'
		}
	}, [])

	return (
		<div className='public-root'>
			{props.children}
		</div>
	)
}

export default Index