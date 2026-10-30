import { z } from "zod";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color.");

export const saveListSchema = z
  .object({
    id: z.string().uuid("Invalid list ID.").optional(),

    name: z
      .string()
      .trim()
      .min(1, "List name is required.")
      .max(100, "List name must not exceed 100 characters.")
      .optional(),

    color: hexColorSchema.optional(),

    sub_color: hexColorSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id) {
      if (!data.name) {
        ctx.addIssue({
          code: "custom",
          path: ["name"],
          message: "List name is required when creating a list.",
        });
      }

      return;
    }

    if (
      data.name === undefined &&
      data.color === undefined &&
      data.sub_color === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Provide at least one field to update.",
      });
    }
  });

export type SaveListInput = z.infer<typeof saveListSchema>;
