import { Navbar } from '../PageComponents/Navbar'
import PagesFooter from '../PageComponents/PagesFooter'
import RecipientResearchPage2 from '../PageComponents/RecipientResearchPage2'
import '../PagesStyling/Recipient.css'
import React from 'react'

const Recipient_search = () => {
  return (
    <div>
      <Navbar/>
      <RecipientResearchPage2/>
      <PagesFooter />
    </div>
  )
}

export default Recipient_search