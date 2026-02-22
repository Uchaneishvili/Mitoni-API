import type { Response } from "express";

interface ResponsePayload<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export class HttpResponse {
  static ok<T>(res: Response, data?: T, message?: string): Response {
    return res.status(200).json(HttpResponse.format(true, data, message));
  }

  static created<T>(res: Response, data?: T, message?: string): Response {
    return res.status(201).json(HttpResponse.format(true, data, message));
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  private static format<T>(success: boolean, data?: T, message?: string): ResponsePayload<T> {
    const response: ResponsePayload<T> = { success };
    if (data !== undefined) response.data = data;
    if (message) response.message = message;
    return response;
  }
}

export default HttpResponse;
