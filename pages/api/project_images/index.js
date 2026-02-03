import ProjectImagesController from "../../../backend/controllers/projectImagesController";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    // Verify token for all methods
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    switch (method) {
      // GET /api/project_images
      case "GET": {
        const { project_id } = req.query;
        const images = await ProjectImagesController.getProjectImages(project_id);
        return res.status(200).json(images);
      }

      // POST /api/project_images
      case "POST": {
        const { project_id, images } = req.body;
        if (!project_id || !images)
          return res.status(400).json({ error: "project_id and images are required" });

        const addedCount = await ProjectImagesController.addImagesToProject(
          project_id,
          images
        );
        return res
          .status(201)
          .json({ message: `${addedCount} image(s) added to project` });
      }

      // DELETE /api/project_images
      case "DELETE": {
        // DELETE can send data in body (axios) or query params
        let id = req.body?.id || req.query?.id;
        if (!id) return res.status(400).json({ error: "Image ID is required" });

        const deleted = await ProjectImagesController.deleteProjectImage(id);
        if (!deleted) return res.status(404).json({ error: "Image not found" });

        return res.status(200).json({ message: "Image deleted", affectedRows: deleted });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error("ProjectImages API error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
