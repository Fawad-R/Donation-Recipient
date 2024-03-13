import React, { useEffect, useRef, useState } from 'react'
import '../PagesStyling/Login.css'
import { useNavigate } from 'react-router-dom'

import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PropTypes from 'prop-types';

import { Card, Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Section from '../components/common/Section';
import Divider from '../components/common/Divider';
import SocialAuthButtons from './SocialAuthButtons';

const ForgetPassword = () => {
    let Navigate = useNavigate();
    let [state, updatestate] = useState({})
    let [loginState, checkLoginState] = useState({})
    const [formErrors, setFormErrors] = useState({});

    // State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    // Handler
    const handleSubmit = e => {
        e.preventDefault();
        toast.success(`Logged in as ${formData.email}`, {
            theme: 'colored'
        });
    };

    const handleFieldChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // const [stateInput, updateStateInput] = useState({});
    const formRef = useRef(null);
    useEffect(() => {
        let keyId = JSON.parse(localStorage.getItem('keyId'));
        checkLoginState(keyId);
    }, [])
    let inputEvent = (e) => {
        if (e.target.name === 'email') {
            let value = e.target.value;
            value = value.toLowerCase();
            updatestate({ ...state, [e.target.name]: value });
        }
        else {
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
                let val2 = await val.json()
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
                        else if (val.userType == 'Recipient') {
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
    const { t } = useTranslation()
    return (

        <>
            <Section className="py-0">
                <ToastContainer />
                <Row className="flex-center min-vh-100 py-6">
                    <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">
                        <Logo />
                        <Card>
                            <Card.Body className="p-4 p-sm-5">

                                {/* <div className="d-flex justify-content-center align-items-center text-center" style={{ height: '100vh' }}> */}
                                <Form action="/" ref={formRef}>
                                    <Row className="mb-3">
                                        <Col xs={12} className="text-start">
                                            <h5>{t('home.isForgetYourPassword')}</h5>
                                            <p>{t('home.enterYourEmailAndWeWillSendYouAResetLink')}</p>
                                        </Col>

                                    </Row>
                                    <Form.Group className="mb-3">
                                        {/* <Form.Label>Email address</Form.Label> */}
                                        <Form.Control
                                            placeholder='Email address'
                                            value={formData.email}
                                            name="email"
                                            onChange={inputEvent}
                                            type="email"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Button
                                            type="submit"
                                            color="primary"
                                            onClick={submitEvent}
                                            className="mt-3 w-100"

                                        >
                                            {t('home.sendEmailResetLink')}
                                        </Button>
                                    </Form.Group>
                                    <Row className="mb-3">
                                        <Col xs={6} className="text-start">
                                            <p className="fs--1 text-600 mb-0">
                                                <Link to="/register">{t('home.createAnAccount')}</Link>
                                            </p>
                                        </Col>
                                        <Col xs={6} className="text-start">
                                            <a style={{ marginBottom: "2%", fontSize: '13px' }} href="/login">{t('home.alreadyHaveAccount')}</a>
                                        </Col>
                                    </Row>

                                </Form>
                                {/* </div> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Section>

        </>
    )
}

export default ForgetPassword