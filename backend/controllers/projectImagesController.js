// controllers/projectImagesController.js
import db from "../../pages/lib/db";

const ProjectImagesController = {
  // ADD images (single or multiple) to a project
  addImagesToProject: async (project_id, images) => {
    if (!Array.isArray(images)) images = [images]; // allow single image object

    const values = images.map((img) => [
      project_id,
      img.image_url,
      img.description,
    ]);
    const sql = `
      INSERT INTO project_images (project_id, image_url, description)
      VALUES ?
    `;
    const [result] = await db.query(sql, [values]);
    return result.affectedRows;
  },

  // GET all images for a project (or all projects)
  getProjectImages: async (project_id) => {
    let sql = `
      SELECT pi.id, pi.project_id, pi.image_url, pi.description, pi.created_at,
             p.title AS project_title
      FROM project_images pi
      JOIN projects p ON pi.project_id = p.id
    `;
    const values = [];
    if (project_id) {
      sql += " WHERE pi.project_id = ?";
      values.push(project_id);
    }

    const [rows] = await db.execute(sql, values);
    return rows;
  },

  // DELETE an image by ID
  deleteProjectImage: async (id) => {
    const [result] = await db.execute(
      "DELETE FROM project_images WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  },
};

export default ProjectImagesController;
