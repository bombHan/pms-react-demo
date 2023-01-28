import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { saveDocument, updateDocument } from '../../servers/api';
import { useUpdateEffect } from '@pms/hooks';

interface AddOrEditProps {
  addModalReactive: any;
  setAddModalReactive: (newValue: any) => void;
  operateData: any;
  curCatalogue: any;
  onEditSuccess: (curCatalogue?: any) => void;
}

function AddOrEditClaModal(props: AddOrEditProps) {
  const { addModalReactive, setAddModalReactive, operateData, curCatalogue } = props;
  // console.log('operateData', operateData);
  const labelName = addModalReactive.isClassify ? '分类名称' : '目录名称';
  const [form] = Form.useForm();

  const onCancel = () => {
    setAddModalReactive({
      visible: false,
    });
  };

  const handleOk = () => {
    form.validateFields().then(async res => {
      let data;
      let params: any = {
        documentName: res.name,
        type: addModalReactive.isClassify ? 1 : 2,
        remark: res.remark,
      };
      if (addModalReactive.isEdit) {
        // 编辑
        params['documentId'] = operateData?.documentId;
        data = await updateDocument(params);
      } else {
        params['parentId'] = operateData?.documentId;
        // 添加
        data = await saveDocument(params);
      }
      if (data.success) {
        message.success(`${addModalReactive.isEdit ? '编辑' : '新增'}成功`);
        // 新增目录-添加完成之后将添加的目录选中
        if (!addModalReactive.isEdit && !addModalReactive.isClassify) {
          const curCatalogue = { documentId: data.data, documentName: res.name, type: 2, showEdit: true };
          props.onEditSuccess(curCatalogue);
          return;
        }
        if(addModalReactive.isEdit && operateData.documentId === curCatalogue.documentId) {
          const curCatalogue = { ...params };
          props.onEditSuccess(curCatalogue);
        }
      } else {
        message.error(`${addModalReactive.isEdit ? '编辑' : '新增'}失败`);
        return;
      }
      props.onEditSuccess();
    });
  };

  useUpdateEffect(() => {
    if (addModalReactive.isEdit && addModalReactive.visible) {
      form.setFieldsValue({
        name: operateData.title,
        remark: operateData.remark,
      });
    } else {
      form.resetFields();
    }
  }, [addModalReactive.visible]);

  return (
    <Modal
      title={addModalReactive.title}
      visible={addModalReactive.visible}
      onOk={handleOk}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item
          label={labelName}
          name="name"
          extra={'最多支持20个字。'}
          rules={[{ required: true, message: `请输入${labelName}`, type: 'string', whitespace: true }]}
        >
          <Input maxLength={20} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="备注" name="remark" extra={'最多支持120个字。'}>
          <Input.TextArea maxLength={120} autoSize={{ minRows: 5 }} placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddOrEditClaModal;
