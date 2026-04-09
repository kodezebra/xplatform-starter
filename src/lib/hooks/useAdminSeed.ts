import { useEffect, useRef } from "react";
import { queries } from "@/lib/db";

const ADMIN_SEED_KEY = "admin_seeded";

/**
 * Seeds a default admin user on first app run.
 * Checks localStorage to avoid re-seeding.
 */
export function useAdminSeed() {
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    async function seed() {
      if (localStorage.getItem(ADMIN_SEED_KEY)) return;

      try {
        const seeded = await queries.auth.seedAdmin();
        if (seeded || !seeded) {
          localStorage.setItem(ADMIN_SEED_KEY, "true");
        }
      } catch (error) {
        console.error("Failed to seed admin user:", error);
        // Still mark as seeded to avoid infinite retries
        localStorage.setItem(ADMIN_SEED_KEY, "true");
      }
    }

    seed();
  }, []);
}
