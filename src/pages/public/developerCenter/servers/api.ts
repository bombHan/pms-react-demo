import { request, getProxyUrl } from '@pms/gboss';

const gateway = '/api/gateway/cn.pinming.micorservice.developdocument.api.service.DocumentBackService'

// 获取目录列表
export async function findDocumentsList () {
	return request(`${getProxyUrl()}${gateway}/findDocuments`, {
		method: 'POST',
		data: {
			"parameters": [
			]
		}
	});
}

// 新增分类-目录
export async function saveDocument(data: any) {
	return request(`${getProxyUrl()}${gateway}/saveDocument`, {
		method: 'POST',
		data: {
			"parameters": [
				data
			]
		}
	});
}

// 删除分类-目录
export async function delDocument(data: any) {
	return request(`${getProxyUrl()}${gateway}/delDocument`, {
		method: 'POST',
		data: {
			"parameters": [
				data
			]
		}
	});
}

// 编辑分类-目录
export async function updateDocument(data: any) {
	return request(`${getProxyUrl()}${gateway}/updateDocument`, {
		method: 'POST',
		data: {
			"parameters": [
				data
			]
		}
	});
}

// 查询文档内容
export async function findDocumentContent(data: any) {
	return request(`${getProxyUrl()}${gateway}/findContent`, {
		method: 'POST',
		data: {
			"parameters": [
				data
			]
		}
	});
}