import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}

function PayPalCheckout() {
  // const initialOptions = {
  //   "client-id": "AWEBXDBUf4NFaypx21ZRgnBjWOggGUg---87pQ87ldc1tpuQtnWD5VxJQycaUb1Afu2xBlcQElGLpBQ",
  //   "enable-funding": "",
  //   "disable-funding": "paylater,card",
  //   "data-sdk-integration-source": "integrationbuilder_sc",
  //   vault: "true",
  //   intent: "subscription",
  // };
  const initialOptions = {
    // "client-id": "AWEBXDBUf4NFaypx21ZRgnBjWOggGUg---87pQ87ldc1tpuQtnWD5VxJQycaUb1Afu2xBlcQElGLpBQ", // Replace with your PayPal Client ID
    // "client-id": "AUZzc5XkAsjyB5pXaz2cA0ddp5yAH8DbhEhkSNLatK10bM4is3GDFkXMrEui-ToI-dz9Gc2yfzMedUGi",
    "client-id": "AWEBXDBUf4NFaypx21ZRgnBjWOggGUg---87pQ87ldc1tpuQtnWD5VxJQycaUb1Afu2xBlcQEl-GLpBQ",
    "vault": "true", // Enable vaulting for saving payment details (optional)
    "intent": "subscription", // Set the intent (subscription in your case)
    "disable-funding": "paylater,card", // Disable specific funding sources (optional)
  };

  const [message, setMessage] = useState("");

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          createSubscription={async () => {
            try {
              const response = await fetch("/api/paypal/create-subscription", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userAction: "SUBSCRIBE_NOW" }),
              });
              const data = await response.json();
              if (data?.id) {
                setMessage(`Successful subscription...`);
                return data.id;
              } else {
                console.error(
                  { callback: "createSubscription", serverResponse: data },
                  JSON.stringify(data, null, 2),
                );
                // (Optional) The following hides the button container and shows a message about why checkout can't be initiated
                const errorDetail = data?.details?.[0];
                setMessage(
                  `Could not initiate PayPal Subscription...<br><br>${
                    errorDetail?.issue || ""
                  } ${errorDetail?.description || data?.message || ""} ` +
                    (data?.debug_id ? `(${data.debug_id})` : ""),
                  { hideButtons: true },
                );
              }
            } catch (error) {
              console.error(error);
              setMessage(`Could not initiate PayPal Subscription...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            /*
              No need to activate manually since SUBSCRIBE_NOW is being used.
              Learn how to handle other user actions from our docs:
              https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions_create
            */
            if (data.orderID) {
              setMessage(
                `You have successfully subscribed to the plan. Your subscription id is: ${data.subscriptionID}`,
              );
            } else {
              setMessage(
                `Failed to activate the subscription: ${data.subscriptionID}`,
              );
            }
          }}
        />
      </PayPalScriptProvider>
      <Message content={message} />
    </div>
  );
}

// export default App;
export default PayPalCheckout;
