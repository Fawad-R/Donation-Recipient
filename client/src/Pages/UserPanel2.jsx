import React from 'react'
import UserPanel from './UserPanel'
import { Navbar } from '../PageComponents/Navbar'
import PagesFooter from '../PageComponents/PagesFooter'

const UserPanel2 = () => {
  return (
    <div>
        <Navbar/>
        <UserPanel/>
        <PagesFooter />
    </div>
  )
}

export default UserPanel2