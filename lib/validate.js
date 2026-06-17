import { z } from 'zod';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8).max(128);
const slugSchema = z.string().trim().min(1).max(120);
const headerImageFilenameSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z0-9]+$/);
const headerImageDataUriSchema = z
  .string()
  .trim()
  .min(1)
  .max(2000000)
  .regex(/^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i);

export const headerImageSchema = z.union([
  headerImageDataUriSchema,
  headerImageFilenameSchema,
]);

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
  headerImage: headerImageSchema,
});

export const moderateSchema = z.object({
  action: z.enum([
    'hide_review',
    'unhide_review',
    'delete_review',
    'hide_message',
    'unhide_message',
    'delete_message',
    'ban_user',
    'unban_user',
  ]),
  id: z.string().uuid(),
});

export const adminUserRoleSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'admin']),
});

export const adminUserDeleteSchema = z.object({
  id: z.string().uuid(),
});

export const adminFacultyUpsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(1).max(120).optional(),
  city: z.string().trim().min(1).max(120),
  address: z.string().trim().max(255).nullable(),
  description: z.string().trim().max(4000).nullable(),
  website: z.string().trim().max(255).nullable(),
  email: z.string().trim().email().max(255).nullable(),
  phone: z.string().trim().max(80).nullable(),
  tuitionCost: z.number().int().nonnegative().max(1000000).nullable(),
  minAdmissionGrade: z.number().min(0).max(10).nullable(),
  budgetSeatsIndex: z.number().min(0).max(1000000).nullable(),
  coverUrl: z.string().trim().max(5000).nullable(),
  emblemUrl: z.string().trim().max(5000).nullable(),
  multiCampus: z.boolean(),
  domainIds: z.array(z.string().uuid()).max(100).default([]),
  programs: z.array(z.string().trim().min(1).max(120)).max(100).default([]),
});

export const adminFacultyDeleteSchema = z.object({
  id: z.string().uuid(),
});
