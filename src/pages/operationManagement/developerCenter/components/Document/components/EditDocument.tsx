import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, i18nGetResources } from '@wangeditor/editor';
import { useUnmount, useCreation } from '@pms/hooks';
import OSSUpload, { getSourceFileUrl } from '@pms/react-upload';
import { useSetReactive } from '@pms/middleground-share';
// import '@wangeditor/editor/dist/css/style.css';
import '@/utils/wangEditor/style.css';

interface EditDocumentProps {
	html: string;
	changeLoading: (val: boolean) => void;
}

type ImgInsertFnType = (url: string, alt?: string, href?: string) => void;
type vedioInsertFnType = (url: string, poster?: string) => void;

const EditDocument = forwardRef((props: EditDocumentProps, ref) => {
	const { html, changeLoading } = props;

	const defaultEditorReactive = {
		html: html,
		isEdit: false,
		loading: false,
		toolbarConfig: {
			// 隐藏表情工具栏，解析会报错
			excludeKeys: ['emotion', 'todo'],
		},
		editorConfig: {
			placeholder: '请输入内容...',
			MENU_CONF: {},
		},
	};

	const [editor, setEditor] = useState<IDomEditor | null>(null);
	const [editorReactive, setEditorReactive] = useSetReactive({ ...defaultEditorReactive });

	useImperativeHandle(ref, () => {
		return {
			html: editorReactive.html
		}
	})

	const onCreated = (editor: IDomEditor) => {
		setEditor(editor);
	};

	// 初始化编辑器相关配置
	const initEditor = () => {
		// 修改工具栏全屏按钮文案：编辑器v5的一个bug，切换全屏或者非全屏文案图标不改变
		i18nGetResources('zh-CN').fullScreen.title = '开启/取消全屏';

		editorReactive.editorConfig.MENU_CONF['uploadImage'] = {
			// base64LimitSize: 5 * 1024,
			// 自定义图片上传
			async customUpload(file: File, insertFn: ImgInsertFnType) {
				const res = await uploadFun(file);
				// 插入文档
				res.map(item => {
					insertFn(item.url as string, '', item.url as string);
				});
			},
		};
		editorReactive.editorConfig.MENU_CONF['uploadVideo'] = {
			// 自定义视频上传
			async customUpload(file: File, insertFn: vedioInsertFnType) {
				const res = await uploadFun(file);
				res.map(item => {
					insertFn(item.url as string);
				});
			},
		};
	};

	// 上传文件
	const uploadFun = async (file: File) => {
		changeLoading(true)
		console.log('file', file);
		const fileUuid = await OSSUpload({
			file,
			gboss: true,
		});
		const fileList: any[] = [{ fileUuid: fileUuid }];
		const res = await getSourceFileUrl(fileList, '', true, true);
		changeLoading(false)
		console.log('getSourceFileUrl', res);
		return res;
	};

	// 销毁编辑器
	const destroyEditor = () => {
		if (editor == null) return;
		setEditorReactive({ ...defaultEditorReactive });
		editor.destroy();
		setEditor(null);
	};

	// 富文本编辑器相关配置
	useCreation(() => {
		initEditor();
	}, []);

	useUnmount(() => {
		destroyEditor();
	});

	return (
		<div
			style={{
				border: '1px solid #ccc',
				zIndex: 100,
			}}
		>
			<Toolbar
				editor={editor}
				defaultConfig={editorReactive.toolbarConfig}
				mode="default"
				style={{ borderBottom: '1px solid #ccc' }}
			/>
			<Editor
				className="docuemnt-editor"
				defaultConfig={editorReactive.editorConfig}
				value={editorReactive.html}
				onCreated={onCreated}
				onChange={(editor: IDomEditor) => (editorReactive.html = editor.getHtml())}
				mode="default"
				style={{ height: '600px', overflowY: 'hidden' }}
			/>
		</div>
	);
})

export default EditDocument;
