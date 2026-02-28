import * as z from 'zod'

export const settingschema = z
    .object({
        CurrentPassword: z
        .string()
        .nonempty('Password is required'),
        NewPassword: z
        .string()
        .nonempty('New password is required'),
        ConfirmNewPassword: z
        .string()
        .nonempty('Confirm new password is required')
    }).refine((data) => data.NewPassword === data.ConfirmNewPassword, {
    message: "Passwords do not match",
    path: ["ConfirmNewPassword"],
    })