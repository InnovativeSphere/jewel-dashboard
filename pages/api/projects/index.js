import { verifyToken } from "../../lib/auth";
import ProjectsController from '../../../backend/controllers/projectsController'

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      // GET /api/projects - fetch all projects
      case "GET": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const projects = await ProjectsController.getAllProjects();
        return res.status(200).json(projects);
      }

      // POST /api/projects - create a new project
      case "POST": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const body = req.body;
        const newProject = await ProjectsController.createProject(body);
        return res
          .status(201)
          .json({ message: "Project created", id: newProject });
      }

      // PUT /api/projects - update project
      case "PUT": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id, ...updateData } = req.body;
        if (!id)
          return res.status(400).json({ error: "Project ID is required" });

        const updated = await ProjectsController.updateProject(id, updateData);
        if (!updated)
          return res
            .status(404)
            .json({ error: "Project not found or nothing to update" });

        return res
          .status(200)
          .json({ message: "Project updated", affectedRows: updated });
      }

      // DELETE /api/projects - delete project
      case "DELETE": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id: deleteId } = req.body;
        if (!deleteId)
          return res.status(400).json({ error: "Project ID is required" });

        const deleted = await ProjectsController.deleteProject(deleteId);
        if (!deleted)
          return res.status(404).json({ error: "Project not found" });

        return res
          .status(200)
          .json({ message: "Project deleted", affectedRows: deleted });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
