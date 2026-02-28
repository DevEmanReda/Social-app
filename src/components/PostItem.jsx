import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useContext } from "react";
import { authContext } from "../Context/AuthContext";
import { toast } from "react-toastify";

export default function PostItem({ post }) {

  const { image, user: { name, photo, _id: postUserId }, createdAt, body } = post
  const queryClient = useQueryClient()
  const { userdata } = useContext(authContext)

    const [visibleComments, setVisibleComments] = useState(1);
    const [commentText, setCommentText] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    
    const isMyPost = userdata?._id === postUserId

    function convertDate(){
      const date = new Date(createdAt);

const formatted = date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

return formatted

    }

    // get comments
    const { data: commentsData } = useQuery({ queryKey: ['comments', post._id], queryFn: getComments })

    function getComments(){
      const token = localStorage.getItem('token')
      return axios.get(`https://route-posts.routemisr.com/posts/${post._id}/comments?page=1&limit=10`, {
        headers: {
          token,
          Authorization: `Bearer ${token}`,
    }
  })
    }

    function updateCommentsCache(updater) {
      queryClient.setQueryData(['comments', post._id], (prev) => {
        if (!prev) return prev
        if (prev.data?.comments) {
          return { ...prev, data: { ...prev.data, comments: updater(prev.data.comments) } }
        }
        if (prev.data?.data?.comments) {
          return {
            ...prev,
            data: { ...prev.data, data: { ...prev.data.data, comments: updater(prev.data.data.comments) } },
          }
        }
        return prev
      })
    }

    // create comment
    const { isPending, mutate } = useMutation({
      mutationKey: ['createComment', post._id],
      mutationFn: createComment,
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: ['comments', post._id] })
        const previous = queryClient.getQueryData(['comments', post._id])
        const optimistic = {
          _id: `temp-${crypto.randomUUID()}`,
          content: variables.content,
          commentCreator: {
            name: localStorage.getItem('userName') || 'you',
            photo: STATICIMAGE,
          },
        }
        updateCommentsCache((items = []) => [optimistic, ...items])
        return { previous, optimisticId: optimistic._id }
      },
      onSuccess: (response, _variables, context) => {
        toast.success('Comment created successfully')
        setCommentText('')
        const created = response?.data?.comment || response?.data?.data?.comment
        if (created) {
          updateCommentsCache((items = []) =>
            items.map((item) => (item._id === context?.optimisticId ? created : item))
          )
        } else {
          queryClient.invalidateQueries({ queryKey: ['comments', post._id] })
        }
      },
      onError: (_error, _variables, context) => {
        toast.error('Failed to create comment')
        if (context?.previous) {
          queryClient.setQueryData(['comments', post._id], context.previous)
        }
      },
    })

    function createComment(payload){ 
      const token = localStorage.getItem('token')
      return axios.post(`https://route-posts.routemisr.com/posts/${post._id}/comments`, payload, {
        headers: {
          token,
          Authorization: `Bearer ${token}`,
        }
      })
    }

    function handleCreateComment(event){
      event.preventDefault()
      if (!commentText.trim()) return
      const content = commentText.trim()
      setCommentText('')
      mutate({ content })
    }

    // delete post
    const { mutate: deletePost } = useMutation({
      mutationFn: () => {
        const token = localStorage.getItem('token')
        return axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
          headers: {
            token,
            Authorization: `Bearer ${token}`,
          },
        })
      },
      onMutate: async () => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['posts'] })
        await queryClient.cancelQueries({ queryKey: ['profilePosts', userdata?._id] })

        // Snapshot previous values
        const previousPosts = queryClient.getQueryData(['posts'])
        const previousProfilePosts = queryClient.getQueryData(['profilePosts', userdata?._id])

        // Optimistically remove the post from both caches
        queryClient.setQueryData(['posts'], (old) => {
          if (!old) return old
          
          // Handle different data structures
          if (old.data?.posts) {
            return {
              ...old,
              data: {
                ...old.data,
                posts: old.data.posts.filter(p => p._id !== post._id)
              }
            }
          } else if (old.data?.data?.posts) {
            return {
              ...old,
              data: {
                ...old.data,
                data: {
                  ...old.data.data,
                  posts: old.data.data.posts.filter(p => p._id !== post._id)
                }
              }
            }
          }
          return old
        })

        queryClient.setQueryData(['profilePosts', userdata?._id], (old) => {
          if (!old) return old
          
          // Handle different data structures
          if (old.data?.posts) {
            return {
              ...old,
              data: {
                ...old.data,
                posts: old.data.posts.filter(p => p._id !== post._id)
              }
            }
          } else if (old.data?.data?.posts) {
            return {
              ...old,
              data: {
                ...old.data,
                data: {
                  ...old.data.data,
                  posts: old.data.data.posts.filter(p => p._id !== post._id)
                }
              }
            }
          }
          return old
        })

        return { previousPosts, previousProfilePosts }
      },
      onSuccess: () => {
        toast.success('Post deleted successfully')
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        queryClient.invalidateQueries({ queryKey: ['profilePosts', userdata?._id] })
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousPosts) {
          queryClient.setQueryData(['posts'], context.previousPosts)
        }
        if (context?.previousProfilePosts) {
          queryClient.setQueryData(['profilePosts', userdata?._id], context.previousProfilePosts)
        }
        console.error('Delete error:', err.response?.data || err.message)
        toast.error('Failed to delete post')
      },
    })

    function handleDeletePost() {
      if (window.confirm('Are you sure you want to delete this post?')) {
        deletePost()
        setShowMenu(false)
      }
    }

    const comments = commentsData?.data?.comments || commentsData?.data?.data?.comments || []

    
    const STATICIMAGE= 'https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_user_personalization&w=740&q=80'

  return (
    <Card className="max-w-100 p-3">
      <CardHeader className="flex gap-3 p-5 justify-between">
        <div className="flex gap-3">
          <Image
            alt={name}
            height={60}
            radius="full"
            src={photo}
            width={60}
          />
          <div className="flex flex-col">
            <p className="text-md">{name}</p>
            <p className="text-small text-default-500">{convertDate(createdAt)}</p>
          </div>
        </div>
        {isMyPost && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-600 hover:text-gray-800 p-2"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => {
                      toast.info('Edit functionality coming soon')
                      setShowMenu(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fa-solid fa-pen-to-square mr-2"></i>
                    Edit Post
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <i className="fa-solid fa-trash mr-2"></i>
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <img src={image} className="w-full" alt="" />
        <p>{body}</p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between items-center">
        <div className="like flex items-center gap-4">
          <i className="fa-solid fa-thumbs-up text-black font-bold"></i>
          <p>Like</p>
        </div>
        <div className="comment flex items-center gap-4">
          <i className="fa-solid fa-comment text-black font-bold"></i>
          <p>Comment</p>
        </div>
        <div className="share flex items-center gap-4">
          <i className="fa-solid fa-share text-black font-bold"></i>
          <p>Share</p>
        </div>
      </CardFooter>
      <Divider />
      {comments.slice(0, visibleComments).map((comment, index) => (
        <CardHeader key={index} className="flex gap-3 p-5">
          <img onError={(e)=>e.target.src=STATICIMAGE}
            alt={comment?.commentCreator?.name}
            height={60}
            radius="full"
            src={comment?.commentCreator?.photo}
            width={60}
          />
          <div className="flex flex-col bg-gray-200 w-full p-3 rounded-2xl">
            <p className="text-md">{comment?.commentCreator?.name}</p>
            <p className="text-small text-default-500">{comment?.content}</p>
          </div>
        </CardHeader>
      ))}
      {comments.length > visibleComments && (
        <Link onClick={() => setVisibleComments(comments.length)} className="p-3 cursor-pointer">Show more comments</Link>
      )}
        <Divider />

      <div className="flex my-3 items-center">
        <div>
          <img className="w-15" src="https://www.shutterstock.com/image-vector/default-avatar-social-media-display-600nw-2632690107.jpg" alt="" />
        </div>
        <form action="" className="relative" onSubmit={handleCreateComment}>
          <input
            className="w-full p-3 rounded-3xl bg-gray-200"
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            disabled={isPending}
          />
          <button
            type="submit"
            className="text-blue-400 absolute right-5 top-0 bg-transparent"
            disabled={isPending}
            aria-label="Send comment"
          >
            <i className="fa-solid fa-paper-plane cursor-pointer"></i>
          </button>
        </form>
      </div>



    </Card>
  );
}