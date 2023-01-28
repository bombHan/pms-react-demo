import routes from "../../config/.umire.routes"

export const findRoute = (list: any[]) => {
	let currentRoute: any = {}
	const nowHash = window.location.hash.includes('#') ? window.location.hash.split('#')[1] : window.location.hash
	const nowPath = nowHash.includes('?') ? nowHash.split('?')[0] : nowHash
	// console.log('nowPath', nowPath)
	list.forEach((item: any) => {
		if (nowPath === item.path || nowPath === `/developer-center${item.path}`) {
			currentRoute = item
		}
		if (item.routes) {
			if (findRoute(item.routes) && findRoute(item.routes).path) {
				currentRoute = findRoute(item.routes)
			}
		}
	})
	return currentRoute
}


// 获取当前路由模块
export const findCurrentRoute = () => {
	return findRoute(routes)
}

export const getCurrentTitle = () => {
	const currentTitle = findCurrentRoute()
	return currentTitle.title
}

// 是否渲染头部
export const renderHeader = () => {
	let render = true
	const currentRoute = findCurrentRoute()
	// console.log('currentRoute', currentRoute)
	// 非页面的不需要显示header
	if (!currentRoute.isPage) {
		render = false
	}
	if (currentRoute?.path?.includes('/4') || currentRoute?.path?.includes('/5')) {
		render = false
	}
	return render
}

// 是否渲染根部节点样式
export const renderRootStyle = () => {
	let render = true
	const currentRoute = findCurrentRoute()
	// 非页面的不需要root节点上的原生样式
	if (!currentRoute.isPage) {
		render = false
	}
	return render
}

// 判断是否为公共页面，用于判断走无须登录的框架
export const isPublicPage = () => {
	let flag = false
	const publicList = ['/public', '/40', '/50']
	publicList.forEach((item) => {
		if (window.location.href.includes(item)) {
			flag = true
		}
	})
	return flag
}

export { routes }