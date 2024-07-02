import { z } from "zod";

export class AdminSchema {
  static toggleUserStatusSchema = z.object({ id: z.number() });
}

export namespace AdminTypes {
  export type ToggleUserStatus = z.infer<
    typeof AdminSchema.toggleUserStatusSchema
  >;
}
