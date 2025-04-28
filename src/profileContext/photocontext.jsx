import React from 'react'
import { ProfileProvider } from './context'
import Navbar from '../Navbarcomponent/navbar'
import Profile from '../../page/Profile/profile'

const photocontext = () => {
  return (
    <>
   <ProfileProvider>
     <Navbar/>
     <Profile/>
   </ProfileProvider>
    </>
  )
}

export default photocontext
