// import React, { useState, useRef } from "react";
// import {
//   PayPalScriptProvider,
//   PayPalHostedFieldsProvider,
//   PayPalHostedField,
//   PayPalButtons,
//   usePayPalHostedFields,
// } from "@paypal/react-paypal-js";
// import { TailSpin } from "react-loader-spinner";

// export const PaymentForm = (props) => {
//   const [loader, showLoader] = useState(false);
//   const [success, showSuccess] = useState(false);
//   const [error, showErrorMsg] = useState(false);
//   const [transactionData, setTransactionData] = useState();
//   const [errorMsg, setErrorMsg] = useState();
//   const [fundingSource, setFundingSource] = useState(null);

//   const SubmitPayment = () => {
//     const { cardFields } = usePayPalHostedFields();
//     const cardHolderName = useRef(null);

//     const submitHandler = () => {
//       if (typeof cardFields.submit !== "function") return;
//       if (errorMsg) showErrorMsg(false);
//       showLoader(true);
//       showSuccess(false);
//       cardFields.submit({
//         cardholderName: cardHolderName?.current?.value || "",
//       })
//         .then((order) => {
//           const { orderId } = order;

//           fetch(`/api/orders/${orderId}/capture`, { method: "post" })
//             .then((response) => response.json())
//             .then((data) => {
//               showLoader(false);
//               showSuccess(true);
//               setTransactionData(data);
//               alert("Transaction Complete. Transaction ID - " + data.id);
//             })
//             .catch((err) => {
//               showLoader(false);
//               showErrorMsg(true);
//               setErrorMsg(err);
//             });
//         })
//         .catch((err) => {
//           showLoader(false);
//           showErrorMsg(true);
//           setErrorMsg(err);
//         });
//     };

//     return (
//       <button
//         onClick={submitHandler}
//         className="btn btn-primary"
//         style={{
//           width: "720px",
//           height: "50px",
//           background: "#009c74",
//           color: "white",
//         }}
//       >
//         Pay
//       </button>
//     );
//   };

//   return (
//     <PayPalScriptProvider
//       options={{
//         "client-id": props.clientID,
//         "data-client-token": props.clientToken,
//         components: "hosted-fields,buttons,funding-eligibility",
//         currency: "USD",
//         "buyer-country": "US",
//         intent: "capture",
//       }}
//     >
//       <div className="row" align="center" style={{ marginTop: "20px", marginBottom: "20px" }}>
//         <PayPalButtons style={{
//           layout: "vertical",
//           shape: "rect",
//           color: (fundingSource === "PAYLATER") ? 'gold' : '',
//         }} />
//       </div>

//       <div>
//         <p align="center"> OR </p>
//       </div>

//       <PayPalHostedFieldsProvider
//         createOrder={() => {
//           return fetch("/api/orders", { method: "post" })
//             .then((response) => response.json())
//             .then((order) => order.id)
//             .catch((err) => {
//               showLoader(false);
//               showErrorMsg(true);
//               setErrorMsg(err);
//             });
//         }}
//       >
//         <div id="paypal-button-container"></div>
//         <section>
//           <div>
//             <PayPalHostedField
//               id="card-number"
//               hostedFieldType="number"
//               options={{
//                 selector: "#card-number",
//                 placeholder: "Card Number",
//               }}
//             />

//             <section style={{ display: "flex" }}>
//               <div>
//                 <PayPalHostedField
//                   id="expiration-date"
//                   hostedFieldType="expirationDate"
//                   options={{
//                     selector: "#expiration-date",
//                     placeholder: "Expiration Date",
//                   }}
//                 />
//               </div>
//               <div style={{ marginLeft: "80px" }}>
//                 <PayPalHostedField
//                   id="cvv"
//                   hostedFieldType="cvv"
//                   options={{
//                     selector: "#cvv",
//                     placeholder: "CVV",
//                   }}
//                 />
//               </div>
//             </section>

//             <input
//               id="card-holder"
//               type="text"
//               placeholder="Name on Card"
//             />

//             <input
//               id="card-billing-address-country"
//               type="text"
//               placeholder="Country Code"
//             />

//             {loader && <TailSpin height="50" width="50" color="#0d6efd" />}
//             {!loader && <SubmitPayment />}
//           </div>
//         </section>
//       </PayPalHostedFieldsProvider>
//     </PayPalScriptProvider>
//   );
// };
