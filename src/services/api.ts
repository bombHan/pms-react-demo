import {request} from '@pms/react-utils';



export async function findToken<T>() {
  return request<T>(`/proxy/auth`, {
    method: 'POST',
  });
}
export async function findProxyUrl<T>() {
  return request<T>(`/proxy/url`, {
    method: 'GET'
  });
}


