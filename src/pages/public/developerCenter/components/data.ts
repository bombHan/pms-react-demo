export const menuTreeData = {
	"success": true,
	"data": [
		{
			"children": [
				{
					"documentId": '1-1',
					"documentName": "分类1-1",
					"type": 1,
					"parentId": 1,
					"children": [
						{
							"documentId": '/public/developerCenter/demo1',
							"documentName": "一些有趣小组件",
							"type": 2,
							"parentId": '1-1'
						},
					]
				},
				{
					"documentId": '/public/developerCenter/demo2',
					"documentName": "用class类封装二维码登录",
					"type": 2,
					"parentId": '1'
				},
				{
					"documentId": '/public/developerCenter/demo3',
					"documentName": "左右拖拽展开隐藏",
					"type": 2,
					"parentId": '1'
				},
			],
			"remark": "1",
			"documentId": 1,
			"documentName": "分类1",
			"type": 1
		},
		{
			"children": [
				{
					"documentId": '/public/developerCenter/demo11',
					"documentName": "demo11",
					"type": 2,
					"parentId": 2
				},
			],
			"remark": "2",
			"documentId": 2,
			"documentName": "分类2",
			"type": 1
		},
	]
}