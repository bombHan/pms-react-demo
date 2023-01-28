const paramCategoryList = {
  data: [
    {
      categoryName: '一级分类1',
      paramCategoryId: 1,
    },
    {
      categoryName: '一级分类2',
      paramCategoryId: 2,
    },
  ]
}

const paramCategoryDetail = {
  data: {
    type: 1,
    categoryName: '插件1',
  }
}

const plugList = {
  data: [
    {categoryName: '插件1', categoryId: 1},
    {categoryName: '插件2', categoryId: 2},
  ]
}

const findListByCategoryId = {
  data: {
    dataList: [
      {plugNo: 'ying', plugName: '应用1'},
      {plugNo: 'ying', plugName: '应用2'}
    ]
  }
}

export default {
  'POST /api/gateway/cn.pinming.microservice.config.center.api.ParamConfigCategoryService/paramCategoryList': paramCategoryList,
  'POST /api/gateway/cn.pinming.microservice.config.center.api.ParamConfigCategoryService/paramCategoryDetail': paramCategoryDetail,
  'POST /api/gateway/cn.pinming.zhuang.api.plug.service.PlugCategoryService/findList': plugList,
  'POST /api/gateway/cn.pinming.v2.common.api.service.PlugService/findListByCategoryId': findListByCategoryId,
};
