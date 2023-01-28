import {setRoutePath} from '@/utils/global';

export async function render(oldRender: any) {
  oldRender()
}

export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log('app bootstrap');
  },
  // 应用 render 之前触发
  async mount(props: any) {
    setRoutePath(props?.search);
    console.log('app mount');
  },
  // 增加 update 钩子以便主应用手动更新微应用
  async update(props: any) {
    console.log('app update');
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log('app unmount');
  },
};
