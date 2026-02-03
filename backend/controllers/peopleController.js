import db from "../../pages/lib/db";

const PeopleController = {
  // CREATE a new person
  createPerson: async ({
    first_name,
    last_name,
    bio,
    type,
    photo_url,
    is_active = true,
  }) => {
    // Validate required fields
    if (!first_name || !last_name || !type) {
      throw new Error("first_name, last_name, and type are required");
    }

    const sql = `
      INSERT INTO people (first_name, last_name, bio, type, photo_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      first_name,
      last_name,
      bio ?? null, // ensure no undefined
      type,
      photo_url ?? null, // ensure no undefined
      is_active ?? true, // default to true
    ]);

    return result.insertId; // returns new person ID
  },

  // READ all people
  getAllPeople: async () => {
    const [rows] = await db.execute(
      "SELECT id, first_name, last_name, bio, type, photo_url, is_active, created_at, updated_at FROM people",
    );
    return rows;
  },

  // READ single person by ID
  getPersonById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id, first_name, last_name, bio, type, photo_url, is_active, created_at, updated_at FROM people WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  // UPDATE person by ID
  updatePerson: async (
    id,
    { first_name, last_name, bio, type, photo_url, is_active },
  ) => {
    const fields = [];
    const values = [];

    // Only update fields that are defined
    if (first_name !== undefined) {
      fields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push("last_name = ?");
      values.push(last_name);
    }
    if (bio !== undefined) {
      fields.push("bio = ?");
      values.push(bio ?? null); // safe null
    }
    if (type !== undefined) {
      fields.push("type = ?");
      values.push(type);
    }
    if (photo_url !== undefined) {
      fields.push("photo_url = ?");
      values.push(photo_url ?? null); // safe null
    }
    if (is_active !== undefined) {
      fields.push("is_active = ?");
      values.push(is_active);
    }

    if (fields.length === 0) return null; // nothing to update

    const sql = `UPDATE people SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  // DELETE person by ID
  deletePerson: async (id) => {
    const [result] = await db.execute("DELETE FROM people WHERE id = ?", [id]);
    return result.affectedRows;
  },
};

export default PeopleController;
