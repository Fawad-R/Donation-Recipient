
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Campaign from './Pages/Campaign';
import PageProfile from './Pages/PageProfile';
import Recipient_search from './Pages/Recipient_search';
import SignupPage from './Pages/SignupPage';
import RecipientPage from './Pages/RecipientPage';
import AccountingPage from './Pages/AccountingPage';
import Login from './Pages/Login';
import ForgetPassword from './Pages/ForgetPassword';

import AdminPage from './Admin_Dashboard/Pages/AdminPage';
import PagesFooter from './PageComponents/PagesFooter';
// import { Navbar } from './PageComponents/Navbar';
import './App.css';
import UserPanel from './Pages/UserPanel';
import Contactus from './Pages/Contactus';
import Aboutus from './PageComponents/Aboutus';
import Portfolio from './PageComponents/Portfolio';
// import Settings from './Pages/Settings';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Campaign2 from './Pages/Campaign2';
import RecipientPanel from './Pages/RecipientPanel';
import UserPanel2 from './Pages/UserPanel2';
import SingleCampaign from './Pages/SingleCampaign';
import DonorPanel from './Pages/DonorPanel';
// import UserPage from './User_Dashboard/Pages/UserPage';

i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: require('./locales/en.json'),
      },
      ar: {
        translation: require('./locales/ar.json'),
      },
      ur: {
        translation: require('./locales/ur.json'),
      },
    },
    fallbackLng: 'en',
    debug: true,
  });

const App = () => {
  
  return (
    <>
    <I18nextProvider i18n={i18n}>
    {/* <Navbar/> */}
      <Routes>
        {/* main */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/campaign" element={<Campaign />} /> */}
        <Route path="/campaign" element={<Campaign2 />} />
        <Route path="/recipientSearch" element={<Recipient_search />} />
        <Route path="/profile" element={<PageProfile />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/recipient/:id" element={<RecipientPage />} />
        {/* <Route path="/singleCampaign/:id" element={<SingleCampaign />} /> */}
        <Route path="/accounting/:id" element={<AccountingPage />} />
        <Route path="/adminPanel" element={<AdminPage />} />
        {/* <Route path="/userDashboard" element={<UserPage />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/userPanel" element={<UserPanel2/>} />
        {/* <Route path="/userPanel" element={<UserPanel/>} /> */}
        <Route path="/recipientPanel" element={<RecipientPanel/>} />
        <Route path="/donorPanel" element={<DonorPanel/>} />
        <Route path="/contact" element={<Contactus/>} />
        <Route path="/aboutus" element={<Aboutus/>} />
        <Route path="/portfolio" element={<Portfolio/>} />
        {/* <Route path="/settings" element={<Settings/>} /> */}

      </Routes>
      <div >
        {/* style={{ marginTop: "400px" }} */}
        {/* <PagesFooter /> */}
      </div>
      </I18nextProvider>
    </>

  )
}

export default App