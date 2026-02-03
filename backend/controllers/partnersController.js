// controllers/partnersController.js
import db from "../../pages/lib/db";

const PartnersController = {
  // ADD a new partner
  addPartner: async ({ name, logo_url, website_url }) => {
    const sql = `
      INSERT INTO partners (name, logo_url, website_url)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      name,
      logo_url,
      website_url || null,
    ]);
    return result.insertId;
  },

  // GET all partners
  getAllPartners: async () => {
    const sql = `
      SELECT id, name, logo_url, website_url, created_at, updated_at
      FROM partners
      ORDER BY created_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // GET partner by ID
  getPartnerById: async (id) => {
    const sql = `
      SELECT id, name, logo_url, website_url, created_at, updated_at
      FROM partners
      WHERE id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  },

  // UPDATE a partner
  updatePartner: async (id, { name, logo_url, website_url }) => {
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (logo_url !== undefined) {
      fields.push("logo_url = ?");
      values.push(logo_url);
    }
    if (website_url !== undefined) {
      fields.push("website_url = ?");
      values.push(website_url);
    }

    if (fields.length === 0) return null; // nothing to update

    const sql = `UPDATE partners SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  // DELETE a partner
  deletePartner: async (id) => {
    const [result] = await db.execute("DELETE FROM partners WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

export default PartnersController;
