import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import '../PagesStyling/SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '../PageComponents/LanguageSwitch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import FullCalendar from '@fullcalendar/react';
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
            else if(val2.userType == 'Recipient') {
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
     {/* <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // You can choose a different view
        events={[
          // Define your calendar events here
          // Example:
          { title: 'Event 1', date: '2023-10-15' },
          { title: 'Event 2', date: '2023-10-20' },
        ]}
      /> */}
    
      <ToastContainer />
      <Navbar />
      {/* <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
      <button onClick={() => changeLanguage('ur')}>urdu</button>
    </div> */}

      <div className="signup-page">
        <div className="signup-page0">
          <h1>{t('home.signup')}</h1>
          {/* <a style={{marginBottom:"2%"}} href="/login">Already have an account? login here</a> */}
          <a  style={{ marginBottom: "2%",fontSize:'13px' }} href="/login">{t('home.alreadyHaveAccount')}</a>
          <label>
            {t('home.userType')}
            <select value={userType} onChange={handleUserTypeChange}>
              {/* <option value="Recipient">Recipient</option>
          <option value="Donor">Donor</option> */}
              <option value="Recipient">{t('home.recipient')}</option>
              <option value="Donor">{t('home.donor')}</option>
            </select>
          </label>

          {userType === 'Donor' && (
            <div>
              <label>
                {t('home.email')}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </label>

              <label>
                {t('home.firstName')}
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </label>
              <label>
                {t('home.lastName')}
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </label>
              <label>
                {t('home.profilePicture')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
                {errors.profilePicture && <span className="error">{errors.profilePicture}</span>}
              </label>
            </div>
          )}

          {userType === 'Recipient' && (
            <div>
              <label>
                {t('home.name')}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </label>
              <label>
                {t('home.email')}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </label>
              <label>
                {t('home.phone')}
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </label>
              <label>
                {t('home.recipientType')}
                <br />
                {/* <input
              type="text"
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
            /> */}
                <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                  <option disabled value='select'>Select from below</option>
                  <option value="Type A">Type A</option>
                  <option value="Type B">Type B</option>
                </select>

                <br />
                {errors.recipientType && <span className="error">{errors.recipientType}</span>}
              </label>
              <label>
                {t('home.profilePicture')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
                {errors.profilePicture && <span className="error">{errors.profilePicture}</span>}
              </label>
            </div>
          )}

          <label>
            {t('home.password')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </label>

          <button onClick={handleSignup}>{t('home.createProfile')}</button>
        </div>
      </div>  
      {/* </FullCalendar>       */}
    </>

  );
};

export default SignupPage;
