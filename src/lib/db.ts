import Database from "@tauri-apps/plugin-sql";

let dbInstance: Awaited<ReturnType<typeof Database.load>> | null = null;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:app.db");
  }
  return dbInstance;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  name: string;
  email: string;
  role?: "admin" | "editor" | "viewer";
  status?: "active" | "inactive";
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

export const queries = {
  users: {
    findAll: async (): Promise<User[]> => {
      try {
        const database = await getDb();
        return database.select<User[]>("SELECT * FROM users ORDER BY created_at DESC");
      } catch (error) {
        console.error("findAll error:", error);
        throw error;
      }
    },

    findById: async (id: string): Promise<User | null> => {
      try {
        const database = await getDb();
        const results = await database.select<User[]>("SELECT * FROM users WHERE id = $1", [id]);
        return results[0] || null;
      } catch (error) {
        console.error("findById error:", error);
        throw error;
      }
    },

    create: async (user: NewUser): Promise<User> => {
      try {
        const database = await getDb();
        const id = generateId();
        const now = new Date().toISOString();
        const role = user.role || "viewer";
        const status = user.status || "active";

        console.log("Creating user:", { id, name: user.name, email: user.email, role, status, now });

        await database.execute(
          "INSERT INTO users (id, name, email, role, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [id, user.name, user.email, role, status, now, now]
        );

        console.log("User created successfully");

        return {
          id,
          name: user.name,
          email: user.email,
          role,
          status,
          created_at: now,
          updated_at: now,
        };
      } catch (error) {
        console.error("create error:", error);
        throw error;
      }
    },

    update: async (id: string, data: Partial<NewUser>): Promise<void> => {
      try {
        const database = await getDb();
        const now = new Date().toISOString();
        const fields: string[] = ["updated_at = $1"];
        const values: (string | undefined)[] = [now];
        let paramIndex = 2;

        if (data.name !== undefined) {
          fields.push(`name = $${paramIndex++}`);
          values.push(data.name);
        }
        if (data.email !== undefined) {
          fields.push(`email = $${paramIndex++}`);
          values.push(data.email);
        }
        if (data.role !== undefined) {
          fields.push(`role = $${paramIndex++}`);
          values.push(data.role);
        }
        if (data.status !== undefined) {
          fields.push(`status = $${paramIndex++}`);
          values.push(data.status);
        }

        values.push(id);
        await database.execute(
          `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramIndex}`,
          values
        );
      } catch (error) {
        console.error("update error:", error);
        throw error;
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        const database = await getDb();
        await database.execute("DELETE FROM users WHERE id = $1", [id]);
      } catch (error) {
        console.error("delete error:", error);
        throw error;
      }
    },
  },
  settings: {
    findAll: async (): Promise<Setting[]> => {
      try {
        const database = await getDb();
        return database.select<Setting[]>("SELECT * FROM settings ORDER BY key");
      } catch (error) {
        console.error("settings.findAll error:", error);
        throw error;
      }
    },

    findByKey: async (key: string): Promise<Setting | null> => {
      try {
        const database = await getDb();
        const results = await database.select<Setting[]>("SELECT * FROM settings WHERE key = $1", [key]);
        return results[0] || null;
      } catch (error) {
        console.error("settings.findByKey error:", error);
        throw error;
      }
    },

    upsert: async (key: string, value: string): Promise<void> => {
      try {
        const database = await getDb();
        const now = new Date().toISOString();
        await database.execute(
          `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, $3)
           ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = $3`,
          [key, value, now]
        );
      } catch (error) {
        console.error("settings.upsert error:", error);
        throw error;
      }
    },

    delete: async (key: string): Promise<void> => {
      try {
        const database = await getDb();
        await database.execute("DELETE FROM settings WHERE key = $1", [key]);
      } catch (error) {
        console.error("settings.delete error:", error);
        throw error;
      }
    },
  },
};
