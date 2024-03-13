import React, { useEffect, useRef, useState } from 'react'
import '../PagesStyling/Login.css'
import { useNavigate } from 'react-router-dom'
import {
    MDBInput,
    MDBBtn,
    MDBCheckbox,
    MDBRow,
    MDBCol,
    MDBAccordion
} from 'mdb-react-ui-kit';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    let Navigate = useNavigate();
    let [state, updatestate] = useState({})
    let [loginState, checkLoginState] = useState({})
    const [formErrors, setFormErrors] = useState({});
    
    // const [stateInput, updateStateInput] = useState({});
    const formRef = useRef(null);
    useEffect(()=>{
        let keyId=JSON.parse(localStorage.getItem('keyId'));
        checkLoginState(keyId);
    },[])
    let inputEvent = (e) => {
        if(e.target.name==='email')
        {
          let value=e.target.value;
          value=value.toLowerCase();
          updatestate({ ...state, [e.target.name]: value });
        }
        else
        {
            updatestate({ ...state, [e.target.name]: e.target.value });
        }
    }
    let validateForm = () => {
        const errors = {};
        // Validate individual form fields
        if (!state.email) {
            errors.email = 'email is required';
        }
        if (!state.password) {
            errors.password = 'password is required';
        }

        // Set the form errors state
        setFormErrors(errors);
        console.log('here_formErrors', formErrors);
        // Return true if the form is valid (no errors), false otherwise
        return Object.keys(errors).length === 0;
    }
    
    let submitEvent = async (e) => {
        e.preventDefault();
        console.log('state', state);
        const isValid = validateForm();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());
        if (isValid) {
            try {
                let val = await fetch('/loginn', {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify(state)
                })
                console.log('i am login val', val);
                let val2=await val.json()
                console.log('i am login val2', val2);
                if (val.status == 200) {
                    console.log(state.email);
                    console.log('login inside val', val);
                    localStorage.setItem('keyId', JSON.stringify(val2._id));
                    localStorage.setItem('userType', JSON.stringify(val2.userType));
                    localStorage.setItem('keyName', JSON.stringify(val2.name));
                    // alert('Logged in sucessfully');
                    toast.success('Successfully created!', {
                        position: 'top-right',
                      });
              
                      // Navigate to the next page after a delay
                      setTimeout(() => {
                        if (val.userType == 'Donor') {
                            Navigate('/donorPanel');
                        }
                        else if(val.userType == 'Recipient') {
                            Navigate('/recipientpanel');
                        }
                      }, 3000);
                }
                else if (val.status == 201) {
                    console.log(state.email);
                    // let val = await axios.get(`/User/id/${state.email}`)
                    console.log('login inside val', val);
                    localStorage.setItem('keyId', JSON.stringify(val2._id));
                    localStorage.setItem('keyName', JSON.stringify(val2.name));
                    // alert('Logged in sucessfully');
                    toast.success('Successfully Logged in!', {
                        position: 'top-right',
                      });
              
                      // Navigate to the next page after a delay
                      setTimeout(() => {
                        Navigate('/adminpanel');
                      }, 3000); // Adjust the delay as needed
                }
                else {
                    // alert('Error Loggining you in');
                    toast.error('Error Loggining you in', {
                        position: 'top-right',
                      });

                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log('Form validation errors:', formErrors);
        }
    }
    const {t}=useTranslation()
    return (
        // loginState==null?
        <div >
            <ToastContainer/>
            {/* <Navbar/> */}
            <Navbar />
            <div className='Login'>
                <form action="/"  ref={formRef}>
                    <h1 style={{ color: "#000" }}>{t('home.login')}</h1>
                    <div className="icon">
                        <i className="fa fa-user-circle-o"></i>
                    </div>
                    <MDBRow tag="form" className='g-3' >

                        <MDBCol md="12">
                        <label for="email"><strong style={{ color: "#000" }}>{t('home.email')}</strong></label>
                            <MDBInput required onChange={inputEvent} type="email" name="email" placeholder="Email" />
                            {formErrors.email && <p className="error">{formErrors.email}</p>}
                        </MDBCol>
                        <MDBCol md="12">
                        <label style={{ color: "#000" }} for="password"><strong style={{ color: "#000" }}>{t('home.password')}</strong></label>
                            <MDBInput required onChange={inputEvent} type="password" name="password" placeholder="Password" />
                            {formErrors.password && <p className="error">{formErrors.password}</p>}
                        </MDBCol>
                        {/* <span className="psw"><a href="/reset">{t('home.forgotPassword')}?</a></span> */}
                        <MDBCol size="12">
                            {/* <MDBBtn type='submit' className='MDBBtn' onClick={submitEvent}>Login</MDBBtn> */}
                            <button type='submit' className='MDBBtn' onClick={submitEvent}>{t('home.login')}</button>
                        </MDBCol>
                    </MDBRow>

            {/* </div> */}
                </form>
                {/* <Footer /> */}
            </div>
        </div>
        // :
        // 'fawad'
        // Navigate('/')
    )
}

export default Login