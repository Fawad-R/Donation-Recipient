import React, { useState, useEffect } from 'react';
import CampaignFormRecipient from '../PageComponents/CampaignFormRecipient';
import CampaignFormDonor from '../PageComponents/CampaignFormDonor';
import { Navbar } from '../PageComponents/Navbar';
import { useNavigate } from 'react-router-dom';

const Campaign = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = JSON.parse(localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);

  return (
    <div>
      <div className="text-center p-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {userType !== 'Recipient' ? (
                <CampaignFormRecipient />
              ) : (
                <CampaignFormDonor />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
