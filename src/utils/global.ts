export function getProxyUrl() {
	return window.localStorage.getItem('gboss-proxyUrl');
}

export function setRoutePath(value: string) {
	return window.localStorage.setItem('gboss-routePath', value);
}
export function getRoutePath() {
	return window.localStorage.getItem('gboss-routePath');
}

export function closeGunbossModal(key: string = 'gbossModal') {
	const pp: any = window.parent.parent
	const modal = pp[key]
	// console.log(key, pp.layer)
	pp.layer && pp.layer.close(modal)
}

export function postMessage(data: any) {
	const pp: any = window.parent.parent
	pp && pp.postMessage(data, '*');
}
