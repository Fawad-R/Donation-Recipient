import React from 'react'
import CampaignForm from '../PageComponents/CampaignFormDonor'
import {Navbar} from '../PageComponents/Navbar'
import CampaignForm3 from '../PageComponents/CampaignForm3'
const Campaign4 = () => {

  return (
    <div>
      {/* <Navbar/> */}
      {/* 900px */}
      <div style={{width:"100%"}}>
      {/*  */}
      {/* ,width:"100%" */}
        <div style={{ textAlign: 'center',overflow: 'auto' }} >
          {/* <h4>Create new campaign</h4> */}
          {/* <Navbar/> */}
          <CampaignForm3/>
          {/* <div style={{ margin: '2%' }}>
            <RecentRecipientsCarousel recipients={recipients} />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Campaign4