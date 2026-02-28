import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home/Home'
import Register from './pages/Register'
import Login from './pages/Login/Login'
import Notfound from './components/Notfound'
import AppHome from './pages/AppHome/AppHome'
import { ToastContainer } from 'react-toastify';
import {HeroUIProvider} from "@heroui/react";
import ProtectedRoute from './pages/ProtectedRoute'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Profile from './pages/Profile'
import Setting from './pages/Setting/Setting'
export default function App() {


  const routes = createBrowserRouter([
      {path:'/' ,element:<Layout></Layout>,children:[
        {index:true,element:<Home></Home>},
        {path:'register',element:<Register></Register>},
        {path:'login',element:<Login></Login>,children:[
          {path:'appHome',element:<AppHome></AppHome>}
        ]},
        {path:'appHome',element:<ProtectedRoute><AppHome></AppHome></ProtectedRoute>},
        {path:'profile',element:<ProtectedRoute><Profile></Profile></ProtectedRoute>},
        {path:'Setting',element:<ProtectedRoute><Setting></Setting></ProtectedRoute>},
        {path:'*',element:<Notfound></Notfound>}
      ]}
  ])
// Create a client
const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false,
    refetchOnReconnect:false,
    retryOnMount:false
    }
  }
})


  return (
    <div >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools></ReactQueryDevtools>
          <HeroUIProvider>
            <RouterProvider router={routes}></RouterProvider>
          </HeroUIProvider>
        <ToastContainer theme="colored"></ToastContainer>
    </QueryClientProvider>
    </div>
  )
}