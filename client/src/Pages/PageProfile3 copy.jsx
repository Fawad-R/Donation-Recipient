import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Campaign from './Campaign';
import FetchDonor from '../PageComponents/FetchDonor';
import { Navbar } from '../PageComponents/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PagesFooter from '../PageComponents/PagesFooter';
import '../PagesStyling/PageProfile3.css'
import Campaign3 from './Campaign3';
import Campaign4 from './Campaign4';

const PageProfile3 = () => {
    let navigate = useNavigate()
    const [manageMemebership, setManageMemebership] = useState()
    const [newDonationType, setNewDonationType] = useState('');
    let [state, updatestate] = useState(null)
    let [donationState, updateDontaionState] = useState([])
    let keyId = JSON.parse(localStorage.getItem('keyId'))
    let userType = JSON.parse(localStorage.getItem('userType'))
    const [selectedItem, setSelectedItem] = useState(0);
    let fetchUser = async () => {
        try {
            console.log('keyId', keyId)
            let val = await axios.get(`/receipients/${keyId}`)
            console.log('val.data', val.data)
            updatestate(val.data)
            console.log('val.data_state', state)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [])
    let fetchDonations = async () => {
        try {
            let val = await axios.get(`/transactions`)
            console.log('val.data_transactions', val.data)
            updateDontaionState(val.data)
            console.log('val.data_state_val.data_transactions', donationState)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchDonations()
    }, [])

    let fetchAccounting = async (id) => {
        console.log('id', id)
        navigate(`/accounting/${id}`)
    }
    let subscription = JSON.parse(localStorage.getItem('subscription'))
    let monthlyChargesActive = JSON.parse(localStorage.getItem('monthlyChargesActive'))
    let cancelMembership = async () => {
        try {
            let val = await axios.post('/payment/cancel-membership')
            if (val.status === 200) {
                localStorage.setItem('subscription', JSON.stringify('false'))
                alert('Membership Cancelled Sucessfully!!!')
                navigate('/')
            }
        }
        catch (error) {
            alert(error)
        }
    }
    let cancelMonthlyCharges = async () => {
        try {
            let val = await axios.post('/payment/cancel-subscription')
            if (val.status === 200) {
                localStorage.setItem('monthlyChargesActive', JSON.stringify('false'))
                alert('Monthly Charges deactivated')
                navigate('/')
            }
        }
        catch (error) {
            alert(error)
        }
    }
    let deleteAccount = async () => {
        try {
            let val = await axios.delete(`/receipients/${keyId}`)
            if (val.status === 200) {
                localStorage.setItem('keyId', JSON.stringify('null'))
                localStorage.setItem('userType', JSON.stringify('null'))
                localStorage.setItem('subscription', JSON.stringify('null'))
                localStorage.setItem('monthlyChargesActive', JSON.stringify('null'))
                // alert('Account Deleted')
                toast.success('Successfully created!', {
                    position: 'top-right',
                });
                // Navigate to the next page after a delay
                setTimeout(() => {
                    navigate('/register')
                }, 3000); // Adjust the delay as needed
            }
        }
        catch (error) {
            // alert(error)
            toast.error(error, {
                position: 'top-right',
            });

        }
    }
    let Logout = async (e) => {
        let val = await axios.get('/logoutt');
        if (val.status == 200) {
            localStorage.setItem('keyId', JSON.stringify(null))
            localStorage.setItem('userType', JSON.stringify(null))
            let keyId = JSON.parse(localStorage.getItem('keyId'));
            alert('Logged Out!')
            navigate('/login')
        }
        else {
            alert('error while logging you out!')
        }
    }
    let handleItemClick = () => {

    }
    return (
        <>
            {/* <Navbar /> */}
            <ToastContainer />
            {keyId ?
                userType === 'Donor' ?
                    state !== null ?
                        <div className="admin-panel">
                            <div className='PageProfile3'>
                                <div className='PageProfile3_0'>
                                    <div className="sidebar">
                                        {/* <h2 style={{ color: 'white' }}>Admin</h2> */}
                                        <ul style={{ display: "flex", flexDirection: "column" }} className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Timeline</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="campaign-tab" data-toggle="tab" href="#campaign" role="tab" aria-controls="campaign" aria-selected="false">Campaigns</a>
                                            </li>
                                        </ul>
                                        {/* <ul> */}
                                        {/* <li className={selectedItem === 0 ? 'active' : ''} onClick={() => handleItemClick(0)}>About</li>
                                            <li className={selectedItem === 1 ? 'active' : ''} onClick={() => handleItemClick(1)}>Timeline</li>
                                            <li className={selectedItem === 2 ? 'active' : ''} onClick={() => handleItemClick(2)}>Campaigns</li> */}
                                        {/* <button className='sm bg-danger' style={{ display: 'block', margin: "2%" }} onClick={Logout}>Logout</button> */}
                                        {/* <li className={selectedItem === 0 ? 'active' : ''} >Basic Settings</li> */}
                                        {/* </ul> */}
                                    </div>
                                    <div className="main-content">
                                        <div className="container emp-profile">
                                            <form method="post">
                                                {/* <div className="row">
                                                    <div className="col-md-2">
                                                        <div className="profile-img">
                                                            <img  src={`uploads/${state.profilePicture}`} alt="" />
                                                        </div>
                                                        <br />

                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="profile-head">
                                                            {state.name?.length !== 0 ? <h5 style={{ textTransform: 'capitalize' }} >{state.name}</h5> : <h5 style={{ textTransform: 'capitalize' }}>{state.firstName}</h5>}
                                                            <h6>
                                                                UserType is {state.userType}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        {subscription === 'true' ? <p style={{ cursor: "pointer" }} className="proile-rating" onClick={cancelMembership}>Cancel Membership</p> : ''}
                                                    </div>
                                                </div> */}
                                                <div className="row">
                                                    {/* <div className="col-md-4">
                                                        <div className="profile-work">
                                                            <button className='sm' style={{ display: 'block', margin: "2%" }} onClick={Logout}>Logout</button>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-md-8">
                                                        <div className="tab-content profile-tab" id="myTabContent">
                                                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                                                <div className="row">
                                                                    <div className="col-md-4">
                                                                        <div className="profile-img">
                                                                            <img src={`uploads/${state.profilePicture}`} alt="" />
                                                                        </div>
                                                                        <br />

                                                                    </div>
                                                                    {/* <div className="col-md-6">
                                                                        <div className="profile-head">
                                                                            {state.name?.length !== 0 ? <h5 style={{ textTransform: 'capitalize' }} >{state.name}</h5> : <h5 style={{ textTransform: 'capitalize' }}>{state.firstName}</h5>}
                                                                            <h6>
                                                                                UserType is {state.userType}
                                                                            </h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3">
                                                                        {subscription === 'true' ? <p style={{ cursor: "pointer" }} className="proile-rating" onClick={cancelMembership}>Cancel Membership</p> : ''}
                                                                    </div> */}
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <label>First Name</label>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <p>{state.firstName}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <label>Last Name</label>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <p>{state.lastName}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <label>Email</label>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <p>{state.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <label>Recipient Type</label>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <p>{state.recipientType}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                {subscription === 'true' ? <p style={{ cursor: "pointer" }} className="proile-rating" onClick={cancelMembership}>Cancel Membership</p> : ''}
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                                                <div className="row">
                                                                    <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">Donation </i> Summary</h6>
                                                                    {donationState.map((ele, ind) => {
                                                                        return (
                                                                            <>
                                                                                <div className='fetchAccounting' >
                                                                                    <FetchDonor id={ele.donor} />
                                                                                    <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
                                                                                        <small>{(ele.amount) / 100}$</small>
                                                                                        {ele.status == 'successful' ? <small style={{ fontSize: '8px', color: 'green' }}>({ele.status})</small> : <small style={{ fontSize: '8px', color: 'red' }}>({ele.status})</small>}
                                                                                    </div>
                                                                                    <div className="progress mb-3" style={{ "height": "5px" }}>
                                                                                        <div className="progress-bar bg-primary" role="progressbar" style={{ "width": `${(ele.amount) / 100}%` }} aria-valuenow={(ele.amount) / 100} aria-valuemin="0" aria-valuemax="100"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    })}
                                                                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                                                        <small onClick={() => fetchAccounting(keyId)}>Details</small>
                                                                        <button style={{ backgroundColor: 'red', fontSize: '12px' }} onClick={deleteAccount}>Delete Account</button>
                                                                    </div>
                                                                </div>

                                                                {/* <div className="row">
                                                            <div className="col-md-6">
                                                                <button className='sm' style={{ display: 'block', margin: "2%" }} onClick={Logout}>Logout</button>
                                                            </div>
                                                        </div> */}
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        {monthlyChargesActive === 'true' ? <button onClick={cancelMonthlyCharges}>Cancel Monthly Charges</button> : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane fade" id="campaign" role="tabpanel" aria-labelledby="campaign-tab">
                                                                {/* <div className="row">
                                                            <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">Campaigns </i></h6>
                                                            <Campaign />
                                                        </div> */}
                                                                <div style={{width:'70vw'}} className="row gutters-sm">
                                                                    <div className="col-sm-12 mb-12">
                                                                        <div className="card h-100">
                                                                            <div className="card-body">
                                                                                <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">Campaigns </i></h6>
                                                                                {/* <Campaign /> */}
                                                                                {/* <Campaign3 /> */}
                                                                                <Campaign4 />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* <div className="row">
                                                            <div className="col-md-6">
                                                                <button className='sm' style={{ display: 'block', margin: "2%" }} onClick={Logout}>Logout</button>
                                                            </div>
                                                        </div> */}
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        {monthlyChargesActive === 'true' ? <button onClick={cancelMonthlyCharges}>Cancel Monthly Charges</button> : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                    : ''
                : ''
            }
        </>
    )
}

export default PageProfile3