import * as z from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string().nonempty('*Name is required')
      .min(3, '*Name must be at least 3 characters')
      .max(20, '*Name cannot be more than 20 characters')
      ,
    email: z.string().nonempty('*Email is required').email('*Email is invalid'),
    password: z
      .string()
      .nonempty('*Password is required')
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        '*Password should be at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'
      ),
    rePassword: z.string().nonempty('*Confirm password is required'),
    dateOfBirth: z.string().nonempty('*Date of birth is required'),
    gender: z.enum(['female', 'male'], {
      required_error: '*Gender is required',
      invalid_type_error: '*Gender is required',
    }),
  })
  .refine((val) => val.password === val.rePassword, {
    message: '*Password and confirm password should be the same',
    path: ['rePassword'],
  })