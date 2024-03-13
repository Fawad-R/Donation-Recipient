import '../PagesStyling/RecipientPage.css';
// RecipientPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
// import './RecipientPage.css';

const RecipientPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
      
    const [selectedRecipient, setSelectedRecipient] = useState(null);

    useEffect(() => {
        const fetchRecipient = async () => {
            try {
                const response = await axios.get(`/receipients/${id}`);
                console.log('response.data', response.data)
                console.log('response.data', response.data.firstName.length)
                setSelectedRecipient(response.data);
            } catch (error) {
                console.error('Error fetching recipient data:', error);
            }
        };

        fetchRecipient();
    }, [id]);

    return (
        <>
        <Navbar/>
        
        <div className="recipient-page">
            {selectedRecipient && (
                <div className="recipient-container">
                    <div className="recipient-header">
                        <h1 className="recipient-title">{t('recipientDetails')}</h1>
                    </div>
                    <div className="recipient-details">
                        <img
                            className="recipient-image"
                            src={`/uploads/${selectedRecipient.profilePicture}`}
                            alt={`${selectedRecipient.firstName} ${selectedRecipient.lastName}`}
                        />
                        <div className="recipient-info">
                            {selectedRecipient.firstName.length !== 0 ?
                                <>
                                    <p>
                                        <span className="recipient-label">{t('firstNAme')}:</span>{' '}
                                        {selectedRecipient.firstName}
                                    </p>
                                    <p>
                                        <span className="recipient-label">{t('lastName')}:</span>{' '}
                                        {selectedRecipient.lastName}
                                    </p>
                                </>
                                :
                                <p>
                                    <span className="recipient-label">{t('name')}:</span>{' '}
                                    {selectedRecipient.name}
                                </p>}
                            <p>
                                <span className="recipient-label">{t('email')}:</span>{' '}
                                {selectedRecipient.email}
                            </p>
                            <p>
                                <span className="recipient-label">{t('phone')}:</span>{' '}
                                {selectedRecipient.phone}
                            </p>
                            <p>
                                <span className="recipient-label">{t('recipientType')}:</span>{' '}
                                {selectedRecipient.recipientType}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default RecipientPage;
