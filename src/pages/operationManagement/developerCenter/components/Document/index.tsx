import React, { useEffect, useRef } from 'react';
import { message, Button, Spin } from 'antd';
import { useSetReactive } from '@pms/middleground-share';
import { useGunbossFunAuth } from '@pms/gboss';
import SeeDocument from './components/SeeDocument';
import EditDocument from './components/EditDocument';
import { findDocumentContent, updateDocument } from '../../servers/api';
import { CatalogueProps } from '../../type';
import './index.less';

interface DocumentProps {
	curCatalogue: CatalogueProps
}

function Document(props: DocumentProps) {
	const { curCatalogue } = props;
	const documentRef = useRef()

	const auth = useGunbossFunAuth({
		'/developerOperate': { value: '操作', status: false },
	});

	const [editorReactive, setEditorReactive] = useSetReactive({
		html: '',
		isEdit: false,
		loading: false
	});

	// 获取文档内容
	const getDocumentContent = async () => {
		if (!curCatalogue.documentId) {
			return;
		}
		changeLoading(true)
		const res = await findDocumentContent(curCatalogue.documentId);
		changeLoading(false)
		editorReactive.html = res.data;
	};

	const changeLoading = (val: boolean) => {
		editorReactive.loading = val
	}

	// 右上角保存或者编辑
	const saveOrEdit = async () => {
		// 目前只能判断第一行空，多个换行不可判断，会提交
		// getText()方法只能在有文字输入的时候才能判断，图片不行
		if (editorReactive.isEdit) {
			// if (editor!.isEmpty()) {
			//   message.error('请输入内容');
			//   return;
			// }
			// 保存最新的文档
			// @ts-ignore
			editorReactive.html = documentRef.current?.html;
			let params: any = {
				documentId: curCatalogue.documentId,
				documentName: curCatalogue.documentName,
				remark: curCatalogue.remark,
				type: 2,
				content: editorReactive.html,
			};
			const res = await updateDocument(params);
			if (!res.success) {
				message.error('保存失败');
				return;
			}
			message.success('保存成功');
			console.log('保存html', editorReactive.html);
		}
		editorReactive.isEdit = !editorReactive.isEdit;
	};

	useEffect(() => {
		// 切换文档的时候清除一下内容再获取，不然浏览了其他有vedio的文档会有bug
		setEditorReactive({
			isEdit: false,
		});
		getDocumentContent();
		// 新增的目录时，将编辑器转为编辑状态
		if (curCatalogue?.showEdit) {
			setEditorReactive({
				html: '',
				isEdit: curCatalogue?.showEdit
			})
		}
	}, [curCatalogue]);

	return (
		<Spin spinning={editorReactive.loading}>
			<div className="edit-container">
				<div>
					<div className="title-box">
						<span className="left-title">{curCatalogue ? curCatalogue.documentName : ''}</span>
						{auth['/developerOperate']?.status && (
							<Button type="primary" onClick={saveOrEdit}>
								{editorReactive.isEdit ? '保存' : '编辑'}
							</Button>
						)}
					</div>
					<div className="margin-top-15">
						{editorReactive.isEdit ? (
							<EditDocument ref={documentRef} html={editorReactive.html} changeLoading={changeLoading} />
						) : (
							<SeeDocument html={editorReactive.html} />
						)}
					</div>
				</div>
			</div>
		</Spin>
	);
}

export default Document;
