import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import '../PagesStyling/Recipient2.scss';
import PayPalCheckout from './PayPalCheckout';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalCheckOut2 from './PaypalCheckOut2';
// import { PaymentForm } from './PaymentForm';

import { Container, Row, Col, Card, Button,Table } from 'react-bootstrap';

let stripeKey = "pk_test_51MFGxxGsyHFe5lQADpu8EQF9BKy1N7wdpsmYQhwFGtv6ovbZ93uDWb6cTW92Dsr50q2p0zyjOI01O6VDYjthwf5K00zyktNRfo";

const RecipientResearchPage2 = () => {
  let navigate = useNavigate();
  const [isPayPalVisible, setIsPayPalVisible] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [recipientTypeFilter, setRecipientTypeFilter] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientCustomAmounts, setRecipientCustomAmounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // Store the data to be displayed
  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const itemsPerPage = 5; // Number of items to display per page

  const [filteredRecipients, setFilteredRecipients] = useState([]); // Define filtered recipients

  const fetchDataForPage = async (pageNumber) => {
    try {
      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const response = await fetch(
        `/receip/pagination?start=${startIndex}&end=${endIndex}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setCurrentPage(pageNumber);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTotalItems = async () => {
    try {
      const response = await fetch(`/receip/pagination2`);
      if (response.ok) {
        const data = await response.json();
        setTotalItems(data.totalItems);
        fetchDataForPage(1); // Fetch initial data for page 1
      } else {
        console.error('Failed to fetch totalItems');
      }
    } catch (error) {
      console.error('Error fetching totalItems:', error);
    }
  };

  useEffect(() => {
    fetchTotalItems();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/receipientOnly');
      const recipientsData = response.data;
      setRecipients(recipientsData);
      setFilteredRecipients(recipientsData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    filterRecipients();
  }, [nameFilter, addressFilter, recipientTypeFilter]);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchUser();
    fetchDataForPage(1);
  }, []);


  const openPaymentModal = (recipient) => {
    setSelectedRecipient(recipient);
    setIsModalOpen(true);
  };

  const closePaymentModal = () => {
    setSelectedRecipient(null);
    setIsModalOpen(false);
  };

  const onToken = async (token, recipient) => {

    try {
      const response = await axios.post('/payment/payment', {
        tokenId: token,
        amount: recipientCustomAmounts[recipient._id] * 100, // Amount in cents
        recipientId: recipient._id,
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

  const filterRecipients = () => {
    let filteredData = [...recipients];

    if (nameFilter) {
      filteredData = filteredData.filter((recipient) =>
        recipient.name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (addressFilter) {
      filteredData = filteredData.filter((recipient) =>
        recipient.address.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }

    if (recipientTypeFilter) {
      filteredData = filteredData.filter((recipient) =>
        recipient.recipientType === recipientTypeFilter
      );
    }

    setFilteredRecipients(filteredData);
  };

  useEffect(() => {
    filterRecipients();
  }, [nameFilter, addressFilter, recipientTypeFilter]);

  const handlePageChange = (event, newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(filteredRecipients.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const fetchNextPage = (e) => {

    navigate(`/recipient/${e}`);
  };

  const paginatedRecipients = filteredRecipients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    // Fetch data when the component mounts
    fetchUser();
    fetchDataForPage(1);
    setFilteredRecipients(recipients);
  }, []);

  // Add this useEffect to log data after it has been updated
  useEffect(() => {
    console.log('filteredRecipients', filteredRecipients);
  }, []);

  const [clientToken, setClientToken] = useState(null);
  //Replace Client ID and App Secret
  const clientId = "<test>";
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/token", {
        method: "post",
      });
      const client_token = await response.json();
      setClientToken(client_token);
    })();
  }, []);

  return (
    <div className=' recipient-research-page2'>

      <div className="recipient-research-page">
        <Card className='mb-3' style={{ width: '100%' }}>
          <Card.Body>
            <Card.Text>
              <div className="filters">
                <div className="filter-group">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <select
                    value={recipientTypeFilter}
                    onChange={(e) => setRecipientTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Type A">Type A</option>
                    <option value="Type B">Type B</option>
                  </select>
                </div>
              </div>
            </Card.Text>
            <Card.Text>
            <Table responsive striped hover className="recipient-table">
                <thead>
                  <tr>
                    <th style={{ "width": "120px" }}>Picture</th>
                    <th>Name</th>
                    <th>Recipient Type</th>
                    {/* <th>Stripe</th> */}
                    <th>Paypal</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecipients.map((recipient) => (
                    <tr key={recipient.id} className="table-row">
                      <td onClick={() => fetchNextPage(recipient._id)}>
                        <img
                          src={`/uploads/${recipient.profilePicture}`}
                          alt={recipient.name}
                          className="table-image"
                        />
                      </td>
                      <td onClick={() => fetchNextPage(recipient._id)}>{recipient.name}</td>
                      <td onClick={() => fetchNextPage(recipient._id)}>{recipient.recipientType}</td>
                      {/* <td >
                  <input
                    type="number"
                    value={recipientCustomAmounts[recipient._id] || ''}
                    min="1"
                    style={{display:"block",marginBottom:"1%"}}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value);
                      setRecipientCustomAmounts((prevAmounts) => ({
                        ...prevAmounts,
                        [recipient._id]: newValue,
                      }));
                    }}
                    className="table-input"
                  />
                  <StripeCheckout
                    name="Donation"
                    description="Donate us"
                    image="img/Donate.jpg"
                    shippingAddress
                    billingAddress
                    amount={parseFloat(recipientCustomAmounts[recipient._id] || 0) * 100}
                    token={(token) => onToken(token, recipient)}
                    stripeKey={stripeKey}
                  >
                    <button className="table-button">Stripe</button>
                  </StripeCheckout>
                </td> */}
                      <td >

                        <PaypalCheckOut2 amount={parseFloat(recipientCustomAmounts[recipient._id] || 1)} recipientId={recipient._id} />


                        {/* <button onClick={() => setIsPayPalVisible(!isPayPalVisible)} style={{ margin: "1%" }}>PayPal</button> */}
                        {/* </td>
                <td> */}
                        {/* <StripeCheckout
                    name="Donation"
                    description="Donate us"
                    image="img/Donate.jpg"
                    shippingAddress
                    billingAddress
                    amount={parseFloat(recipientCustomAmounts[recipient._id] || 0) * 100}
                    token={(token) => onToken(token, recipient)}
                    stripeKey={stripeKey}
                  >
                    <button className="table-button">Stripe</button>
                  </StripeCheckout> */}
                      </td>


                      {/* <td> */}
                      {/* 
                    */}
                      {/* <PayPalScriptProvider options={{ "client-id": PayPalConfig.clientId }}> */}
                      {/* <PayPalCheckout/> */}
                      {/* </PayPalScriptProvider> */}
                      {/* <PayPalButton/> */}
                      {/* </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Text>
            <Card.Text>
              <div style={{ display: "flex", justifyContent: "center", margin: '2%' }}>
                <Stack spacing={2}>
                  <Pagination
                    count={Math.ceil(filteredRecipients.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                  />
                </Stack>
              </div>
            </Card.Text>
            </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default RecipientResearchPage2;
