import PartnersController from "../../../backend/controllers/partnersController";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      // GET /api/partners - fetch all partners
      case "GET": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const partners = await PartnersController.getAllPartners();
        return res.status(200).json(partners);
      }

      // POST /api/partners - add a new partner
      case "POST": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { name, logo_url, website_url } = req.body;
        if (!name || !logo_url)
          return res
            .status(400)
            .json({ error: "name and logo_url are required" });

        const newId = await PartnersController.addPartner({
          name,
          logo_url,
          website_url,
        });
        return res.status(201).json({ message: "Partner added", id: newId });
      }

      // PUT /api/partners - update a partner
      case "PUT": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id, name, logo_url, website_url } = req.body;
        if (!id)
          return res.status(400).json({ error: "Partner ID is required" });

        const updated = await PartnersController.updatePartner(id, {
          name,
          logo_url,
          website_url,
        });
        if (!updated)
          return res
            .status(404)
            .json({ error: "Partner not found or nothing to update" });

        return res
          .status(200)
          .json({ message: "Partner updated", affectedRows: updated });
      }

      // DELETE /api/partners - delete a partner
      case "DELETE": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.body;
        if (!id)
          return res.status(400).json({ error: "Partner ID is required" });

        const deleted = await PartnersController.deletePartner(id);
        if (!deleted)
          return res.status(404).json({ error: "Partner not found" });

        return res
          .status(200)
          .json({ message: "Partner deleted", affectedRows: deleted });
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
