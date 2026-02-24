import UserController from "../../../backend/controllers/userController";
import { verifyToken } from "../../../backend/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      // GET /api/users - Protected
      case "GET": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const users = await UserController.getAllUsers();
        return res.status(200).json(users);
      }

      // POST /api/users
      case "POST": {
        const body = req.body;

        // 1️⃣ LOGIN (PUBLIC)
        if (body.email && body.password && !body.first_name && !body.last_name) {
          try {
            const data = await UserController.login(body);
            return res.status(200).json(data);
          } catch (err) {
            return res.status(400).json({ error: err.message });
          }
        }

        // 2️⃣ CREATE USER (PROTECTED)
        const authUser = verifyToken(req);
        if (!authUser) return res.status(401).json({ error: "Unauthorized" });

        const requiredFields = ["first_name", "last_name", "email", "username", "password"];
        for (let field of requiredFields) {
          if (!body[field]) {
            return res.status(400).json({ error: `${field} is required` });
          }
        }

        const newUser = await UserController.createUser({
          ...body,
          is_active: 1,
        });

        return res.status(201).json({ message: "User created", id: newUser });
      }

      // PUT /api/users - Protected
      case "PUT": {
        const authUser = verifyToken(req);
        if (!authUser) return res.status(401).json({ error: "Unauthorized" });

        const { id, ...updateData } = req.body;
        if (!id) return res.status(400).json({ error: "User ID is required" });

        const updated = await UserController.updateUser(id, updateData);
        if (!updated)
          return res.status(404).json({ error: "User not found or nothing to update" });

        return res.status(200).json({ message: "User updated", affectedRows: updated });
      }

      // DELETE /api/users - Protected
      case "DELETE": {
        const authUser = verifyToken(req);
        if (!authUser) return res.status(401).json({ error: "Unauthorized" });

        const { id: deleteId } = req.body;
        if (!deleteId) return res.status(400).json({ error: "User ID is required" });

        const deleted = await UserController.deleteUser(deleteId);
        if (!deleted) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ message: "User deleted", affectedRows: deleted });
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
