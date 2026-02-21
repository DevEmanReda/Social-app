import React, { useContext, useEffect } from 'react'
import SideBar from '../components/sideBar/SideBar'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { authContext } from '../Context/AuthContext'
import Loading from '../components/Loading'

export default function Profile() {
    const {userdata} = useContext(authContext)

    const {data, isLoading, refetch} = useQuery({
        queryKey:['profilePosts', userdata?._id], 
        queryFn:handleProfile,
        enabled: !!userdata?._id,
        staleTime: 0, // Always refetch when component mounts
    })

    // Refetch when user changes (after logout/login)
    useEffect(() => {
        if (userdata?._id) {
            refetch()
        }
    }, [userdata?._id, refetch])

    function handleProfile(){
        return axios.get(`https://route-posts.routemisr.com/users/${userdata._id}/posts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
    }

    const userPosts = data?.data?.posts || data?.data?.data?.posts || []
    console.log('User posts:', userPosts)

    if (isLoading) {
        return <Loading />
    }

  return (
    <div>
        <SideBar posts={userPosts} isProfilePage={true}></SideBar>
    </div>
  )
}
