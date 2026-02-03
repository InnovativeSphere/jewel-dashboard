import PeopleController from "../../../backend/controllers/peopleController";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      // GET /api/people - fetch all people
      case "GET": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const people = await PeopleController.getAllPeople();
        return res.status(200).json(people);
      }

      // POST /api/people - create new person
      case "POST": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const body = req.body;
        const newPerson = await PeopleController.createPerson(body);
        return res
          .status(201)
          .json({ message: "Person created", id: newPerson });
      }

      // PUT /api/people - update person
      case "PUT": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id, ...updateData } = req.body;
        if (!id)
          return res.status(400).json({ error: "Person ID is required" });

        const updated = await PeopleController.updatePerson(id, updateData);
        if (!updated)
          return res
            .status(404)
            .json({ error: "Person not found or nothing to update" });

        return res
          .status(200)
          .json({ message: "Person updated", affectedRows: updated });
      }

      // DELETE /api/people - delete person
      case "DELETE": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id: deleteId } = req.body;
        if (!deleteId)
          return res.status(400).json({ error: "Person ID is required" });

        const deleted = await PeopleController.deletePerson(deleteId);
        if (!deleted)
          return res.status(404).json({ error: "Person not found" });

        return res
          .status(200)
          .json({ message: "Person deleted", affectedRows: deleted });
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
