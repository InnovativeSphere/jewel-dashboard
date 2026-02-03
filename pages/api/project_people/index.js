import ProjectPeopleController from "../../../backend/controllers/projectsPeopleController";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {

      // GET /api/project_people - list all links
      case "GET":
        {
          const user = verifyToken(req);
          if (!user) return res.status(401).json({ error: "Unauthorized" });

          const { project_id, person_id } = req.query;
          const filter = {};
          if (project_id) filter.project_id = project_id;
          if (person_id) filter.person_id = person_id;

          const links = await ProjectPeopleController.getAllProjectPeople(filter);
          return res.status(200).json(links);
        }

      // POST /api/project_people - assign person to project
      case "POST":
        {
          const user = verifyToken(req);
          if (!user) return res.status(401).json({ error: "Unauthorized" });

          const body = req.body;
          const newLink = await ProjectPeopleController.addPersonToProject(body);
          return res.status(201).json({ message: "Person assigned to project", id: newLink });
        }

      // DELETE /api/project_people - remove link
      case "DELETE":
        {
          const user = verifyToken(req);
          if (!user) return res.status(401).json({ error: "Unauthorized" });

          const { id } = req.body;
          if (!id) return res.status(400).json({ error: "Link ID is required" });

          const deleted = await ProjectPeopleController.removePersonFromProject(id);
          if (!deleted) return res.status(404).json({ error: "Link not found" });

          return res.status(200).json({ message: "Person removed from project", affectedRows: deleted });
        }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
