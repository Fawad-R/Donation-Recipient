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
import PageProfile2 from './PageProfile2';
import PageProfile4 from './PageProfile4';

const UserManagementPanel = () => {
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
            userType === 'Recipient' ?
                <>
                    <ToastContainer />
                    {/* <PageProfile2 /> */}
                    <PageProfile4 />
                    {/* <Navbar /> */}
                    {/* <div className='UserPanel'>
                        <div className="container">
                            <div className="row gutters">
                                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="account-settings">
                                                <div className="user-profile">
                                                    <div className="user-avatar">
                                                        <img src={ `uploads/${adminState.profilePicture}` || "https://bootdey.com/img/Content/avatar/avatar7.png"} alt="Maxwell Admin" />
                                                    </div>
                                                    <h5 className="user-name">{adminState.firstName} {adminState.lastName}</h5>
                                                    
                                                    <h6 className="user-email">{adminState.email}</h6>
                                                </div>
                                                <div className="about">
                                                    <h5>{adminState.userType}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="row gutters">
                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                    <h6 className="mb-2 text-primary">{t('home.personalDetails')}</h6>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group">
                                                        <label for="fullName">{t('home.fullName')}</label>
                                                            <>
                                                                <input type="text" style={{ margin: "1% 0%" }} className="form-control" name="firstName" id="fullName" value={adminState.firstName}
                                                                    onChange={(e) => {
                                                                        updateAdminState({ ...adminState, [e.target.name]: e.target.value })
                                                                    }}
                                                                />
                                                                <input type="text" style={{ margin: "1% 0%" }} className="form-control" name="lastName" id="fullName" value={adminState.lastName}
                                                                    onChange={(e) => {
                                                                        updateAdminState({ ...adminState, [e.target.name]: e.target.value })
                                                                    }}
                                                                />
                                                            </>
                                                         
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group">

                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                    <div className="form-group">
                                                        <label for="phone">{t('home.phone')}</label>
                                                        <input type="tel" className="form-control" name="phone" id="fullName" value={adminState.phone}
                                                            onChange={(e) => {
                                                                updateAdminState({ ...adminState, [e.target.name]: e.target.value })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row gutters">
                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                    <div className="text-right">
                                                        <button style={{ margin: "1%" }} onClick={() => EditUser(adminState._id, adminState.name, adminState.phone, adminState.recipientType, adminState.firstName, adminState.lastName)} className="btn btn-primary btn-sm mx-1">{t('home.update')}</button>
                                                        <button onClick={() => DeleteUser(keyId)} className="btn btn-danger btn-sm mx-1">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <PageProfile /> */}
                    {/* <PagesFooter /> */}
                </>
                : 'You can view it as a donor only'
            : ''
    )
}

// export default DonorPanel
export default UserManagementPanel;
