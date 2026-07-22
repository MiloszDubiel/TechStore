import { Request, Response } from "express";
import {
  createReportService,
  getReportService,
  getReportsService,
  updateReportStatusService,
  deleteReportService,
} from "../services/rapoer.services";

export const createReport = async (req: Request, res: Response) => {
  try {
    const reporterId = (req as any).user.id;

    const report = await createReportService({
      ...req.body,
      reporterId,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: "Nie udało się utworzyć zgłoszenia.",
    });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await getReportsService();

    res.json(reports);
  } catch {
    res.status(500).json({
      message: "Błąd.",
    });
  }
};
export const getReport = async (req: Request, res: Response) => {
  try {
    const report = await getReportService(req.params.id as string);

    res.json(report);
  } catch {
    res.status(500).json({
      message: "Błąd.",
    });
  }
};
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    await updateReportStatusService(req.params.id as string, req.body.status);

    res.json({
      message: "Status został zaktualizowany.",
    });
  } catch {
    res.status(500).json({
      message: "Błąd.",
    });
  }
};
export const deleteReport = async (req: Request, res: Response) => {
  try {
    await deleteReportService(req.params.id as string);

    res.json({
      message: "Usunięto zgłoszenie.",
    });
  } catch {
    res.status(500).json({
      message: "Błąd.",
    });
  }
};
