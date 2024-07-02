import { z } from "zod";

export class AuthSchema {
  static loginSchema = z.object({
    email: z.string().email().min(5),
    password: z.string().min(8),
  });

  static signupSchema = z.object({
    username: z.string().min(5),
    email: z.string().email().min(5),
    password: z.string().min(8),
  });
}

export namespace AuthTypes {
  export type Login = z.infer<typeof AuthSchema.loginSchema>;
  export type Signup = z.infer<typeof AuthSchema.signupSchema>;
}
