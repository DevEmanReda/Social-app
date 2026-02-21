
import axios from 'axios'
import SideBar from '../../components/sideBar/SideBar'
import Loading from '../../components/Loading'
import { useQuery } from '@tanstack/react-query'
export default function AppHome() {


  const { isLoading, isError, error, data } = useQuery({ queryKey: ['posts'], queryFn: getPosts })
 

  function getPosts(){
    const token = localStorage.getItem('token')
    return axios.get('https://route-posts.routemisr.com/posts', {
      headers: {
        token,
        Authorization: `Bearer ${token}`,
      },
    })
  }

  const posts = data?.data?.posts || data?.data?.data?.posts || []
  
  if (isLoading)
    return <Loading></Loading>

  if (isError) {
    return <p className='text-red-600 text-center mt-10'>{error?.response?.data?.error || error?.response?.data?.message || 'Failed to load posts'}</p>
  }


  return (
    <div>
      <SideBar posts={posts}></SideBar>
    </div>
  )
}