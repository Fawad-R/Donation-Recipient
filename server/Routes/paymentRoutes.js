const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51MFGxxGsyHFe5lQAVDUF7uO8Mwt4HBVeJFFVVl2YUkQDcru02MdQcen3kuaoNt2yfTIs8lI17KONHfpGyzoekMnQ00uJ6clGOz');
const User = require('../Schema/UserSchema'); 
const Transaction = require('../Schema/TransactionSchema'); 
const Auth = require('../Middleware/Auth');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode: 'sandbox', // Change to 'live' for production
    client_id: 'AV8HD_qZucZtfy2iGzWlqrPX9-x95GM3Ddb21q36Rz_EZFHbnDDJo4rGIMby9DV_aVHOp-dpjfjoyx-5',
    client_secret: 'EJA0sfFIXl2yWZbVSRASZxAfN76SM8apQ6l2v7SZP94RQTE_xtUpT2GZuYFkMCw8yCvIfvM90FPNho36',
});

router.post('/payment/payment', Auth, async (req, res) => {
    // try
    const user = await User.findById(req.body.recipientId);
    const user2 = await User.findById(req.user._id);
    if (!user) {
        res.status(404).json({ error: 'User (recipient) not found' });
        return;
    }
    stripe.charges.create(
        {
            // source: req.body.tokenId,
            source: req.body.tokenId.id,
            amount: req.body.amount,
            currency: "usd",
            description: `Donation to ${user.name} (ID: ${req.body.recipientId})`
        },
        async (stripeErr, stripeRes) => {
            console.log('stripeRes')
            if (stripeErr) {
                console.log('stripeErr')

                res.status(404).send(stripeErr);
            }
            else {
                const newTransaction = new Transaction({
                    amount: req.body.amount,
                    donor: req.user._id, // Add the donor's ID here
                    recipient: req.body.recipientId,
                    status: 'successful', // You can set the status based on the Stripe response
                    paymentMethod: 'credit card', // Update with the actual payment method
                    transactionId: stripeRes.id,
                    description: `Donation to ${user.name} (ID: ${req.body.recipientId})`,
                    currency: 'usd', // Update with the actual currency
                });
                if (user2.subscription === null || user2.subscription.active === false || user2.subscription.active === 'null' || user2.subscription.stripeSubscriptionId === 'null' || user2.subscription.stripeSubscriptionId === null) {
                    const stripeCustomer = await stripe.customers.create({
                        email: user.email,
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
                    let subscription1 = {
                        active: true,
                        planId: 'price_1NxKwSGsyHFe5lQAmLrBzEW4', // Replace with the actual Stripe Plan ID
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000), // Convert Stripe timestamp to JavaScript Date
                        stripeCustomerId: stripeCustomer.id,
                        stripeSubscriptionId: subscription.id,
                    };
                    user2.subscription = subscription1;
                }
                await user2.save();
                user.monthlyChargesActive = true;
                await newTransaction.save();
                res.status(200).send(stripeRes);
            }
        }
    )
})
//Cancel Membership
router.post('/payment/cancel-membership', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (user.subscription.stripeSubscriptionId == 'null') {
            res.status(200).json('User does not have an active subscription');
            return;

        }
        // const subscriptionId = user.subscriptionId;
        const subscriptionId = user.subscription.stripeSubscriptionId;
        if (!subscriptionId) {
            res.status(400).json({ error: 'User does not have an active subscription' });
            return;
        }
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
        user.subscription.stripeSubscriptionId = 'null';
        await user.save();
        res.status(200).json({ message: 'Membership canceled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
//Cancel Subscription
router.post('/payment/cancel-subscription', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.subscription.stripeSubscriptionId == 'null') {
            res.status(200).json('User does not have an active subscription');
            return;

        }
        if (!user.subscription.stripeSubscriptionId) {
            res.status(200).json('User does not have an active subscription');
            return;
        }

        const subscriptionId = user.subscription.stripeSubscriptionId;

        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        user.subscription.stripeSubscriptionId = 'null';
        await user.save();

        res.status(200).json({ message: 'Subscription cancellation scheduled at the end of the billing period' });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/payment/payment2', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.body.recipientId);
        const user2 = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User (recipient) not found' });
        }

        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: 'https://yourwebsite.com/success', // Replace with your success URL
                cancel_url: 'https://yourwebsite.com/cancel', // Replace with your cancel URL
            },
            transactions: [
                {
                    amount: {
                        total: req.body.amount, // The payment amount
                        currency: 'USD', // Currency code (e.g., USD)
                    },
                    description: `Donation to ${user.name} (ID: ${req.body.recipientId})`,
                },
            ],
        };

        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            } else {
                // Capture the approval URL and redirect the user to PayPal for payment
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        return res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
});
// #cancel membership
router.post('/payment/cancel-membership2', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.subscription2.paypalSubscriptionId) {
            return res.status(200).json({ message: 'User does not have an active PayPal subscription' });
        }

        const subscriptionId = user.subscription2.paypalSubscriptionId;

        // Use the PayPal SDK to cancel the subscription
        paypal.billingPlan.get(subscriptionId, async (error, billingPlan) => {
            if (error) {
                return res.status(400).json({ error: 'Failed to retrieve billing plan' });
            }

            paypal.billingAgreement.cancel(billingPlan.agreement_details.id, {}, async (error, result) => {
                if (error) {
                    return res.status(400).json({ error: 'Failed to cancel the subscription' });
                }

                // Clear the PayPal subscription ID in the user's data
                user.subscription2.paypalSubscriptionId = 'null';
                await user.save();

                return res.status(200).json({ message: 'Membership canceled successfully' });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// #cancel subscription
router.post('/payment/cancel-subscription2', Auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.subscription2.paypalSubscriptionId) {
            return res.status(200).json('User does not have an active PayPal subscription');
        }

        const subscriptionId = user.subscription2.paypalSubscriptionId;

        // Use the PayPal SDK to cancel the subscription
        paypal.billingAgreement.cancel(subscriptionId, {}, async (error, result) => {
            if (error) {
                return res.status(400).json({ error: 'Failed to cancel the subscription' });
            }

            // Clear the PayPal subscription ID in the user's data
            user.subscription2.paypalSubscriptionId = null;
            await user.save();

            return res.status(200).json({ message: 'Subscription cancellation scheduled at the end of the billing period' });
        });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// #transactions
router.get('/transactions', async (req, res) => {
    try {
        let val = await Transaction.find()
        res.status(200).send(val)
    }
    catch (error) {
        res.status(500).send(error)
    }
})
router.get('/transaction/:id', async (req, res) => {
    try {
        let val = await Transaction.find({ _id: req.params.id })
        res.status(200).send(val)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;