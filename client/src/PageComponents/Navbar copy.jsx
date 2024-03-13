import React from 'react';
import '../PagesStyling/Navbar.css'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
export const Navbar = () => {
  const { t } = useTranslation()
  const [data, setData] = useState(null);

  const [systemSettings, setSystemSettings] = useState(null);
  let serverAddress
  let logoURL
  let fetchData = async () => {
    let val = await axios.get('/system-settings')
    console.log('val_data', val)
    setData(val.data)
    serverAddress = 'http://localhost:8000'; // Replace with your server address
    logoURL = `${serverAddress}/${val.data?.logo?.replace(/\\/g, '/')}`;
    console.log('logoURL', logoURL)
    const faviconLink = document.getElementById('dynamic-favicon');
    if (faviconLink) {
      console.log('faviconLink', faviconLink)
      faviconLink.href = `uploads/${val.data.favicon}`;
    }
  }

  // const logoURL = `${serverAddress}/${data.logo.replace('\\', '/')}`;
  useEffect(() => {
    fetchData()
  }, []);
  if (data && data.title) {
    document.title = data.title;
  }
  return (
    // style={{backgroundColor:"#6bb7be"}}
    <nav className="navbar navbar-expand-lg navbar bg-primary  border-bottom border-body sticky-top "    data-bs-theme="dark">
      <div className="container-fluid">
        {/* <a className="navbar-brand" href="#">Navbar</a> */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
           
            
            <li className="nav-item">
                <a className="nav-link   " aria-current="page" href="/">{t('home.home')}</a> {/* Change active link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link  " aria-current="page" href="/portfolio">{t('home.howItWorks')}</a> {/* Change active link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link " href="/aboutus">{t('home.whoWeAre')}</a> {/* Change link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link " href="/register">{t('home.joinUs2')}</a> {/* Change link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link " href="/contact">{t('home.contactUs')}</a> {/* Change link text color */}
              </li>
          </ul>
          <form className="d-flex">
            {data !== null ?
              <>
                <div className='dflex'>
                  <img style={{
                    width: '60px',
                    height: '55px', // This maintains the image's aspect ratio
                    marginRight: '10px', // Add margin to control spacing
                    borderRadius: '200px', // Add margin to control spacing
                  }} src={`uploads/${data.logo}`} size="l" name={data.logo} />
                </div>
                {data && <link rel="icon" type="image/x-icon" href={`uploads/${data.favicon}`} />}


              </>
              : ''}
          </form>
        </div>
      </div>
    </nav>);
};
