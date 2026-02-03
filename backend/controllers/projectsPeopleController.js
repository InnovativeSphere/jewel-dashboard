import db from "../../pages/lib/db";

const ProjectPeopleController = {
  // CREATE a link between project and person
  addPersonToProject: async ({ project_id, person_id, role_in_project }) => {
    const sql = `
      INSERT INTO project_people (project_id, person_id, role_in_project)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      project_id,
      person_id,
      role_in_project,
    ]);
    return result.insertId;
  },

  // READ all links (optionally filtered by project or person)
  getAllProjectPeople: async (filter = {}) => {
    let sql = `
      SELECT pp.id, pp.project_id, pp.person_id, pp.role_in_project, pp.created_at,
             p.title AS project_title,
             pe.first_name, pe.last_name
      FROM project_people pp
      JOIN projects p ON pp.project_id = p.id
      JOIN people pe ON pp.person_id = pe.id
    `;
    const values = [];
    const conditions = [];

    if (filter.project_id) {
      conditions.push("pp.project_id = ?");
      values.push(filter.project_id);
    }
    if (filter.person_id) {
      conditions.push("pp.person_id = ?");
      values.push(filter.person_id);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const [rows] = await db.execute(sql, values);
    return rows;
  },

  // DELETE a link
  removePersonFromProject: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM project_people WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  },
};

export default ProjectPeopleController;
