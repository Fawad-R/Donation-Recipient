import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
const SERVER_BASE_URL = "http://localhost:8000";
const SUBSCRIPTION_PLAN_ID = "P-473782074G3832509MUWJSCA";
const PAYPAL_CLIENT_ID = 'AWEBXDBUf4NFaypx21ZRgnBjWOggGUg---87pQ87ldc1tpuQtnWD5VxJQycaUb1Afu2xBlcQEl-GLpBQ';

function PaypalCheckOut2(props) {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState("");
    const [orderID2, setOrderID2] = useState(null);
    const [orderIDCheck, setOrderID2Check] = useState(false);
    const [customAmount, setCustomAmount] = useState(props.amount);
    const [recipientId, setRecipientId] = useState(props.recipientId);

    const createOrder = async (data, actions, customAmount) => {
        console.log('data_createODer', data)
        try {
            const response = await axios.post(`/create-order`, {
                plan_id: SUBSCRIPTION_PLAN_ID,
                amount: customAmount,
                recipientId: recipientId
            });
            setOrderID2(response.data.id);
            setOrderID(response.data.id);
            if (orderID2 !== null) {
                setOrderID2Check(true);
            }
            console.log('customAmount', customAmount)
            console.log('response.data.id', response.data.id)
            const order = await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD", // Adjust this as per your currency
                            value: customAmount.toFixed(2), // Ensure it's formatted properly
                        },
                    },
                ],
            });
            // Call PayPal to create the order
            // const createOrderResult = await actions.order.create({
            //     intent: "CAPTURE",
            //     purchase_units: [orderDetails],
            // });
            console.log('order.orderID', order)
            console.log('order.orderID', order.orderID)
            console.log('response.data.id', response.data.id)
            // return order.orderID;    
            // return order;    
            // return { orderID, order: response };
            return orderID, order
            // return response.data.id;
            // return { orderID:response.data.id };
        } catch (error) {
            setErrorMessage("An error occurred while initiating the subscription.");
            return null;
        }
    };

    const onApprove = async (data, actions) => {
        console.log('data_onApprove', data)
        try {
            let val = await fetch('/capture-payment', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ data, recipientId, customAmount })
            });
            setSuccess(true);
            alert("Subscription successful!!");
            localStorage.setItem('subscription2', JSON.stringify('true'))
            // localStorage.setItem('monthlyChargesActive2', JSON.stringify('true'))
        } catch (error) {
            setErrorMessage("An error occurred while capturing the payment.");
        }
    };

    useEffect(() => {
        if (success) {
            console.log("Order successful. Your order ID is:", orderID);
        }
    }, [success, orderID]);

    return (
        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} lg={6}>
              <Form.Group>
                <Form.Control
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseFloat(e.target.value))}
                  className="table-input"
                />
              </Form.Group>
            </Col>
            <Col xs={12} lg={6}>
              <Button className="buy-btn" type="submit" onClick={() => setShow(true)}>
                Paypal
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-center">
              {errorMessage && <p>{errorMessage}</p>}
            </Col>
          </Row>
          {show && (
            <Row>
              <Col xs={12} className="text-center">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => createOrder(data, actions, customAmount)}
                  onApprove={(data, actions) => onApprove(data, actions)}
                />
              </Col>
            </Row>
          )}
        </Container>
      </PayPalScriptProvider>
    );
}

export default PaypalCheckOut2;
