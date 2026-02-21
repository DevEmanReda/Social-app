import React from 'react'
import avatar from '../assets/alex-avatar-BLDJqiDr.png'
import '../pages/Home/home.css'
export default function Section({ className = '' }) {
    return (
    <div className={className}>
        <div className='txt text-white'>
                    <div className="title flex items-center gap-3">
                        <div><p>S</p></div>
                        <div><h5>SocialHub</h5></div>
                    </div>
                    <div>
                        <h2>Welcome Back <span>to SocialHub App</span></h2>
                        <p>Signin to connect people all over the world</p>
                    </div>
                    <div className="cards">
                        <div className='flex items-center gap-2 card'>
                            <div className="icon"><i class="fa-solid fa-message"></i></div>
                            <div className='font-semibold'>
                                <p>Real-time Chat</p>
                                <p>Instant messaging</p>
                            </div>
                        </div>
                        <div className='card flex items-center gap-2'>
                            <div className="icon"><i class="fa-solid fa-image"></i></div>
                            <div className='font-semibold'>
                                <p>Share Media</p>
                                <p>Photos & videos</p>
                            </div>
                        </div>
                        <div className='card flex items-center gap-2'>
                            <div className="icon"><i class="fa-solid fa-bell"></i></div>
                            <div className='font-semibold'>
                                <p>Smart Alerts</p>
                                <p>Stay updated</p>
                            </div>
                        </div>
                        <div className='card flex items-center gap-2'>
                            <div className="icon"><i class="fa-solid fa-users"></i></div>
                            <div className='font-semibold'>
                                <p>Communities</p>
                                <p>Find your tribe</p>
                            </div>
                        </div>
                    </div>
                    <div className="numbers flex gap-5 ">
                        <div>
                            <div className='flex gap-3 items-center'>
                                <i class="fa-solid fa-users"></i>
                                <h5>2M+</h5>
                            </div>
                            <p>Active Users</p>
                        </div>
                        <div>
                            <div className='flex gap-3 items-center'>
                                <i class="fa-solid fa-heart"></i>
                                <h5>10M+</h5>
                            </div>
                            <p>Posts Shared</p>
                        </div>
                        <div>
                            <div className='flex gap-3 items-center'>
                                <i class="fa-solid fa-message"></i>
                                <h5>50M+</h5>
                            </div>
                            <p>Messages Sent</p>
                        </div>
                    </div>
                    <div className="rate">
                        <div className="stars text-orange-300">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <i>"SocialHub has completely changed how I connect with friends and discover new communities. The experience is seamless!"</i>
                        <div className="photo">
                            <div>
                                <img src={avatar} className='' alt="" />
                            </div>
                            <div>
                                <i>Alex Johnson</i>
                                <p>Product Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
    )
}