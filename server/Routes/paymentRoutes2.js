const express = require('express');
const router = express.Router();
const User = require('../Schema/UserSchema'); 
const Transaction = require('../Schema/TransactionSchema'); 
const Auth = require('../Middleware/Auth');
const paypal = require('paypal-rest-sdk');
const axios = require('axios');

paypal.configure({
    mode: 'sandbox', // Change to 'live' for production
    client_id: 'AV8HD_qZucZtfy2iGzWlqrPX9-x95GM3Ddb21q36Rz_EZFHbnDDJo4rGIMby9DV_aVHOp-dpjfjoyx-5',
    client_secret: 'EJA0sfFIXl2yWZbVSRASZxAfN76SM8apQ6l2v7SZP94RQTE_xtUpT2GZuYFkMCw8yCvIfvM90FPNho36',
});

const PAYPAL_CLIENT_ID = 'AWEBXDBUf4NFaypx21ZRgnBjWOggGUg---87pQ87ldc1tpuQtnWD5VxJQycaUb1Afu2xBlcQEl-GLpBQ';
let PAYPAL_CLIENT_SECRET = 'EJWKEv3OXnBh5GVcMaNmVoPx1jW8XW8uCKnB5XpV14r3145cmFzPAp64N-oZ9wUKnEv9mGsE0FDIxtuO';
let PLAN_ID = 'P-473782074G3832509MUWJSCA';


const generateAccessToken = async () => {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    console.log('I am auth', auth)
    // const response = await axios.post("https://api.paypal.com/v1/oauth2/token", "grant_type=client_credentials", {
    const response = await axios.post("https://api.sandbox.paypal.com/v1/oauth2/token", "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const accessToken = response.data.access_token;
    console.log("I am Access Token:", accessToken);
    return response.data.access_token;
};

// Endpoint to create a PayPal order
router.post("/create-order", async (req, res) => {
    try {
        console.log('req.body_create',req.body)
        const accessToken = await generateAccessToken();
        console.log('accessToken', accessToken)
        const createOrderResponse = await createOrder(accessToken, req.body.plan_id,req.body.amount);
        console.log('createOrderResponse', createOrderResponse)
        res.json(createOrderResponse);
    } catch (error) {
        console.log('i am here')
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

// Function to create a PayPal order
const createOrder = async (accessToken, planID,value) => {
    console.log('value',value)
    const response = await axios.post(
        // "https://api.paypal.com/v2/checkout/orders",
        "https://api.sandbox.paypal.com/v2/checkout/orders",
        {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: value, // Replace with the subscription amount
                    },
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};

// Endpoint to capture the payment
router.post("/capture-payment", Auth, async (req, res) => {
    try {
        const accessToken = await generateAccessToken();
        console.log('i am capture token', accessToken)
        console.log('req.body', req.body)
        const capturePaymentResponse = await capturePayment(accessToken, req.body.data.orderID);
        // const capturePaymentResponse = await capturePayment(accessToken, req.body.e.orderID);
        console.log('i am capturePaymentResponse', capturePaymentResponse)
        console.log('capturePaymentResponse.status', capturePaymentResponse.status)
        if (capturePaymentResponse.status === "COMPLETED") {
            console.log('i am inside')
            console.log(req.body)
            console.log('new Date()', new Date())
            // console.log('req.body.e.payerID'), req.body.e.payerID
            console.log('req.body.e.payerID'), req.body.data.payerID
            // console.log('req.body.payer.payerID'), req.body.payer_id
            console.log('capturePaymentResponse.id'), capturePaymentResponse.id
            // console.log(' capturePaymentResponse.purchase_units[0].amount.currency_code'), capturePaymentResponse.purchase_units[0].amount.currency_code
            // console.log('capturePaymentResponse.purchase_units[0].amount.value',capturePaymentResponse.purchase_units[0].amount.value)
            const newTransaction = new Transaction({
                amount: req.body.customAmount,
                // paymentDate: new Date(),
                donor: req.user._id, // Assuming you have user authentication and `req.user` contains the donor's ID
                recipient: req.body.recipientId, // Replace with the recipient's user ID
                payer: req.body.data.payer_id, // Replace with the recipient's user ID
                status: "successful",
                paymentMethod: "PayPal", // You can specify the payment method
                transactionId: capturePaymentResponse.id,
                // currency: capturePaymentResponse.purchase_units[0].amount.currency_code,
                description: "Description of the payment",
            });
            console.log('newTransaction', newTransaction)
            await newTransaction.save(); // Save the new Transaction document to the database
            let active=true
            const createSubscriptionResponse = await createSubscription(accessToken, PLAN_ID, req.body.payerID,capturePaymentResponse,active);
            console.log('createSubscriptionResponse',createSubscriptionResponse)
            let subscription2=createSubscriptionResponse
           let val=await User.findOneAndUpdate({_id:req.user._id},{subscription2})
           console.log('Val1',val) 
        }
        res.json(capturePaymentResponse);
    } catch (error) {
        // , error
        console.error("Failed to capture payment:", error);
        res.status(500).json({ error: "Failed to capture payment." });
    }
});

// Function to capture a PayPal payment
const capturePayment = async (accessToken, orderID) => {
    console.log('i am capturePayment response accesstoken', accessToken)
    console.log('i am capturePayment response orderID', orderID)
    const response = await axios.post(
        // `https://api.paypal.com/v2/checkout/orders/${orderID}/capture`,
        `https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    console.log('i am capturePayment response accesstoken', accessToken)
    console.log('i am capturePayment response orderID', orderID)
    console.log('i am capturePayment response', response.data)
    return response.data;
};
const createSubscription = async (accessToken, planID, customerID,capturePaymentResponse) => {
    console.log('i am crete',capturePaymentResponse)
    const response = await axios.post(
        "https://api.sandbox.paypal.com/v1/billing/subscriptions", // Replace with the PayPal API endpoint
        {
            plan_id: planID,
            subscriber: {
                name: {
                    given_name: capturePaymentResponse.payer.name.given_name,
                    surname:  capturePaymentResponse.payer.name.surname,
                },
                email_address: capturePaymentResponse.payment_source.paypal.email_address,
            },
            application_context: {

                return_url: "https://yourwebsite.com/success",
                cancel_url: "https://yourwebsite.com/cancel",
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );
        console.log(' i m here')
        console.log('response.data',response.data)
    return response.data;
};

const cancelSubscription = async (accessToken, subscriptionID) => {
    try {
      const response = await axios.post(
        `https://api.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}/cancel`, // Replace with the correct PayPal API endpoint
        null, // No request body is required for subscription cancellation
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log('Cancellation response:', response.data);
  
      // You can handle the response here, e.g., check if the cancellation was successful.
      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error; // Handle the error as needed in your React component
    }
  };

  module.exports = router;
