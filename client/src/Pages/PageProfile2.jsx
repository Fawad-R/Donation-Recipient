import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../PagesStyling/Profile.css';

import { useNavigate } from 'react-router-dom';
import Campaign from './Campaign';
import FetchDonor from '../PageComponents/FetchDonor';
import { Navbar } from '../PageComponents/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PagesFooter from '../PageComponents/PagesFooter';
import MembershipPlanCard from './MembershipPlanCard';
function PageProfile2() {
    let navigate = useNavigate()
    const [manageMemebership, setManageMemebership] = useState()
    const [newDonationType, setNewDonationType] = useState('');
    let [state, updatestate] = useState(null)
    let [donationState, updateDontaionState] = useState([])
    let keyId = JSON.parse(localStorage.getItem('keyId'))
    let userType = JSON.parse(localStorage.getItem('userType'))
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

    return (
        <>
            <Navbar />
            <ToastContainer />
            {keyId ?
                userType === 'Donor' ?
                    state !== null ?
                        <div className="container">
                            <div className="main-body">

                                <div className="row gutters-sm">
                                    <div className="col-md-4 mb-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex flex-column align-items-center text-center">
                                                    <img src={`uploads/${state.profilePicture}`} alt="Admin" className="rounded-circle" width="150" />
                                                    <div className="mt-3">
                                                        {state.name?.length !== 0 ? <h4 style={{ textTransform: 'capitalize' }} >{state.name}</h4> : <h4 style={{ textTransform: 'capitalize' }}>{state.firstName}</h4>}
                                                        <p className="text-secondary mb-1">UserType is {state.userType}</p>
                                                        <div style={{ textAlign: "center" }}>

                                                            {subscription === 'true' ? <button onClick={cancelMembership}>Cancel Membership</button> : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card mt-3">
                                            <button className='sm' style={{ display: 'block', margin: "2%" }} onClick={Logout}>Logout</button>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Full Name</h6>
                                                    </div>
                                                    {state.name?.length !== 0 ? <div className="col-sm-9 text-secondary" style={{ textTransform: 'capitalize' }}>{state.name}</div> : <div className="col-sm-9 text-secondary" style={{ textTransform: 'capitalize' }}>{state.firstName} {state.lastName}</div>}
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Email</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {state.email}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Phone</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {state.phone}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Recipient Type</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {state.recipientType}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    {monthlyChargesActive === 'true' ? <button onClick={cancelMonthlyCharges}>Cancel Monthly Charges</button> : ''}
                                                </div>
                                                <hr />

                                            </div>
                                        </div>

                                        <div className="row gutters-sm">
                                            <div className="col-sm-12 mb-6">
                                                <div className="card h-100">
                                                    <div className="card-body">
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
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>

                            </div>
                        </div> : ''
                    :
                    state !== null ?
                        <div className="container">
                            <div className="main-body">
                                <div className="row gutters-sm">
                                    <div className="col-md-4 mb-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex flex-column align-items-center text-center">
                                                    <img src={`uploads/${state.profilePicture}`} alt="Admin" className="rounded-circle" width="150" />
                                                    <div className="mt-3">
                                                        {state.name?.length !== 0 ? <h4 style={{ textTransform: 'capitalize' }} >{state.name}</h4> : <h4 style={{ textTransform: 'capitalize' }}>{state.firstName}</h4>}
                                                        <p className="text-secondary mb-1">UserType is {state.userType}</p>
                                                        {subscription === 'true' ? <button onClick={cancelMembership}>Cancel Membership</button> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card mt-3">
                                            <button className='sm' style={{ display: 'block', margin: "2%" }} onClick={Logout}>Logout</button>
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
                                    </div>

                                    <div className="col-md-8">
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Full Name</h6>
                                                    </div>
                                                    {state.name?.length !== 0 ? <div className="col-sm-9 text-secondary" style={{ textTransform: 'capitalize' }}>{state.name}</div> : <div className="col-sm-9 text-secondary" style={{ textTransform: 'capitalize' }}>{state.firstName} {state.lastName}</div>}
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Email</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {state.email}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Phone</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {state.phone}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Recipient Type</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {state.recipientType}
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    {monthlyChargesActive === 'true' ? <button onClick={cancelMonthlyCharges}>Cancel Monthly Charges</button> : ''}
                                                </div>
                                                <hr />
                                            </div>
                                        </div>

                                        <div className="row gutters-sm">
                                            <div className="col-sm-12 mb-6">
                                                <div className="card h-100">
                                                    <div className="card-body">
                                                        <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">Campaigns </i></h6>
                                                        <Campaign />
                                                        <h6 className="d-flex align-items-center mt-3"><i className="material-icons text-info mr-2">Membership plan </i></h6>
                                                        <MembershipPlanCard
                                                            planType="Basic"
                                                            price="Free"
                                                            features={[
                                                                'Meetings up to 40 minutes per meeting',
                                                                '100 Attendees per meeting',
                                                                'Whiteboard Basic',
                                                                'Team Chat',
                                                                'Mail & Calendar Client',
                                                                'NEW Notes',
                                                            ]}
                                                            savings="$29 savings/year/user"
                                                            buttonText="Sign Up"
                                                        />
                                                        <MembershipPlanCard
                                                            planType="Pro"
                                                            price="$149.90/year/user"
                                                            features={[
                                                                'Meetings up to 30 hours per meeting',
                                                                '100 Attendees per meeting',
                                                                'Whiteboard Basic',
                                                                'Team Chat',
                                                                'Mail & Calendar Client',
                                                                'NEW Notes',
                                                                'NEW AI Companion',
                                                            ]}
                                                            savings="$39 savings/year/user"
                                                            buttonText="Buy Now"
                                                        />
                                                        <MembershipPlanCard
                                                            planType="Business"
                                                            price="$199.90/year/user"
                                                            features={[
                                                                'Meetings up to 30 hours per meeting',
                                                                '300 Attendees per meeting',
                                                                'Whiteboard',
                                                                'Team Chat',
                                                                'Mail & Calendar Client',
                                                                'NEW Notes',
                                                                'NEW AI Companion',
                                                                'Profile',
                                                            ]}
                                                            buttonText="Buy Now"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        :
                        <>
                            {/* {alert('You need an account to view this page')} */}
                            {/* {navigate('/register')} */}
                            You must be logged in to view this page
                        </>
                :
                ''
            }
            <PagesFooter />
        </>
    );
}

export default PageProfile2;
