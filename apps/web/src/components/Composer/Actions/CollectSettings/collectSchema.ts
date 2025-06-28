import { isAddress } from "viem";
import { z } from "zod";

export const RecipientSchema = z.object({
  address: z
    .string()
    .nonempty({ message: "Recipient address is required" })
    .refine((val) => isAddress(val), { message: "Invalid recipient address" }),
  percent: z
    .number({ invalid_type_error: "Invalid percent" })
    .min(1, { message: "Split must be greater than 0" })
    .max(100, { message: "Split cannot exceed 100" })
});

export const PayToCollectSchema = z.object({
  erc20: z
    .object({
      currency: z.string(),
      value: z.string().refine((val) => Number.parseFloat(val) > 0, {
        message: "Amount must be greater than 0"
      })
    })
    .optional(),
  recipients: z
    .array(RecipientSchema)
    .refine(
      (recipients) =>
        new Set(recipients.map((r) => r.address.toLowerCase())).size ===
        recipients.length,
      { message: "Duplicate recipient address found" }
    )
    .refine(
      (recipients) =>
        recipients.length <= 1 ||
        recipients.reduce((acc, r) => acc + r.percent, 0) === 100,
      { message: "Splits must add up to 100%" }
    ),
  referralShare: z.number().optional()
});

export const CollectActionSchema = z.object({
  payToCollect: PayToCollectSchema.optional()
});

export type CollectActionSchemaType = z.infer<typeof CollectActionSchema>;
