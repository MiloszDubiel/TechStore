import { connection } from "../config/db.config";

export const createReportService = async (data: any) => {
  const [result]: any = await connection.query(
    `
    INSERT INTO product_reports
    (
        product_id,
        reporter_id,
        reason,
        description
    )
    VALUES (?, ?, ?, ?)
    `,
    [data.product_id, data.reporterId, data.reason, data.description],
  );

  const [rows]: any = await connection.query(
    `
    SELECT *
    FROM product_reports
    WHERE id=?
    `,
    [result.insertId],
  );

  return rows[0];
};

export const getReportsService = async () => {
  const [rows] = await connection.query(
    `
    SELECT

        pr.*,

        p.name AS product_name,

        u.email,

        u.first_name,
        u.last_name

    FROM product_reports pr

    JOIN products p
        ON p.id = pr.product_id

    JOIN users u
        ON u.id = pr.reporter_id

    ORDER BY pr.created_at DESC
    `,
  );

  return rows;
};
export const getReportService = async (id: string) => {
  const [rows]: any = await connection.query(
    `
    SELECT *

    FROM product_reports

    WHERE id=?
    `,
    [id],
  );

  return rows[0];
};
export const updateReportStatusService = async (id: string, status: string) => {
  await connection.query(
    `
    UPDATE product_reports
    SET status=?
    WHERE id=?
    `,
    [status, id],
  );
};
export const deleteReportService = async (id: string) => {
  await connection.query(
    `
    DELETE
    FROM product_reports
    WHERE id=?
    `,
    [id],
  );
};
