import { SettingsState } from "@prisma/client";

export interface SetSettingsUser {
  revenue: SettingsState;
  users: SettingsState;
  sales: SettingsState;
  orders: SettingsState;
}
