export default (api: any, opt: any) => {
  api.onDevCompileDone((data: any) => {
    const {isFirstCompile} = data;
    const {environment} = opt;
    if (isFirstCompile) {
      console.log(`> 打开 https://local.zz-test02.pinming.org:8000`)
    }
  });
}
