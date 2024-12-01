import express from "express"
import SettingsController from "../controller/settings-controller";

export const settingsRoutes = express.Router();

settingsRoutes.get("/settings", SettingsController.getSettingsUser)
