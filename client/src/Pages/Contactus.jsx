import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../PageComponents/Navbar';
import { useTranslation } from 'react-i18next';
import PagesFooter from '../PageComponents/PagesFooter';
import '../PagesStyling/Contact.css'; // Import your image

const Contact = () => {
  let Navigate = useNavigate();
  let [state3, updateState3] = useState();
  let inputEvent = (e) => {
    updateState3({ ...state3, [e.target.name]: e.target.value });
    console.log(state3);
  };
  let ContactUs = async (e) => {
    e.preventDefault();
    let val = await fetch('/contactUs', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify(state3),
    });
    console.log(val);
    if (val.status === 200) {
      alert('Message has been sent successfully');
      Navigate('/');
    } else {
      alert('Error! Please try again later');
      Navigate('/');
    }
  };
  const { t } = useTranslation();
  return (
    <div>
      <Navbar />
      <div
        style={{ marginTop: '3%' }}
        className="container-xxl pb-5"
        id="contact"
      >
        {/* Image at the top */}
        {/* <img
          src={contactImage}
          alt="Contact Image"
          className="contact-image"
        /> */}

        <div className="container py-5">
          <div className="row g-5 mb-5 wow fadeInUp" data-wow-delay="0.1s">
            <div className="col-lg-6">
              <h1 className="display-5 mb-0">
                {t('home.letsWorkTogether')}
              </h1>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-5 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <p className="mb-2">{t('home.residence')}:</p>
              <h3 className="fw-bold">{t('home.city')}</h3>
              <hr className="w-100" />
              <p className="mb-2">{t('home.callUs')}</p>
              <h3 className="fw-bold">+92 123 113213</h3>
              <hr className="w-100" />
              <p className="mb-2">{t('home.mailUs')}</p>
              <h3 className="fw-bold">mail@gmail.com</h3>
              <hr className="w-100" />
              <p className="mb-2">{t('home.followUs')}:</p>
              <div className="d-flex pt-2">
                <a className="btn btn-square btn-primary me-2" href="#">
                  <i className="fab fa-twitter"></i>
                </a>
                <a className="btn btn-square btn-primary me-2" href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a className="btn btn-square btn-primary me-2" href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-square btn-primary me-2" href="#">
                  <i className="fab fa-youtube"></i>
                </a>
                <a className="btn btn-square btn-primary me-2" href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div
              className="col-lg-7 col-md-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <form
                action="https://formspree.io/f/mvonbjvb"
                method="POST"
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        onChange={inputEvent}
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                      />
                      <label htmlFor="name">{t('home.name')}</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        onChange={inputEvent}
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                      />
                      <label htmlFor="email">{t('home.email')}</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        onChange={inputEvent}
                        type="text"
                        name="subject"
                        className="form-control"
                        id="subject"
                        placeholder="Subject"
                      />
                      <label htmlFor="subject">
                        {t('home.subject')}
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        onChange={inputEvent}
                        className="form-control"
                        name="message"
                        placeholder="Leave a message here"
                        id="message"
                        style={{ height: '100px' }}
                      ></textarea>
                      <label htmlFor="message">
                        {t('home.message')}
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      onClick={ContactUs}
                      className="btn btn-primary py-3 px-5"
                      type="submit"
                    >
                      {t('home.sendMessage')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <PagesFooter />
    </div>
  );
};

export default Contact;
