import db from "../../pages/lib/db";

const ProjectsController = {
  // CREATE a new project
  createProject: async ({ title, description, start_date, end_date }) => {
    const sql = `
      INSERT INTO projects (title, description, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      title,
      description,
      start_date,
      end_date,
    ]);
    return result.insertId;
  },

  // READ all projects
  getAllProjects: async () => {
    const [rows] = await db.execute(
      "SELECT id, title, description, start_date, end_date, created_at, updated_at FROM projects",
    );
    return rows;
  },

  // READ single project by ID
  getProjectById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id, title, description, start_date, end_date, created_at, updated_at FROM projects WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  // UPDATE project by ID
  updateProject: async (id, { title, description, start_date, end_date }) => {
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (start_date !== undefined) {
      fields.push("start_date = ?");
      values.push(start_date);
    }
    if (end_date !== undefined) {
      fields.push("end_date = ?");
      values.push(end_date);
    }

    if (fields.length === 0) return null; // nothing to update

    const sql = `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  // DELETE project by ID
  deleteProject: async (id) => {
    const [result] = await db.execute("DELETE FROM projects WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

export default ProjectsController;
