import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "IntoTheDarknessUnafraid123!", 
  database: "charity_platform",
});

export default pool;
