// controllers/userController.js
import db from "../../pages/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const TOKEN_EXPIRY = "2h";

const UserController = {
  // CREATE USER
  createUser: async ({
    first_name,
    last_name,
    email,
    username,
    password,
    role = "admin",
    is_active = 1, // ensure new users are active
  }) => {
    const password_hash = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (first_name, last_name, email, username, password_hash, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      first_name,
      last_name,
      email,
      username,
      password_hash,
      role,
      is_active,
    ]);
    return result.insertId;
  },

  // READ all users
  getAllUsers: async () => {
    const [rows] = await db.execute(
      "SELECT id, first_name, last_name, email, username, role, is_active, created_at, updated_at FROM users",
    );
    return rows;
  },

  // READ single user by ID
  getUserById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id, first_name, last_name, email, username, role, is_active, created_at, updated_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  // UPDATE user by ID
  updateUser: async (
    id,
    { first_name, last_name, email, username, password, role, is_active },
  ) => {
    const fields = [];
    const values = [];

    if (first_name !== undefined) {
      fields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push("last_name = ?");
      values.push(last_name);
    }
    if (email !== undefined) {
      fields.push("email = ?");
      values.push(email);
    }
    if (username !== undefined) {
      fields.push("username = ?");
      values.push(username);
    }
    if (password !== undefined) {
      const password_hash = await bcrypt.hash(password, 10);
      fields.push("password_hash = ?");
      values.push(password_hash);
    }
    if (role !== undefined) {
      fields.push("role = ?");
      values.push(role);
    }
    if (is_active !== undefined) {
      fields.push("is_active = ?");
      values.push(is_active);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  // DELETE user by ID
  deleteUser: async (id) => {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  },

  // LOGIN (NO 401 FOR EXISTING USERS)
  login: async ({ email, password }) => {
    // fetch user by email
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = rows[0];
    if (!user) throw new Error("User not found");

    // optional: if you want to enforce inactive users later
    // if (user.is_active === 0) throw new Error("User is inactive");

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new Error("Invalid password");

    // generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY },
    );

    return {
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    };
  },

  // LOGOUT
  logout: async () => {
    return { message: "Logout successful" };
  },
};

export default UserController;
