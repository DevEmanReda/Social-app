import React, { useState, useEffect, useContext } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import './login.css'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schema/Login.schema'
import axios from 'axios'
import { toast } from 'react-toastify'
import { authContext } from '../../Context/AuthContext'

export default function Login({ className = '' }) {

  const [isloading,setloading] = useState(false)
  const [error,seterror] = useState('')
  const navigate = useNavigate()

  const {setlogin} = useContext(authContext)

  const {register,handleSubmit,watch,formState:{errors,isValid}} = useForm({
    resolver:zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues:{
      email:"",
      password:""
    }
  })

  const emailValue = watch('email')
  const passwordValue = watch('password')

  useEffect(() => {
    seterror('')
  }, [emailValue, passwordValue])

  function handleLogin(formData){
    setloading(true)
    axios.post('https://route-posts.routemisr.com/users/signin',formData).then(({data})=>{
      const token = data?.token || data?.data?.token
      const user = data?.user || data?.data?.user
      if (!token) {
        throw new Error('Token not found in login response')
      }
      localStorage.setItem('token', token)
      if (user?.name) localStorage.setItem('userName', user.name)
      if (user?.username) localStorage.setItem('userUsername', user.username)
      setlogin(token)
      console.log(token)
      toast.success("Login successful")
      setTimeout(() => {
        navigate('/appHome')
      }, 1500)
      seterror('')
    }).catch((error)=>{
      const backendMessage = error?.response?.data?.error || error?.response?.data?.message || "incorrect password or email"
      seterror(backendMessage)
    }).finally(()=>{
      setloading(false)
    })
  }

  return (
    <div className={`formInput ${className}`.trim()}>
        <div className="contain">
              <div>
                  <h5 className='text-center'>Login</h5>
                  <p>Don't have an account?<NavLink to='register'><span> Sign up</span></NavLink> </p>
              </div>
              <div className='btns flex gap-4'>
                <button><i class="fa-brands fa-google"></i>Google</button>
                <button><i class="fa-brands fa-facebook-f"></i>Facebook</button>
              </div>
              <div className="another-way">
                <p>or continue with email</p>
              </div>
              
<form className="" onSubmit={handleSubmit(handleLogin)}>
  <label htmlFor="input-group-1" className="block mb-2.5 text-sm font-medium text-heading"> Email Address </label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
<i class="fa-solid fa-envelope"></i>    </div>
    <input {...register('email')} type="text" id="input-group-1" className="block w-full  ps-9 pe-3 py-2.5 bg-neutral-secondary-medium  text-heading text-sm  focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="name@example.com" />
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.email?.message}</p>
  <label htmlFor="input-group-2" className="block  mb-2.5 text-sm font-medium text-heading">Password</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
<i class="fa-solid fa-lock"></i>    </div>
    <input {...register('password')} type="password" id="input-group-2" className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium text-heading text-sm  focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Enter your password" />
  </div>
  <p className='text-red-600 text-xs mt-1 leading-snug wrap-break-word'>{errors.password?.message}</p>
  {error && (<p className='text-red-600 text-52  leading-snug wrap-break-word'>{error}</p>)}
  {!isloading ? <button disabled={!isValid}  className=' bg-gray-700 sign disabled:cursor-not-allowed'> Sign in  <i class="fa-solid fa-arrow-right"></i></button>
  : <button disabled className=' bg-blue-700 sign disabled:cursor-not-allowed'>signing to in  <i class="fa-solid fa-spinner fa-spin-pulse"></i> </button>}
</form>
          </div>
    </div>
  )
}