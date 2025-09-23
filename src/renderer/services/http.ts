import { IRequest, IServerResponse } from '../../common/constants';
const ipcRenderer = window.electron.ipcRenderer

const ipcInvoker = async (path: string, data: IRequest = {}): Promise<IServerResponse> => {
  const payload: IRequest = {
    params: data.params || {},
    query: data.query || {},
    body: data.body || {}
  }
  const res = await ipcRenderer.invoke(path, payload);
  console.log(`PATH === ${path} `, {
    path,
    payload,
    res,
  });
  return res;
}

export const http = {
  get: async (path: string, data: IRequest = {}) => ipcInvoker(`GET:${path}`, data),
  post: async (path: string, data: IRequest = {}) => ipcInvoker(`POST:${path}`, data),
  put: async (path: string, data: IRequest = {}) => ipcInvoker(`PUT:${path}`, data),
  delete: async (path: string, data: IRequest = {}) => ipcInvoker(`DELETE:${path}`, data)
}
