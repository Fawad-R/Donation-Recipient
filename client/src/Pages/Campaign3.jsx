import React from 'react'
import CampaignForm from '../PageComponents/CampaignFormDonor'
import {Navbar} from '../PageComponents/Navbar'
import PagesFooter from '../PageComponents/PagesFooter'
import CampaignForm2 from '../PageComponents/CampaignForm2'
const Campaign3 = () => {

  return (
    <div>
      {/* <Navbar/> */}
      <div>
      {/* , padding: '12%' */}
          {/* <Navbar/> */}
        <div style={{ textAlign: 'center' }} >
          {/* <h4>Create new campaign</h4> */}
          <CampaignForm2/>
          {/* <div style={{ margin: '2%' }}>
            <RecentRecipientsCarousel recipients={recipients} />
        </div> */}
        </div>
        {/* <PagesFooter/> */}
      </div>
    </div>
  )
}

export default Campaign3