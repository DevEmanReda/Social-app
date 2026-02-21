import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../../Context/AuthContext'
import PostItem from '../PostItem'
import '../sideBar/sideBar.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function SideBar({ posts = [], isProfilePage = false }) {

    const {setlogin, userdata} = useContext(authContext)
    const navgaite = useNavigate();
    const userName = localStorage.getItem('userName') || 'User'
    const userUsername = localStorage.getItem('userUsername') || userName.replace(/\s+/g, '').toLowerCase()
    const photo = localStorage.getItem('userPhoto') || "https://marketplace.canva.com/EAFdIOc_EM0/3/0/1600w/canva-beige-and-pink-illustrative-cute-girl-avatar-pUk78cukytY.jpg"
    
    const [imgPreview, setimagePreview] = useState(null)
    const inputPhoto = useRef(null)
    const bodyInput = useRef(null)

    function handlePhoto(e) {
      const file = e.target.files[0]
      if (file) {
        const url = URL.createObjectURL(file)
        setimagePreview(url)
      }
    }

    function closeButton() {
      setimagePreview(null)
      if (inputPhoto.current) inputPhoto.current.value = null
    }

    function handleCnancel() {
      if (bodyInput.current) bodyInput.current.value = null
      closeButton()
    }

    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
      mutationFn: sumbitPost,
      onMutate: async (formData) => {
        // Only do optimistic update for profile page
        if (isProfilePage && userdata?._id) {
          await queryClient.cancelQueries({ queryKey: ['profilePosts', userdata._id] })
          
          const previousPosts = queryClient.getQueryData(['profilePosts', userdata._id])
          
          // Create optimistic post
          const optimisticPost = {
            _id: `temp-${Math.random()}`,
            body: formData.get('body'),
            image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : null,
            user: {
              _id: userdata._id,
              name: userName,
              photo: photo
            },
            createdAt: new Date().toISOString(),
            comments: []
          }
          
          // Add optimistic post to cache
          queryClient.setQueryData(['profilePosts', userdata._id], (old) => {
            if (!old) return old
            
            if (old.data?.posts) {
              return {
                ...old,
                data: {
                  ...old.data,
                  posts: [optimisticPost, ...old.data.posts]
                }
              }
            } else if (old.data?.data?.posts) {
              return {
                ...old,
                data: {
                  ...old.data,
                  data: {
                    ...old.data.data,
                    posts: [optimisticPost, ...old.data.data.posts]
                  }
                }
              }
            }
            return old
          })
          
          return { previousPosts }
        }
      },
      onSuccess: () => {
        toast.success("Post created successfully")
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        queryClient.invalidateQueries({ queryKey: ['profilePosts', userdata?._id] })
      },
      onError: (err, variables, context) => {
        // Rollback optimistic update on error
        if (context?.previousPosts && isProfilePage && userdata?._id) {
          queryClient.setQueryData(['profilePosts', userdata._id], context.previousPosts)
        }
        toast.error("Failed to create post")
      },
      onSettled: () => {
        if (bodyInput.current) bodyInput.current.value = null
        closeButton()
      }
    })

    function handlePost() {
      const formData = new FormData()
      if (bodyInput.current?.value)
        formData.append('body', bodyInput.current.value)
      if (inputPhoto.current?.files[0])
        formData.append('image', inputPhoto.current.files[0])

      mutate(formData)
    }

    function sumbitPost(formData) {
      return axios.post('https://route-posts.routemisr.com/posts', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    }
    
    // logout 
    function logout(){
        localStorage.clear('token')
        setlogin(null)
        navgaite('/')
    }


    return (
    <div className="container">
    <aside className="left-side">
    <div className="profile-info">
      <img className='imagephoto' src={photo} alt />
      <h6>{userName}</h6>
      <p>@{userUsername}</p>
      <span><span className="count">0</span>Followers</span>
      <span><span className="count">0</span>Following</span>
    </div>
    <div className="links">
      <ul>
        <li>
          <Link to="/appHome">
            <i className="fa-solid fa-house" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/Profile">
            <i className="fa-solid fa-circle-user" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/Notfound">
            <i className="fa-solid fa-house" />
            <span>Saved Posts</span>
          </Link>
        </li>
        <li>
          <Link to="/Notfound">
            <i className="fa-solid fa-user-group" />
            <span>Friends</span>
          </Link>
        </li>
        <li>
          <Link to="/Notfound">
            <i className="fa-solid fa-calendar-days" />
            <span>Events</span>
          </Link>
        </li>
        <li>
          <Link to="/setting">
            <i className="fa-solid fa-gear" />
            <span>Settings</span>
          </Link>
        </li>
        <hr />
        <li className="logout">
          <Link onClick={logout} to="/">
            <i className="fa-solid fa-arrow-right-from-bracket" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  </aside>
  <main className="posts">
    <div className="head">
      <div className='flex'>
        <img className='imagephoto' src={photo} alt />
        <div className="text">
          <h2>Create a Post</h2>
          <p>Share your thoughts with the world</p>
        </div>
      </div>

      <textarea name="post" placeholder="what's on your mind?" defaultValue={""} ref={bodyInput} />
      {/* image */}
      {imgPreview && <div className='relative'>
        <img src={imgPreview} alt="" className='w-full rounded-lg my-3 object-cover' />
        <i className='fa-solid fa-close top-3 end-3 absolute cursor-pointer' onClick={closeButton}></i>
      </div>}
      <hr />
      {/* file */}
      <input type="file" onChange={handlePhoto} id="file" className="hidden" ref={inputPhoto} />
      <div className="share">

        <label htmlFor="file"><a className="photo cursor-pointer" ><i className="fa-regular fa-image" />Photo</a></label>
        <div className='btnss'>
          <button className="post cursor-pointer" onClick={handlePost} disabled={isPending}>{isPending ? 'posting...' : 'post'} <i className="fa-brands fa-telegram" /></button>
          <button className='cancel' onClick={handleCnancel}>cancel</button>
        </div>

      </div>
    </div>
    <div className="posts-list">
      {posts?.map((post) => (
        <PostItem key={post._id} post={post}></PostItem>
      ))}
    </div>
  </main>
  <aside className="right-side">
    <div className="trending">
      <h3><i className="fa-solid fa-fire" />Trending Now</h3>
      <ul className="trends">
        <li>
          <p>#ReactJS</p>
          <span>12.5K posts</span>
        </li>
        <li>
          <p>#WebDevelopment</p>
          <span>8.2K posts</span>
        </li>
        <li>
          <p>#JavaScript</p>
          <span>15.3K posts</span>
        </li>
        <li>
          <p>#TailwindCSS</p>
          <span>5.1K posts</span>
        </li>
        <li>
          <p>#Programming</p>
          <span>20K posts</span>
        </li>
      </ul>
    </div>
    <div className="follow-box">
      <h3><i className="fa-solid fa-user-plus" /> Who to Follow</h3>
      <ul className="users-list">
        <li>
          <div className="user-data">
            <img className='imagephoto' src="https://i.pravatar.cc/150?img=1" alt="Sarah" />
            <div className="text">
              <p>Sarah Wilson</p>
              <span>@sarahw</span>
            </div>
          </div>
          <button className="follow-btn">Follow</button>
        </li>
        <li>
          <div className="user-data">
            <img className='imagephoto' src="https://i.pravatar.cc/150?img=2" alt="Mike" />
            <div className="text">
              <p>Mike Chen</p>
              <span>@mikechen</span>
            </div>
          </div>
          <button className="follow-btn">Follow</button>
        </li>
        <li>
          <div className="user-data">
            <img className='imagephoto' src="https://i.pravatar.cc/150?img=3" alt="Emily" />
            <div className="text">
              <p>Emily Davis</p>
              <span>@emilyd</span>
            </div>
          </div>
          <button className="follow-btn">Follow</button>
        </li>
      </ul>
      <Link to="#" className="show-more">Show more</Link>
    </div>
  </aside>
</div>


    

    )
}