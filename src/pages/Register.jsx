import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Section from '../components/Section'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import {zodResolver} from '@hookform/resolvers/zod'
import { registerSchema } from '../schema/Register.schema'
import { toast } from 'react-toastify'
export default function Register() {

  const [isloading,setloading] = useState(false)
  const [error,seterror] = useState('')
  const navigate = useNavigate()

  const {register,handleSubmit,formState:{errors,isValid}}= useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange', 
    defaultValues:{
    name: "",
    email:"",
    password:"",
    rePassword:"",
    dateOfBirth:"",
    gender:""
    }
  })

  async function handleRegister(formData){
    
    try {
      seterror('')
      setloading(true)
      const {data} = await axios.post('https://route-posts.routemisr.com/users/signup', formData)
        toast.success("Your Account has been created")
    setTimeout(() => {
      navigate('/')
    }, 2000)
    } catch (error) {
      const backendMessage = error?.response?.data?.error || error?.response?.data?.message || 'Unable to create account. Please check your data.'
      seterror(backendMessage)
      toast.error(backendMessage)
    }finally{
      setloading(false)
    }
  }



  return (
    <div className='home'>
      <Section className='sec1'></Section>
      <div className='formInput sec2 '>
        <div className="contain">
              <div>
                  <h5 className='text-center'>Create account</h5>
                  <p>Already have an account?<NavLink to='/'><span> Sign in</span></NavLink> </p>
              </div>
              <div className='btns flex gap-4'>
                <button><i class="fa-brands fa-google"></i>Google</button>
                <button><i class="fa-brands fa-facebook-f"></i>Facebook</button>
              </div>
              <div className="another-way">
                <p>or continue with email</p>
              </div>
              
<form className="" onSubmit={handleSubmit(handleRegister)}>
  <div>
  <label htmlFor="input-group-1" className="block mb-2.5 text-sm font-medium text-heading">Full Name</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
<i class="fa-solid fa-user"></i>    </div>
    <input {...register('name')} type="text" id="input-group-1" className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium  text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Enter Your Full Name " />
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.name?.message}</p>
</div>

  <label htmlFor="input-group-2" className="block mb-2.5 text-sm font-medium text-heading"> Email Address </label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
<i class="fa-solid fa-envelope"></i>    </div>
    <input {...register('email')} type="email" id="input-group-2" className="block w-full  ps-9 pe-3 py-2.5 bg-neutral-secondary-medium  text-heading text-sm  focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="name@example.com" />
      </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.email?.message}</p>
  <label htmlFor="input-group-3" className="block  mb-2.5 text-sm font-medium text-heading">Password</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
<i class="fa-solid fa-lock"></i>    </div>
    <input {...register('password')} type="password" id="input-group-3" className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium text-heading text-sm  focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Create a strong Password" />
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.password?.message}</p>
  


  <div>
  <label htmlFor="input-group-4" className="block mb-2.5 text-sm font-medium text-heading">Confirm Password</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
<i class="fa-solid fa-lock"></i>     </div>
    <input {...register('rePassword')} type="password" id="input-group-4" className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium  text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Confirm your Password" />
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.rePassword?.message}</p>
</div>
  <div className="inputs flex gap-3">
    <div className='w-1/2'>
  <label htmlFor="input-group-5" className="block mb-2.5 text-sm font-medium text-heading">Date of Birth</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" /></svg>
    </div>
    <input {...register('dateOfBirth')} type="date" id="input-group-5" className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="name@flowbite.com" />
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.dateOfBirth?.message}</p>
</div>
<div className='w-1/2'>
  <label htmlFor="gender" className="block mb-2.5 text-sm font-medium text-heading">Gender</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <i class="fa-solid fa-venus-mars"></i>
    </div>
    <select
    {...register('gender')}
      id="gender"
      className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs"
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.gender?.message}</p>
</div>

  </div>


  {error && (<p className='text-red-600 text-xs mt-2 leading-snug wrap-break-word'>{error}</p>)}


  {!isloading ? <button disabled={!isValid}  className=' bg-gray-700 sign disabled:cursor-not-allowed'> create Account   <i class="fa-solid fa-arrow-right"></i></button>
  : <button disabled className=' bg-blue-700 sign disabled:cursor-not-allowed'>Creating Account  <i class="fa-solid fa-spinner fa-spin-pulse"></i> </button>}

</form>


          </div>
    </div>
    </div>
    
  )
}