// authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../Schema/UserSchema'); // Import your User model here
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const upload = require('../config/multerConfig');
const nodemailer = require('nodemailer');
const Auth = require('../Middleware/Auth');
const util = require('util');
const paypal = require('paypal-rest-sdk');
const createBillingAgreementPromise = util.promisify(paypal.billingAgreement.create);

const PAYPAL_CLIENT_ID = 'AWEBXDBUf4NFaypx21ZRgnBjWOggGUg---87pQ87ldc1tpuQtnWD5VxJQycaUb1Afu2xBlcQEl-GLpBQ';
let PAYPAL_CLIENT_SECRET = 'EJWKEv3OXnBh5GVcMaNmVoPx1jW8XW8uCKnB5XpV14r3145cmFzPAp64N-oZ9wUKnEv9mGsE0FDIxtuO';
let PLAN_ID = 'P-473782074G3832509MUWJSCA';

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: "usama_tasneem@outlook.com",
        pass: "papu5464"
    }
});
router.post('/signu', upload.single('profilePicture'), async (req, res) => {
    try {
        console.log('req.body', req.body)
        const userData = await User(req.body);
        const e = await bcryptjs.hash(req.body.password, 10);
        userData.password = e;
        const token = await userData.generateAuthToken();
        userData.token = token;

        if (req.file) {
            userData.profilePicture = req.file.filename; // Store the uploaded file name
        }
        res.cookie('user', token)
        await userData.save();

        if (userData.userType === 'Donor' && userData.paymentMethod === 'stripe') {
            const stripeCustomer = await stripe.customers.create({
                email: userData.email,
            });
            const subscription = await stripe.subscriptions.create({
                customer: stripeCustomer.id,
                items: [
                    {
                        plan: 'price_1NxKwSGsyHFe5lQAmLrBzEW4', // Replace with the actual Stripe Plan ID
                    },
                ],
                trial_period_days: 30, // 30-day free trial
            });

            userData.subscription = {
                active: true,
                planId: 'price_1NxKwSGsyHFe5lQAmLrBzEW4', // Replace with the actual Stripe Plan ID
                currentPeriodEnd: new Date(subscription.current_period_end * 1000), // Convert Stripe timestamp to JavaScript Date
                stripeCustomerId: stripeCustomer.id,
                stripeSubscriptionId: subscription.id,
            };
            await userData.save();
        }
        else if (userData.userType === 'Donor' && userData.paymentMethod === 'paypal') {
            console.log('we are here')
            try {
                const billingPlanAttributes = {
                    name: 'Donor Subscription Plan', // Replace with your plan name
                    description: 'Donor monthly subscription',
                    type: 'INFINITE',
                    payment_definitions: [
                        {
                            name: 'Monthly Payment',
                            type: 'REGULAR',
                            frequency: 'Month',
                            frequency_interval: '1',
                            amount: {
                                currency: 'USD', // Replace with your currency
                                value: '9.99', // Replace with your price
                            },
                        },
                    ],
                    merchant_preferences: {
                        return_url: 'http://localhost:3000/', // Replace with your success URL
                        cancel_url: 'http://localhost:3000/register', // Replace with your cancel URL
                    },
                };
                console.log('billingPlanAttributes', billingPlanAttributes)
                const billingPlan = await createBillingPlan(billingPlanAttributes);
                console.log('billingPlan', billingPlan)

                // Activate the billing plan
                await activateBillingPlan(billingPlan.id);


                // Create an agreement (subscription) using the billing plan
                console.log('agreement0_Here')
                const agreement = await createBillingAgreement(billingPlan.id);
                console.log('agreement', agreement)

                // Redirect the user to PayPal for approval
                const approvalUrl = agreement.links.find(link => link.rel === 'approval_url').href;
                console.log('approvalUrl', approvalUrl)

                // Store the agreement ID in your user data for future reference
                userData.subscription2 = {
                    active: true,
                    agreementId: agreement.id,
                };
                console.log('userData', userData)
                await userData.save();

                return res.json({ success: true, approvalUrl });
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Failed to create the subscription', error: error.message });
            }

        }
        async function createBillingPlan(attributes) {
            return new Promise((resolve, reject) => {
                paypal.billingPlan.create(attributes, (error, plan) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(plan);
                    }
                });
            });
        }

        async function activateBillingPlan(planId) {
            return new Promise((resolve, reject) => {
                const billingPlanUpdateAttributes = [
                    {
                        op: 'replace',
                        path: '/',
                        value: {
                            state: 'ACTIVE',
                        },
                    },
                ];

                paypal.billingPlan.update(planId, billingPlanUpdateAttributes, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        }
        async function createBillingAgreement(planId) {
            console.log('planId', planId)
            const billingAgreementAttributes = {
                name: 'Donor Subscription Agreement',
                description: 'Donor monthly subscription agreement',
                start_date: new Date().toISOString(),
                plan: {
                    id: planId,
                },
                payer: {
                    payment_method: 'paypal',
                },
            };
            console.log('billingAgreementAttributes', billingAgreementAttributes)
            try {
                // console.log('PayPal Configuration:', paypal.config);
                console.log('PayPal Configuration:', paypal.configure);
                console.log('PayPal Configuration:', paypal.config);
                const agreement = await createBillingAgreementPromise(billingAgreementAttributes);
                console.log('agreement', agreement)

                return agreement;
            } catch (error) {
                console.log('error', error)
                throw error;
            }
        }
        const mailConfigurations = {

            from: 'usama_tasneem@outlook.com',
            // to: 'lovekashmir03@gmail.com',
            to: userData.email,
            subject: 'Email Verification',
            text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:8000/verify/${token} 
           Thanks`

        };
        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) {
                console.log(error)
            }
        });
        res.status(200).send(userData);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send(error);
    }
});

// List all users
router.get('/receipient', async (req, res) => {
    try {
        let val = await User.find();
        res.status(200).send(val);
    } catch (error) {
        res.status(500).send(error);
    }
});

// List recipients only
router.get('/receipientOnly', async (req, res) => {
    try {
        let val = await User.find({ userType: 'Recipient' });
        res.status(200).send(val);
    } catch (error) {
        res.status(500).send(error);
    }
});

// List donors only
router.get('/donorOnly', async (req, res) => {
    try {
        let val = await User.find({ userType: 'Donor' });
        res.status(200).send(val);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get user by ID
router.get('/receipients/:id', async (req, res) => {
    try {
        let val = await User.findOne({ _id: req.params.id });
        res.status(200).send(val);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/alladminsOnly', async (req, res) => {
    try {
        let val = await User.find()
        let val2 = []
        val.map((ele, ind) => {
            if (ele.isAdmin === true) {
                return (
                    val2.push(ele)
                )
            }
        })
        console.log('val2', val2)
        res.status(200).send(val2)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Delete user by ID (requires authentication)
router.delete('/receipients/:id', Auth, async (req, res) => {
    try {
        if (req.params.id === req.user._id || req.user.isAdmin) {
            let val = await User.findOneAndDelete({ _id: req.params.id });
            res.status(200).send(val);
        } else {
            res.status(404).send('Not Authenticated');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
// #PUT
router.put('/receipients/:id', Auth, async (req, res) => {
    console.log('herer')
    console.log('herer',req.body)
    try {
        console.log('req.user._id', req.user._id)
        console.log('req.params.id', req.params.id)
        console.log('req.user.isAdmin', req.user.isAdmin)
        console.log('req.body', req.body)
        if (req.user.isAdmin || req.user._id === req.params.id) {
            console.log('herer1')
            let val0 = await User.findOne({ _id: req.params.id })
            let val = await User.findOneAndUpdate({ _id: req.params.id }, req.body)
            val.save();
            if (val === null) {
                res.status(404).send('error');
            }
            else {
                res.status(200).send(val);
            }
        }
        else {
            console.log('herer2')
            res.status(403).send('Not authenticated');
            console.log('herer2')
        }
    } catch (error) {
        res.status(500).send(error);
    }
})


// #Queries
router.get('/searchByName', async (req, res) => {
    try {
        let params = req.query.q;
        let val = await User.find({
            name: { $regex: params, $options: "i" }
        }).limit(40)
        res.status(200).send(val);
    } catch (error) {
        res.status(404).send('error  err');
    }
})
router.get('/searchByAddress', async (req, res) => {
    try {
        let params = req.query.q;
        let val = await User.find({
            email: { $regex: params, $options: "i" }
        }).limit(40)
        res.status(200).send(val);
    } catch (error) {
        res.status(404).send('error  err');
    }
})

router.get('/receip/pagination2', async (req, res) => {
    try {

        const totalItems = await User.countDocuments({ userType: 'Recipient' });
        const users = await User.find({ userType: 'Recipient' })
        res.status(200).json({ totalItems, users });
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/receip/pagination', async (req, res) => {
    try {

        const { start, end } = req.query;
        const startIndex = parseInt(start);
        const endIndex = parseInt(end);



        if (isNaN(startIndex) || isNaN(endIndex)) {
            return res.status(400).send('Invalid start and end parameters');
        }


        const users = await User.find({ userType: 'Recipient' })
            .skip(startIndex) // Skip the specified number of documents
            .limit(endIndex - startIndex); // Limit the number of documents returned

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// logout  
router.get('/logoutt', Auth, async (req, res) => {
    try {
        res.clearCookie('user')
        res.status(200).send('logged out')
    } catch (error) {
        res.status(404).send(error)
    }
})


module.exports = router;
