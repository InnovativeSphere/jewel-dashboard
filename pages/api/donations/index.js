import DonationsController from "../../../backend/controllers/donationController";
import { verifyToken } from "../../../backend/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      // GET /api/donations - fetch all donations or filter by project
      case "GET": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { project_id, custom } = req.query;

        // Custom endpoints
        if (custom === "group_by_amount") {
          const grouped = await DonationsController.groupDonationsByAmount();
          return res.status(200).json(grouped);
        }
        if (custom === "total_per_project") {
          const totals = await DonationsController.totalDonationsPerProject();
          return res.status(200).json(totals);
        }

        const donations = await DonationsController.getAllDonations(project_id);
        return res.status(200).json(donations);
      }

      // POST /api/donations - add a new donation
      case "POST": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { project_id, donor_name, amount } = req.body;
        if (!project_id || amount === undefined)
          return res
            .status(400)
            .json({ error: "project_id and amount are required" });

        const newId = await DonationsController.addDonation({
          project_id,
          donor_name,
          amount,
        });
        return res.status(201).json({ message: "Donation added", id: newId });
      }

      // PUT /api/donations - update donation
      case "PUT": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id, project_id, donor_name, amount } = req.body;
        if (!id)
          return res.status(400).json({ error: "Donation ID is required" });

        const updated = await DonationsController.updateDonation(id, {
          project_id,
          donor_name,
          amount,
        });
        if (!updated)
          return res
            .status(404)
            .json({ error: "Donation not found or nothing to update" });

        return res
          .status(200)
          .json({ message: "Donation updated", affectedRows: updated });
      }

      // DELETE /api/donations - remove donation
      case "DELETE": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.body;
        if (!id)
          return res.status(400).json({ error: "Donation ID is required" });

        const deleted = await DonationsController.deleteDonation(id);
        if (!deleted)
          return res.status(404).json({ error: "Donation not found" });

        return res
          .status(200)
          .json({ message: "Donation deleted", affectedRows: deleted });
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
