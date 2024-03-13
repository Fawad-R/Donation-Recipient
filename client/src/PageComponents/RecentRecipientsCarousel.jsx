import React from 'react';
import Slider from 'react-slick';
import '../PagesStyling/RecipientCorousel.css'
import { useNavigate } from 'react-router-dom';

const RecentRecipientsCarousel = ({ recipients }) => {
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop through recipients
    speed: 500, // Transition speed
    slidesToShow: 3, // Show 3 recipients at a time
    slidesToScroll: 3, // Scroll 3 recipients at a time
  };
  let navigate = useNavigate()
  // const keysArray = recipients.map(obj => Object.values(obj));
  // console.log('keysArray',keysArray)
  let fetchNextPage = (e) => {
    console.log(e)
    navigate(`/recipient/${e}`)
  }
  return (
    <div className="recipient-slider">
      <Slider {...settings}>
        {console.log('recipients in recipients', recipients)}
        {console.log('recipients in recipients', recipients.flat())}
        {/* {recipients.map((recipient) => (
          <div key={recipient._id} className="recipient-card">
            <div onClick={() => fetchNextPage(recipient._id)} className="recipient-details2">
              <p>{recipient.name}</p>
              <p>{recipient.email}</p>
              <p>{recipient.recipientType}</p>
              <img src={`uploads/${recipient.profilePicture}`} alt="" />
            </div>
          </div>
        ))} */}
        {
          recipients.map((recipient, ind) => {
            if (recipient.userType === 'Recipient') {
              return (
                <div key={recipient._id} className="recipient-card">
                  {/* Render recipient information here */}
                  <div onClick={() => fetchNextPage(recipient._id)} className="recipient-details2">
                    <p>{recipient.name}</p>
                    <p>{recipient.email}</p>
                    <p>{recipient.recipientType}</p>
                    <img src={`uploads/${recipient.profilePicture}`} alt="" />
                  </div>
                </div>
              )
            }
          })
        }
      </Slider>
    </div>
  );
};

export default RecentRecipientsCarousel;
