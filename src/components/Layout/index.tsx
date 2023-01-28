/* eslint-disable no-console */
import React from 'react'
import VirtualMenu from '@pms/middleground-virtual-menu'
import { routes, isPublicPage } from '@/utils/routesUtils'
import PublicLayout from '../public/Layout/index'
import GunbossLayout from '../gunboss/Layout/index'

const Index = (props: any) => {

	return (
		<>
			<VirtualMenu routes={routes} />
			{
				isPublicPage()
					? (
						<PublicLayout {...props} />
					)
					: (
						<GunbossLayout {...props} />
					)
			}
		</>
	)
}

export default Index
