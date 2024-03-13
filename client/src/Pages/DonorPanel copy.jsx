import React from 'react'
import '../PagesStyling/UserPanel.css'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PagesFooter from '../PageComponents/PagesFooter';
import PageProfile from './PageProfile';
import PageProfile3 from './PageProfile3';
import PageProfile4 from './PageProfile4';

const DonorPanel = () => {
    const [adminState, updateAdminState] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState([]);
    let keyId = JSON.parse(localStorage.getItem('keyId'))
    let userType = JSON.parse(localStorage.getItem('userType'))
    let checkUser = async (req, res) => {
        try {
            console.log('keyId', keyId)
            let val = await axios.get(`/receipients/${keyId}`)
            console.log('val', val.data)
            console.log('val.data', val.data)
            updateAdminState(val.data)
            console.log('adminState', adminState)

            // setSelectedItemIndex(val.data)
        }
        catch (error) {
            // alert(error)
            toast.error(error, {
                position: 'top-right',
            });
        }
    }
    useEffect(() => {
        checkUser()
    }, [])
    let EditUser = async (e, name, phone, recipientType, firstName, lastName) => {
        const confirmDelete = window.confirm('Are you sure you want to update this user?');
        if (confirmDelete) {

            console.log('e', e)
            console.log('name,phone,recipientType', name, phone, recipientType, firstName, lastName)
            try {
                let val = await axios.put(`/receipients/${e}`, { name, phone, recipientType, firstName, lastName })
                if (val.status === 200) {
                    //   alert('Updated! ')
                    /* eslint-disable no-restricted-globals */
                    toast.success('Updated!', {
                        position: 'top-right',
                    });

                    // Navigate to the next page after a delay
                    setTimeout(() => {
                        location.reload()
                    }, 3000);
                }
                else {
                    toast.error('error', {
                        position: 'top-right',
                    });
                }
            }
            catch (error) {
                // alert(error)
                toast.error(error, {
                    position: 'top-right',
                });

            }
        }
        else {
            toast.error('error', {
                position: 'top-right',
            });
        }
    }
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    let DeleteUser = async (e) => {
        console.log('e', e)
        const confirmDelete = window.confirm('Confirm Delete?');
        if (confirmDelete) {

            try {
                let val = await axios.delete(`/receipients/${e}`)
                if (val.status === 200) {
                    toast.success('Deleted!', {
                        position: 'top-right',
                    });
                    setTimeout(() => {
                        /* eslint-disable no-restricted-globals */
                        location.reload()
                    }, 3000);
                }
                else {
                    toast.error('error', {
                        position: 'top-right',
                    });
                }
            }
            catch (error) {
                toast.error(error, {
                    position: 'top-right',
                });
            }
        }
        else {
            toast.error('error', {
                position: 'top-right',
            });
        }
    }
    return (
        keyId ?
            userType === 'Donor' ?
                <>
                    <ToastContainer />
                
                    <PageProfile3 />
                    
                </>
                : 'You can view it as a donor only'
            : ''
    )
}

export default DonorPanel