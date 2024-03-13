import React from 'react';
import '../PagesStyling/Navbar.css'
import { useTranslation } from 'react-i18next';
export const AdminNav = () => {
  let {t}=useTranslation()
  return (
    <div className='Navbar_Nav'>
      <nav style={{position: 'fixed',zIndex:'100',top:'0',width:'100%'}} className="navbar navbar-expand-lg bg-black"> {/* Change background color to black */}
        <div className="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active text-secondary" aria-current="page" href="/portfolio">{t('home.howItWorks')}</a> {/* Change active link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary" href="/aboutus">{t('home.whoWeAre')}</a> {/* Change link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary" href="/register">{t('home.joinUs2')}</a> {/* Change link text color */}
              </li>
              <li className="nav-item">
                <a className="nav-link text-secondary" href="/contact">{t('home.contactUs')}</a> {/* Change link text color */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
