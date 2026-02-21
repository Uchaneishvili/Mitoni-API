import type { Express } from "express";
import staffRoutes from "./staff.routes";
import servicesRoutes from "./services.routes";
import reservationsRoutes from "./reservations.routes";

export const setupRoutes = (app: Express) => {
  app.use("/api/v1/staff", staffRoutes);
  app.use("/api/v1/services", servicesRoutes);
  app.use("/api/v1/reservations", reservationsRoutes);
};
