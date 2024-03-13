import React from 'react'
import { Navbar } from './Navbar'
import '../PagesStyling/Portfolio.css'
import { useTranslation } from 'react-i18next';
import PagesFooter from './PagesFooter';

function Portfolio() {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      <div className="portfolio">
        {/* <h1>{t('home.title')}</h1> */}
        <div className="portfolio-items">
          <div className="portfolio-item">
            <img
              className="portfolio-image"
              src="img/p3.jpg"
              alt="Portfolio Item 1"
            />
            <div className="portfolio-details">
              <h2 className="portfolio-title">Project 1</h2>
              <p className="portfolio-description">
                Description of the first project goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="portfolio-item">
            <img
              className="portfolio-image"
              src="img/p2.jpg"
              alt="Portfolio Item 1"
            />
            <div className="portfolio-details">
              <h2 className="portfolio-title">Project 2</h2>
              <p className="portfolio-description">
                Description of the first project goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="portfolio-item">
            <img
              className="portfolio-image"
              src="img/p1.jpeg"
              alt="Portfolio Item 1"
            />
            <div className="portfolio-details">
              <h2 className="portfolio-title">Project 3</h2>
              <p className="portfolio-description">
                Description of the first project goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="portfolio-item">
            <img
              className="portfolio-image"
              src="img/p2.jpg"
              alt="Portfolio Item 1"
            />
            <div className="portfolio-details">
              <h2 className="portfolio-title">Project 4</h2>
              <p className="portfolio-description">
                Description of the first project goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="portfolio-item">
            <img
              className="portfolio-image"
              src="img/p3.jpg"
              alt="Portfolio Item 1"
            />
            <div className="portfolio-details">
              <h2 className="portfolio-title">Project 5</h2>
              <p className="portfolio-description">
                Description of the first project goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          <div className="portfolio-item">
            <img
              className="portfolio-image"
              src="img/p1.jpeg"
              alt="Portfolio Item 2"
            />
            <div className="portfolio-details">
              <h2 className="portfolio-title">Project 6</h2>
              <p className="portfolio-description">
                Description of the second project goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="explore-button">Explore</button>
            </div>
          </div>
          {/* Add more portfolio items as needed */}
        </div>
      </div>
      <PagesFooter />
    </div>
  );
}

export default Portfolio;
