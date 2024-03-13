import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../PagesStyling/Home_main.css'
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import PagesFooter from '../PageComponents/PagesFooter';
import ToggleSwitch from './ToggleSwitch';
// import PayPalCheckout from '../PageComponents/PayPalCheckout';
import Switch from 'react-switch'; // Import the react-switch component

const Home = () => {
  // const [isPayPalVisible, setIsPayPalVisible] = useState(false);

  const { t } = useTranslation();
  let [recipients, updateRecipients] = useState([])
  let fetchDetals = async () => {
    let val = await axios.get('/receipientOnly');
    console.log('val.data', val.data)
    updateRecipients(val.data)
    console.log('recipients', recipients)
  }
  useEffect(() => {
    fetchDetals()
  }, [])
  let navigate = useNavigate()
  let fetchNextPage = (e) => {
    console.log(e)
    navigate(`/recipient/${e}`)
  }
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
   const [languageSwitch, setLanguageSwitch] = useState(false);

  const toggleLanguage = () => {
    setLanguageSwitch(!languageSwitch);
    const selectedLanguage = languageSwitch ? 'en' : 'ar';
    i18n.changeLanguage(selectedLanguage);
  };
  return (
    <div>
      <Navbar />
      {/* <div className='language-toggle'>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ar')}>العربية</button>
        <button onClick={() => changeLanguage('ur')}>Urdu</button>
      </div> */}
      <div className="language-toggle">
        <Switch
          onChange={toggleLanguage}
          checked={languageSwitch}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor="#7cc9b9"
          offColor="#dcdcdc"
        />
        </div>

      <div className='HomeMain'>

        <div className="hero_area">
          {/* <!-- header section strats --> */}
          <header className="header_section long_section px-0">

          </header>
          {/* <!-- end header section --> */}
          {/* <!-- slider section --> */}
          <section className="slider_section long_section">
            <div id="customCarousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="container ">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="detail-box">
                          <h1>
                            {t('home.empoweringChange')}
                          </h1>
                          <p>
                            {t('home.joinUs')}
                          </p>
                          <div className="btn-box">
                            <a style={{ textDecoration: 'none' }} href="/Campaign" className="btn1">
                              Campaign
                            </a>
                            <a style={{ textDecoration: 'none' }} href="/recipientSearch" className="btn2">
                              Recipients
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <div className="img-box">
                          <img src="1/images/slider-img.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="container ">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="detail-box">
                          <h1>
                            {t('home.empoweringChange')}
                          </h1>
                          <p>
                            {t('home.joinUs')}
                          </p>
                          <div className="btn-box">
                            <a style={{ textDecoration: 'none' }} href="/Campaign" className="btn1">
                              Campaign
                            </a>
                            <a style={{ textDecoration: 'none' }} href="/recipientSearch" className="btn2">
                              Recipients
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <div className="img-box">
                          {/* <img src="1/images/slider-img.png" alt="" /> */}
                          <img style={{ height: "300px" }} src="img/1.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ol className="carousel-indicators">
                <li data-target="#customCarousel" data-slide-to="0" className="active"></li>
                <li data-target="#customCarousel" data-slide-to="1"></li>
                {/* <li data-target="#customCarousel" data-slide-to="2"></li> */}
              </ol>
            </div>
          </section>
          {/* <!-- end slider section --> */}
        </div>


        {/* <!-- client section --> */}

        <section className="client_section layout_padding-bottom">
          <div className="container">
            <div className="heading_container">
              <h2>
                {/* Recipients */}
                {t('home.sectionTitle')}

              </h2>
            </div>

            <div id="carouselExample2Controls" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                {
                  recipients.length !== 0 ?
                    recipients.map((recipient, index) =>
                      <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={recipient.id}>
                        <div className="row">
                          <div className="col-md-11 col-lg-10 mx-auto">
                            <div onClick={() => fetchNextPage(recipient._id)} style={{ cursor: "pointer" }} className="box">
                              <div className="img-box">
                                <img src={`uploads/${recipient.profilePicture}`} alt="" />
                              </div>
                              <div className="detail-box">
                                <div className="name">
                                  <i className="fa fa-quote-left" aria-hidden="true"></i>
                                  <h6 style={{ cursor: "pointer" }}>{recipient.name}</h6>
                                </div>
                                <p style={{ cursor: "pointer" }}>{recipient.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      // )}
                    )
                    : ''
                }
              </div>
              <div className="carousel_btn-container">
                <a className="carousel-control-prev" href="#carouselExample2Controls" role="button" data-slide="prev">
                  <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                  <span className="sr-only">{t('home.previous')}</span>
                </a>
                <a className="carousel-control-next" href="#carouselExample2Controls" role="button" data-slide="next">
                  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                  {/* <span className="sr-only">Next</span> */}
                  <span className="sr-only">{t('home.next')}</span>
                </a>
              </div>
            </div>

          </div>
        </section>
      </div>
      {/* <td onClick={() => setIsPayPalVisible(!isPayPalVisible)}>
        <button>Show PayPal</button>
      </td> */}
      {/* {isPayPalVisible && (
        <td>
          <PayPalCheckout />
        </td>
      )} */}

      <PagesFooter />
    </div>
  )
}

export default Home