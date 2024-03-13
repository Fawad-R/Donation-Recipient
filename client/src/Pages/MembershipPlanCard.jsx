import React from 'react';
import '../PagesStyling/MembershipPlanCard.css';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
const MembershipPlanCard = ({ planType, price, features, savings, buttonText }) => {
    let Navigate = useNavigate()
    let stripeKey = "pk_test_51MFGxxGsyHFe5lQADpu8EQF9BKy1N7wdpsmYQhwFGtv6ovbZ93uDWb6cTW92Dsr50q2p0zyjOI01O6VDYjthwf5K00zyktNRfo";
    const onToken = async (token, recipient) => {

        try {
            const response = await axios.post('/payment/payment', {
                tokenId: token,
                amount: 149 * 100, // Amount in cents
                // recipientId: recipient._id,
            });
            if (response.status === 200) {
                localStorage.setItem('subscription', JSON.stringify('true'))
                localStorage.setItem('monthlyChargesActive', JSON.stringify('true'))
                alert('Thank You for your donation');
            }
        }
        catch (error) {
            alert(error)
        }
    };

    return (
        // <div className='MembershipPlanCard0'>
            <div className='MembershipPlanCard'>

                <div className="membership-plan-card">
                    <h2>{planType}</h2>
                    <p className="price">{price}</p>
                    <ul className="features-list">
                        {features.map((feature, index) => (
                            <>
                                <li key={index}> <DoneIcon style={{ fontSize: "13px" }} /> {feature} </li>
                            </>
                        ))}
                    </ul>
                    <p className="savings">{savings}</p>
                    {buttonText !== 'Sign Up' ?
                        // <StripeCheckout
                        //     name="Donation"
                        //     description="Donate us"
                        //     image="img/Donate.jpg"
                        //     shippingAddress
                        //     billingAddress
                        //     amount={149 * 100}
                        //     token={(token) => onToken(token)}
                        //     stripeKey={stripeKey}
                        // >
                        <button onClick={() => { Navigate('/Campaign') }} className="table-button">{buttonText}</button>
                        // </StripeCheckout>
                        :
                        <button onClick={() => { Navigate('/Campaign') }} >{buttonText}</button>}
                </div>
            </div>
        // </div>
    );
};

export default MembershipPlanCard;
