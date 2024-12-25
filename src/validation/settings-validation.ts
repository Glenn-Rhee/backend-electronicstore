import { z, ZodType } from "zod";

export default class SettingsValidation {
  static readonly SETSETTINGS: ZodType = z.object({
    revenue: z.enum(["ABLE", "DISABLE"]),
    users: z.enum(["ABLE", "DISABLE"]),
    sales: z.enum(["ABLE", "DISABLE"]),
    orders: z.enum(["ABLE", "DISABLE"]),
  });
}
