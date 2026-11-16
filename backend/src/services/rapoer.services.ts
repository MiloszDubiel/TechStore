import { prisma } from "../lib/prisma";

export const createReportService = async (data: any) => {
  return await prisma.productReport.create({
    data: {
      productId: Number(data.product_id),
      reporterId: Number(data.reporterId),
      reason: data.reason,
      description: data.description,
    },
  });
};

export const getReportsService = async () => {
  const reports = await prisma.productReport.findMany({
    include: {
      product: {
        select: {
          name: true,
        },
      },
      reporter: {
        select: {
          email: true,
          name: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reports.map((report) => ({
    ...report,
    product_name: report.product.name,
    email: report.reporter.email,
    first_name: report.reporter.name,
    last_name: report.reporter.lastName,
    product: undefined,
    reporter: undefined,
  }));
};

export const getReportService = async (id: string) => {
  return await prisma.productReport.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const updateReportStatusService = async (id: string, status: string) => {
  await prisma.productReport.update({
    where: {
      id: Number(id),
    },
    data: {
      status: status as any,
    },
  });
};

export const deleteReportService = async (id: string) => {
  await prisma.productReport.delete({
    where: {
      id: Number(id),
    },
  });
};
