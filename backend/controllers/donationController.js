// controllers/donationsController.js
import db from "../../pages/lib/db"; // your MySQL connection

const DonationsController = {
  // ADD a new donation
  addDonation: async ({ project_id, donor_name, amount }) => {
    const sql = `
      INSERT INTO donations (project_id, donor_name, amount)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(sql, [project_id, donor_name, amount]);
    return result.insertId;
  },

  // GET all donations (optionally filter by project)
  getAllDonations: async (project_id) => {
    let sql = `
      SELECT d.id, d.project_id, d.donor_name, d.amount, d.donation_date, d.created_at,
             p.title AS project_title
      FROM donations d
      JOIN projects p ON d.project_id = p.id
    `;
    const values = [];
    if (project_id) {
      sql += " WHERE d.project_id = ?";
      values.push(project_id);
    }
    const [rows] = await db.execute(sql, values);
    return rows;
  },

  // UPDATE a donation by ID
  updateDonation: async (id, { project_id, donor_name, amount }) => {
    const fields = [];
    const values = [];

    if (project_id !== undefined) {
      fields.push("project_id = ?");
      values.push(project_id);
    }
    if (donor_name !== undefined) {
      fields.push("donor_name = ?");
      values.push(donor_name);
    }
    if (amount !== undefined) {
      fields.push("amount = ?");
      values.push(amount);
    }

    if (fields.length === 0) return null; // nothing to update

    const sql = `UPDATE donations SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  // DELETE a donation by ID
  deleteDonation: async (id) => {
    const [result] = await db.execute("DELETE FROM donations WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },

  // CUSTOM: Group donations by amount ranges
  groupDonationsByAmount: async () => {
    const sql = `
      SELECT
        CASE
          WHEN amount BETWEEN 0 AND 50 THEN '0-50'
          WHEN amount BETWEEN 51 AND 100 THEN '51-100'
          WHEN amount BETWEEN 101 AND 500 THEN '101-500'
          WHEN amount > 500 THEN '500+'
        END AS amount_range,
        COUNT(*) AS total_donations,
        SUM(amount) AS total_amount
      FROM donations
      GROUP BY amount_range
      ORDER BY amount_range
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // CUSTOM: Sum of donations per project
  totalDonationsPerProject: async () => {
    const sql = `
      SELECT d.project_id, p.title AS project_title, SUM(d.amount) AS total_donated
      FROM donations d
      JOIN projects p ON d.project_id = p.id
      GROUP BY d.project_id
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },
};

export default DonationsController;
