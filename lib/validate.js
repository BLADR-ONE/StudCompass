import { z } from 'zod';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8).max(128);
const slugSchema = z.string().trim().min(1).max(120);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema.transform((value) => value.toLowerCase()),
  password: passwordSchema,
});

export const credentialsSchema = z.object({
  email: emailSchema.transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const facultySlugSchema = slugSchema;

export const reviewUpsertSchema = z.object({
  faculty: facultySlugSchema,
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(4000),
});

export const messageCreateSchema = z.object({
  faculty: facultySlugSchema,
  body: z.string().trim().min(1).max(4000),
});

export const personalityAnswersSchema = z.object({
  answers: z.array(z.number().int().min(0).max(2)).length(120),
});

export const preferencesSchema = z
  .object({
    city: z.string().trim().min(1).max(120).optional(),
    domains: z.array(z.string().trim().min(1).max(120)).max(50).optional(),
  })
  .refine((value) => value.city !== undefined || value.domains !== undefined, {
    message: 'At least one preference must be provided',
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const verificationEmailSchema = z.object({
  email: emailSchema,
});

export const verificationTokenSchema = z.object({
  token: z.string().trim().min(16).max(255),
});

export const testimonialCreateSchema = z.object({
  authorName: z.string().trim().min(2).max(120),
  authorRole: z.string().trim().min(2).max(120),
  body: z.string().trim().min(10).max(1200),
  sortOrder: z.number().int().min(0).max(100000).default(0),
  published: z.boolean().default(false),
});

export const testimonialUpdateSchema = z.object({
  id: z.string().uuid(),
  authorName: z.string().trim().min(2).max(120).optional(),
  authorRole: z.string().trim().min(2).max(120).optional(),
  body: z.string().trim().min(10).max(1200).optional(),
  sortOrder: z.number().int().min(0).max(100000).optional(),
  published: z.boolean().optional(),
});

export const testimonialReorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0).max(100000),
      }),
    )
    .min(1),
});

export const siteSettingsSchema = z.object({
  headerImage: z.string().trim().min(1).max(255),
});

export const moderateSchema = z.object({
  action: z.enum([
    'hide_review',
    'unhide_review',
    'hide_message',
    'unhide_message',
    'ban_user',
    'unban_user',
  ]),
  id: z.string().uuid(),
});
