let routes: any = [
	{
		path: '/',
		component: './index',
		routes: [
			{
				path: '/',
				redirect: '/public/developerCenter',
			},
			// {
			// 	title: '运营管理',
			// 	path: '/operationManagement',
			// 	routes: [
			// 		{
			// 			path: '/operationManagement/developerCenter',
			// 			title: '开发者中心',
			// 			component: './operationManagement/developerCenter/index.tsx',
			// 			isPage: true
			// 		},
			// 	]
			// },
			{
				title: '公共页面无须登录',
				path: '/public',
				routes: [
					{
						path: '/public/demo',
						title: 'demo',
						component: './public/demo/index.tsx',
						isPage: true
					},
					{
						path: '/public/developerCenter',
						title: 'developerCenter',
						component: './public/developerCenter/index.tsx',
						isPage: true,
						routes: [
							{
								path: '/public/developerCenter',
								redirect: '/public/developerCenter/demo1',
							},
							{
								path: '/public/developerCenter/demo1',
								title: 'Demo1',
								component: './public/developerCenter/pages/demo1/index.tsx',
								isPage: true
							},
							{
								path: '/public/developerCenter/demo2',
								title: 'Demo2',
								component: './public/developerCenter/pages/demo2/index.tsx',
								isPage: true
							},
							{
								path: '/public/developerCenter/demo3',
								title: 'Demo3',
								component: './public/developerCenter/pages/demo3/index.tsx',
								isPage: true
							}
						]
					},
				]
			},
			{
				title: '错误跳转页面',
				path: '/',
				routes: [
					{
						path: '/404',
						title: '404',
						component: './404',
						isPage: true
					},
					{
						path: '/403',
						title: '403',
						component: './403',
						isPage: true
					},
					{
						path: '/500',
						title: '500',
						component: './500',
						isPage: true
					},
				]
			},
		],
	},
];

export default routes
