import { z } from "zod";

export class UserSchema {
  static UpdateSchema = z.object({
    username: z.string().min(5).optional(),
    passwordData: z
      .object({
        password: z.string().min(8),
        oldPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
      .optional(),
  });
}

export namespace UserSchemaTypes {
  export type Update = z.infer<typeof UserSchema.UpdateSchema>;
}
