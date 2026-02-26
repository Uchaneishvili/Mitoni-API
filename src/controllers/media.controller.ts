import type { Request, Response } from "express";
import { HttpResponse } from "../utils/HttpResponse";
import { AppError } from "../utils/AppError";

export class MediaController {
  static async upload(req: Request, res: Response) {
    if (!req.file) {
      throw AppError.badRequest("No file uploaded");
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    HttpResponse.ok(res, {
      url: fileUrl,
      mediaId: req.file.filename,
    });
  }
}
