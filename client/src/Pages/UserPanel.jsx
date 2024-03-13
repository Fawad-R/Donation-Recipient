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
import { Avatar, Table } from '@mui/material';

const UserPanel = () => {
    const [adminState, updateAdminState] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState([]);
    let keyId = JSON.parse(localStorage.getItem('keyId'))
    let userType = JSON.parse(localStorage.getItem('userType'))
    let checkUser = async (req, res) => {
        try {
            console.log('keyId', keyId)
            let val = await axios.get(`/alladminsOnly`)
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
                let val = await axios.delete(`/adminOnly`)
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

                }
            }
            catch (error) {
                toast.error(error, {
                    position: 'top-right',
                });
            }
        }
        else {

        }
    }
    return (
        keyId ?
            <>
                <ToastContainer />
                <Table responsive striped hover>
                    <thead>
                        <tr>
                            <th scope="col">Profile</th>
                            {/* <th>Email</th> */}
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Type</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    {
                        adminState.length !== 0 ?
                            adminState.map((row, ind) => (
                                <tr key={row._id}>
                                    {/* <img src={`uploads/${row.profilePicture}`} alt="Admin" className="rounded-circle" width="150" /> */}
                                    <td className="text-nowrap">
                                        <div className="d-flex align-items-center">
                                            <Avatar src={`uploads/${row.profilePicture}`} size="l" name={row.name} />
                                            <div className="ms-2">{row.name}</div>
                                        </div>
                                    </td>

                                    <td className="text-nowrap">
                                        <input type="text" name="name" id="" value={row.name} onChange={(e) => {
                                            const newValue = e.target.value;
                                            setSelectedItemIndex((prevData) => {
                                                const newData = [...prevData];
                                                newData[ind].name = newValue;
                                                return newData;
                                            });
                                        }}
                                        />
                                    </td>
                                    <td className="text-nowrap">
                                        <input type="text" name="phone" id="" value={row.phone} onChange={(e) => {
                                            const newValue = e.target.value;
                                            setSelectedItemIndex((prevData) => {
                                                const newData = [...prevData];
                                                newData[ind].phone = newValue;
                                                return newData;
                                            });
                                        }}
                                        />
                                    </td>
                                    <td className="text-nowrap">
                                        <input type="text" name="recipientType" id="" value={row.recipientType} onChange={(e) => {
                                            const newValue = e.target.value;
                                            setSelectedItemIndex((prevData) => {
                                                const newData = [...prevData];
                                                newData[ind].recipientType = newValue;
                                                return newData;
                                            });
                                        }}
                                        />
                                    </td>
                                    <td className="text-nowrap">
                                        <button style={{ marginRight: '1px' }} onClick={() => EditUser(row._id, row.name, row.phone, row.recipientType)} className="btn btn-primary btn-sm mx-1">Edit</button>
                                        <button onClick={() => DeleteUser(row._id)} className="btn btn-danger btn-sm mx-1">Delete</button>
                                    </td>
                                </tr>
                            ))

                            :
                            ''
                    }
                </Table>
            </>
            : ''
    )
}

export default UserPanel