import React, { useState,useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import '../PagesStyling/SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '../PageComponents/LanguageSwitch';
import { ToastContainer, toast } from 'react-toastify';
import '../PagesStyling/Login.css'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


import { Card, Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Section from '../components/common/Section';
import Divider from '../components/common/Divider';
import SocialAuthButtons from './SocialAuthButtons';
import PaypalCheckOut2 from '../PageComponents/PaypalCheckOut2';
import PaypalCheckOut3 from '../PageComponents/PaypalCheckOut3';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';

// import '@fullcalendar/core/main.css';
// import '@fullcalendar/daygrid/main.css';
// import '@fullcalendar/timegrid/main.css';
const SignupPage = () => {
  const { t } = useTranslation();
  const [userType, setUserType] = useState('Recipient');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [recipientType, setRecipientType] = useState('Type A');
  const [profilePicture, setProfilePicture] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [password, setPassword] = useState('');
  const [details, updateDetails] = useState('');
  
  const stripePromise = loadStripe('pk_test_51MFGxxGsyHFe5lQADpu8EQF9BKy1N7wdpsmYQhwFGtv6ovbZ93uDWb6cTW92Dsr50q2p0zyjOI01O6VDYjthwf5K00zyktNRfo');
  // Validation state
  const [errors, setErrors] = useState({});
  let navigate = useNavigate()
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const validateForm = () => {
    const errors = {};

    if (userType === 'Donor') {
      if (!firstName.trim()) {
        errors.firstName = 'First Name is required';
      }

      if (!lastName.trim()) {
        errors.lastName = 'Last Name is required';
      }
    } else if (userType === 'Recipient') {
      if (!name.trim()) {
        errors.name = 'Name is required';
      }

      if (!phone.trim()) {
        errors.phone = 'Phone is required';
      }

      if (!recipientType.trim()) {
        errors.recipientType = 'Recipient Type is required';
      }

      // if (!paymentMethod.trim()) {
      //   errors.paymentMethod = 'Payment Method is required';
      // }

      if (!profilePicture) {
        errors.profilePicture = 'Profile Picture is required';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    return errors;
  };
  let fetchSystem=async()=>{
    let val=await axios.get('/system-settings')
    updateDetails(val.data)
  }
  useEffect(()=>{
    fetchSystem()
  },[])

  const handleSignup = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    else {
      const formData = new FormData();

      formData.append('userType', userType);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email.toLowerCase());
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('recipientType', recipientType);
      // formData.append('paymentMethod', paymentMethod);
      formData.append('password', password);
      formData.append('profilePicture', profilePicture);
      try {
        let val = await fetch('/signu', {
          method: 'POST',
          body: formData
        })
        if (val.status === 200) {
          let val2 = await val.json()
          localStorage.setItem('keyId', JSON.stringify(val2._id));
          localStorage.setItem('userType', JSON.stringify(val2.userType));
          localStorage.setItem('monthlyChargesActive', JSON.stringify('null'))
          if (val2.userType == 'Donor') {
            localStorage.setItem('subscription', JSON.stringify('true'))
          }
          else {
            localStorage.setItem('subscription', JSON.stringify('null'))
          }
          toast.success('Successfully created!', {
            position: 'top-right',
          });

          // Navigate to the next page after a delay
          setTimeout(() => {
            if (val2.userType == 'Donor') {
              navigate('/donorPanel');
            }
            else if (val2.userType == 'Recipient') {
              navigate('/recipientpanel');
            }
          }, 3000); // Adjust the delay as needed
        }
        else {
          // alert('error creating your account')
          // console.log('error')
          toast.error('Error creating your account', {
            position: 'top-right',
          });

        }
      }
      catch (error) {
        // alert(error)
        toast.error('Error creating your account', {
          position: 'top-right',
        });
      }
    };
  }
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Section className="py-0">
        <ToastContainer />
        <Row className="flex-center min-vh-100 py-6">
          <Col sm={10} md={8} lg={6} xl={5} className="col-xxl-4">
            <Logo />
            <Card>
              <Card.Body className="p-4 p-sm-5">
                <Row className="mb-3">
                  <Col xs={4} className="text-start">
                    <h5>{t('home.signup')}</h5>
                  </Col>
                  <Col xs={8} className="text-start">
                    <a style={{ marginBottom: "2%", fontSize: '13px' }} href="/login">{t('home.alreadyHaveAccount')}</a>
                  </Col>
                </Row>
                <Form.Group controlId="selectControl">
                  <Form.Label>
                    {t('home.userType')}
                  </Form.Label>
                  <Form.Control as="select" value={userType} onChange={handleUserTypeChange}>
                    <option value="Recipient">{t('home.recipient')}</option>
                    <option value="Donor">{t('home.donor')}</option>
                  </Form.Control>
                </Form.Group>

                {userType === 'Donor' && (
                  <div>
                    <Form.Group className="mb-2">
                      <Form.Label>{t('home.email')}</Form.Label>
                      <Form.Control
                        placeholder='Enter Email'
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                      {errors.email && <span className="error">{errors.email}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label> {t('home.firstName')}</Form.Label>
                      <Form.Control
                        placeholder='Enter First Name'
                        value={firstName}
                        name="firstName"
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                      />
                      {errors.firstName && <span className="error">{errors.firstName}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>  {t('home.lastName')}</Form.Label>
                      <Form.Control
                        placeholder='Enter Last Name'
                        value={lastName}
                        name="lastName"
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                      />
                      {errors.lastName && <span className="error">{errors.lastName}</span>}
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label> {t('home.profilePicture')}</Form.Label>
                      <Form.Control
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                        type="file"
                      />
                      {errors.profilePicture && <span className="error">{errors.profilePicture}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                  <Form.Label>{t('home.password')}</Form.Label>
                  <Form.Control
                    placeholder='Enter Password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </Form.Group>
                <Form.Group>
                  <Button
                    type="submit"
                    color="primary"
                    onClick={handleSignup}
                    className=" w-100"

                  >
                    {t('home.createProfile')}
                  </Button>
                </Form.Group>
                  </div>
                )}

                {userType === 'Recipient' && (
                  <div>
                    <Form.Group className="mb-2">
                      <Form.Label>   {t('home.name')}</Form.Label>
                      <Form.Control
                        placeholder='Enter Name'
                        value={name}
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                      />
                      {errors.name && <span className="error">{errors.name}</span>}
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>{t('home.email')}</Form.Label>
                      <Form.Control
                        placeholder='Enter Email'
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                      {errors.email && <span className="error">{errors.email}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label> {t('home.phone')}</Form.Label>
                      <Form.Control
                        placeholder='Enter Phone'
                        value={phone}
                        name="phone"
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                      />
                      {errors.phone && <span className="error">{errors.phone}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label> {t('home.recipientType')}</Form.Label>
                      <Form.Control
                        placeholder='Enter Phone'
                        value={phone}
                        name="phone"
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                      />
                      {errors.phone && <span className="error">{errors.phone}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label> {t('home.recipientType')}</Form.Label>
                      <Form.Control as="select" value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                        <option disabled value='select'>Select from below</option>
                        {details.types?.map((ele,ind)=>{
                          return(
                            <option value={ele}>{ele}</option>
                          )
                        })}
                        {/* <option value="Type A">Type A</option> */}
                      </Form.Control>
                      {errors.recipientType && <span className="error">{errors.recipientType}</span>}
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>{t('home.profilePicture')}</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                      />
                      {errors.profilePicture && <span className="error">{errors.profilePicture}</span>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                  <Form.Label>{t('home.password')}</Form.Label>
                  <Form.Control
                    placeholder='Enter Password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </Form.Group>
                <Form.Group>
                  <Button
                    type="submit"
                    color="primary"
                    onClick={handleSignup}
                    className=" w-100"

                  >
                    {/* <PaypalCheckOut2 amount='10' recipientId={recipient._id} /> */}
                    {/* <PaypalCheckOut2 amount={parseFloat(10)} recipientId={12312321} /> */}
                    <PaypalCheckOut3 amount={parseFloat(10)} recipientId={12312321} />
                    {/* {t('home.startWithOneMonthFreeTrail')} */}
                  </Button>
                </Form.Group>
                  </div>
                )}
              
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Section >
    </>

  );
};

export default SignupPage;
