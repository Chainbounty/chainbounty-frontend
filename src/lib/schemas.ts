import { z } from 'zod'

const GITHUB_ISSUE_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+$/

export const postBountySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(120, 'Title must be under 120 characters'),

  description: z
    .string()
    .min(30, 'Description must be at least 30 characters')
    .max(2000, 'Description must be under 2000 characters'),

  issueUrl: z
    .string()
    .url('Must be a valid URL')
    .regex(GITHUB_ISSUE_REGEX, 'Must be a valid GitHub issue URL (e.g. https://github.com/org/repo/issues/123)'),

  reward: z
    .number({ invalid_type_error: 'Reward must be a number' })
    .positive('Reward must be greater than 0')
    .max(1_000_000, 'Reward cannot exceed 1,000,000'),

  token: z.enum(['XLM', 'USDC', 'AQUA'], {
    required_error: 'Please select a token',
  }),

  tags: z
    .string()
    .max(200, 'Tags too long')
    .optional(),

  expiresAt: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      return new Date(val) > new Date()
    }, 'Expiry date must be in the future'),

  milestonesTotal: z
    .number({ invalid_type_error: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'At least 1 milestone required')
    .max(10, 'Maximum 10 milestones'),
})

export type PostBountyFormValues = z.infer<typeof postBountySchema>
