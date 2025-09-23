import { IServerRequest } from '../../common/constants';

const catchIpcHandler = (
  fn: (event: Electron.IpcMainInvokeEvent, data: IServerRequest) => any,
) => {
  return async (event: Electron.IpcMainInvokeEvent, data: any) => {
    let result = {
      data: null,
      error: null,
    };
    await Promise.resolve(fn(event, data))
      .then((data) => {
        result.data = data;
      })
      .catch((err: any) => {
        console.error(err);
        result.error = {
          ...err,
          message: err.message,
        };
      });
    return result;
  };
};

export { catchIpcHandler };
