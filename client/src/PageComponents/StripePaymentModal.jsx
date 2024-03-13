import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import img from '../image/23.JPG'

let stripeKey = "pk_test_51MFGxxGsyHFe5lQADpu8EQF9BKy1N7wdpsmYQhwFGtv6ovbZ93uDWb6cTW92Dsr50q2p0zyjOI01O6VDYjthwf5K00zyktNRfo"
const StripePaymentModal = ({ isOpen, onRequestClose, recipient }) => {
  
      let Navigate = useNavigate()
  
      let subtotal = 0;
      let standard = 0;
      let express = 0;
      let total = 0;
      let [state, updateState] = useState([])
      // let [state2,updateState2]=useState({airpods: '1', headphones: '1', Menshoes: '1'})
      let [state2, updateState2] = useState(1)
      let [state3, updateState3] = useState(0)
      let useparamsid = useParams()
  
      // const cart = useSelector((state) => state.cart);
      let [state1, updateState1] = useState(null);
      let [OrderId, setOrderId] = useState(null);
      useEffect(() => {
          let sentRequest = async () => {
              try {
                  let val = await axios.post('/payment', {
                      tokenId: state1.id,
                      amount: subtotal + parseInt(state3),
                  })
                  // console.log(val);
                  // Navigate("/success", {
                  // 	stripeData: val.data,
                  // 	products: state });
                  // console.log('stateee',state);
                  const res = await axios.post("/order", {
                      // userId: currentUser._id,
                      // products: state.products.map((item) => ({
                      products: state.map((item) => ({
                          productId: item._id,
                          quantity: item._quantity,
                          //   key:ele._id
                      })),
                      amount: subtotal + parseInt(state3),
                      // address: data.billing_details.address,
                      address: val.data.billing_details.address
                  });
                  setOrderId(val.data._id);
                  //   console.log('res',res);
                  alert('payment successfull')
                  Navigate('/')
              } catch (err) {
                  // console.log(err);
                  alert('Error! cannot proceed at the moment')
              }
          }
          state1 && sentRequest();
      }, [state1])
      let onToken = (token) => {
          updateState1(token);
          // console.log(token);
      }
  
      let inputRadio = (e) => {
  
          // console.log(e.target);
          // console.log(e.target.value);
          updateState3(e.target.value)
      }
      let fetchCart = async () => {
          // console.log('fetching');
          let val = await axios.get(`/cart/cart/cart/cart/${useparamsid.id}`);
          // console.log('fetching2');
          // console.log('val from cart',val)
          updateState(val.data);
      }
      useEffect(() => {
          fetchCart()
      }, [])
      let getQuantity = (e) => {
          updateState2({ ...state2, [e.target.name]: e.target.value });
      }
      let DeleteItem = async (e) => {
          let val = await fetch(`/cart/${e}`, {
              method: "DELETE",
              headers: {
                  "content-Type": "application/json"
              },
          })
          try {
  
              if (val.status === 200) {
                  alert('Item sucessfully deleted from cart!')
                  Navigate('/')
              }
              else {
                  alert('Error removing item!')
              }
          } catch (error) {
              alert(error)
          }
      }
      let ProceedToCheck = async (e) => {
          e.preventDefault();
          let val = await fetch('/order', {
              "method": "POST",
              "headers": {
                  "content-Type": "application/json"
              },
              body: JSON.stringify({})
          })
      }
      return (
          <>
              <div>
                  <main className="main">
                      <div className="page-content">
                          <div className="cart">
                              <div className="container">
                                  <div className="row">
                                      <div className="col-lg-9">
  
                                      </div>
                                      <aside className="col-lg-3">
                                          <div className="summary summary-cart">
                                              <StripeCheckout name="Codeko Course Payment"
                                                  description="The more you learn the more you earn"
                                                  // image="https://www.pngwing.com/en/search?q=payment" // the pop-in header image (default none)
                                                  image={img}
                                                  shippingAddress
                                                  billingAddress
                                                  amount={(subtotal + parseInt(state3)) * 100}
                                                  token={onToken}
                                                  stripeKey={stripeKey}
                                              >
                                                  <button href="" className="btn btn-outline-primary-2 btn-order btn-block">PROCEED TO CHECKOUT</button>
                                              </StripeCheckout>
                                          </div>
  
                                      </aside>
  
                                  </div>
                              </div>
                          </div>
                      </div>
                  </main>
  
              </div>
          </>
      )
  }
  
export default StripePaymentModal;
