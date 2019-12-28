import { Response } from 'express';

const respond = (res: Response, dataOrMessage: any, statusCode = 200) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    [statusCode < 400 ? 'data' : 'message']: dataOrMessage,
  });
};

export { respond };
