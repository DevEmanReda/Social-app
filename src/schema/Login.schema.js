import * as z from 'zod'

export const loginSchema = z
    .object({
    email: z.string().nonempty('*Email is required').email('*Email is invalid'),
    password: z
        .string()
        .nonempty('*Password is required')
        .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        '*Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'
        ),
    })