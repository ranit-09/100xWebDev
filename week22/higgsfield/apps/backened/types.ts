import z from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(3, "username must be at least 3 characters"),
  email: z.email("invalid email"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const CreateAvatarSchema = z.object({
  name: z.string().min(1),
  // URL of the source image to transform into an avatar
  image: z.url("image must be a valid URL"),
});