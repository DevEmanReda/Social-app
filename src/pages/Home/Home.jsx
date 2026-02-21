import React from 'react'

import { NavLink } from 'react-router-dom'
import Section from '../../components/Section'
import Login from '../Login/Login'
import './Home.css'
export default function Home() {
    return (
    <div className='home'>
        <Section className="sec1"></Section>
        <Login className="sec2"></Login>

    </div>
    )
}