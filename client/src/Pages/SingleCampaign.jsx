import React from 'react';
import { useParams } from 'react-router-dom';
import '../PagesStyling/Singlecampaign.css'; // Import the CSS file
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const SingleCampaign = () => {
    let [campaign, updateCampaign] = useState(null)
    const { id } = useParams();
    useEffect(() => {
        const fetchRecipient = async () => {
            try {
                const response = await axios.get(`/c/c/c/campaign/${id}`);
                console.log('response.data', response.data)
                console.log('response.data', response.data.firstName.length)
                updateCampaign(response.data);
            } catch (error) {
                console.error('Error fetching recipient data:', error);
            }
        };

        fetchRecipient();
    }, [id]);

    return (
        // campaign!==null?
        <div className="campaign-container">
            <h1>{campaign?.title}</h1>
            <p>Start Date: {campaign?.startDate ? campaign.startDate.toDateString() : 'N/A'}</p>
            <p>End Date: {campaign?.endDate ? campaign.endDate.toDateString() : 'N/A'}</p>
            <p>Description: {campaign?.description}</p>
            <div>
                {campaign?.projections.map((projection, index) => (
                    <img key={index} src={projection} alt={`Projection ${index}`} />
                ))}
            </div>
            <p>Updates: {campaign?.updates}</p>
            <p>Price: ${campaign?.price}</p>
            <button className="donate-button" >Donate</button>
            {/* onClick={handleDonate} */}
        </div>
        // :''

    );
};

export default SingleCampaign