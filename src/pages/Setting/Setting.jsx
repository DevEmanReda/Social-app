import React from 'react'
import './setting.css'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { settingschema } from '../../schema/Setting.schema'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
export default function Setting() {
  const navigate = useNavigate();

  const { register , handleSubmit, formState: { errors } } =useForm({
    resolver:zodResolver( settingschema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues:{
      CurrentPassword:"",
      NewPassword:"",
      ConfirmNewPassword:""
    }
  })

    async function handleChangePass(data) {
  try {
    const response = await axios.patch(
      "https://route-posts.routemisr.com/users/change-password",
      {
        password: data.CurrentPassword,
        newPassword: data.NewPassword
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    toast.success("Password updated successfully");
    console.log(response.data);

    setTimeout(() => {
      navigate('/login')
    }, 2000);


  } catch (error) {
    console.log(error.response);
    toast.error(
      error.response?.data?.message || "Failed to update password"
    );
  }
}


    return (
      <div>
        
<nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Social App</span>
    </a>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-default" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" /></svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
        <li>
          <Link to="/appHome" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Home</Link>
        </li>
        <li>
          <Link to="/profile" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Profile</Link>
        </li>
        <li>
          <Link to="/login" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Log Out</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>

<div className='mt-15 p-5'>


<form className="max-w-sm mx-auto" onSubmit={handleSubmit(handleChangePass)}>
    <div className='flex items-center gap-5 '>
        <div className="icon bg-blue-700 p-3 rounded-circle">
            <i className='fa-solid fa-key '></i>
        </div>
        <div className="txt-change">
            <h5>Change password</h5>
            <p>Keep your account secure by using a strong password.</p>
        </div>
    </div>
  <div className="mb-5">
    <label htmlFor="password-alternative" className="block mb-2.5 text-sm font-medium text-heading">Current password</label>
    <input {...register("CurrentPassword")} type="password" id="password-alternative" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body" placeholder="Enter current password"  />
    {errors.CurrentPassword && <p className="text-red-500 text-xs ">{errors.CurrentPassword.message}</p>}
  </div>
  <div className="mb-5">
    <label htmlFor="password-alternative" className="block mb-2.5 text-sm font-medium text-heading">New password</label>
    <input {...register("NewPassword")} type="password" id="password-alternative" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body" placeholder="Enter new password"  />
    {errors.NewPassword && <p className="text-red-500 text-xs ">{errors.NewPassword.message}</p>}
  </div>
  <div className="mb-5">
    <label htmlFor="password-alternative" className="block mb-2.5 text-sm font-medium text-heading">Confirm new password</label>
    <input {...register("ConfirmNewPassword")} type="password" id="password-alternative" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow placeholder:text-body" placeholder="Re-Enter new password"  />
  </div>
  {errors.ConfirmNewPassword && <p className="text-red-500 text-xs ">{errors.ConfirmNewPassword.message}</p>}
  <button type="submit" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Update Password</button>
</form>


</div>


    </div>
    )
}
