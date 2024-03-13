import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { useReactToPrint } from 'react-to-print';
import '../PagesStyling/AccountingPage.css';
import {Navbar} from '../PageComponents/Navbar'
import { useTranslation } from 'react-i18next';
import PagesFooter from '../PageComponents/PagesFooter';
const ExportToCSV = ({ data }) => {
    const headers = [
        { label: 'Amount', key: 'amount' },
        { label: 'Payment Method', key: 'paymentMethod' },
        { label: 'Currency', key: 'currency' },
        { label: 'Status', key: 'status' },
        { label: 'Created At', key: 'createdAt' },
    ];

    return (
        <CSVLink data={data} headers={headers}>
            Export to CSV
        </CSVLink>
    );
};

const PrintToPDF = ({ children }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            <button onClick={handlePrint}>Print to PDF</button>
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>{children}</div>
            </div>
        </>
    );
};

const AccountingPage = () => {
    const { t } = useTranslation();

    const [donationState, updateDonationState] = useState([]);
    const [sortedTransactions, setSortedTransactions] = useState([]);
    const [sortOrder, setSortOrder] = useState({
        amount: 'asc',
        paymentMethod: 'asc',
        currency: 'asc',
        createdAt: 'asc',
    });
    const [filterText, setFilterText] = useState('');
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    // Function to sort transactions based on a column
    const sortTransactions = (column) => {
        const order = sortOrder[column] === 'asc' ? 'desc' : 'asc';

        const sorted = [...sortedTransactions].sort((a, b) => {
            if (column === 'amount') {
                // For the "Amount" column, parse the values as numbers for comparison
                const amountA = parseFloat(a[column]);
                const amountB = parseFloat(b[column]);

                if (order === 'asc') {
                    return amountA - amountB;
                } else {
                    return amountB - amountA;
                }
            } else {
                // For other columns, use localeCompare for string comparison
                if (order === 'asc') {
                    return a[column].localeCompare(b[column]);
                } else {
                    return b[column].localeCompare(a[column]);
                }
            }
        });

        setSortedTransactions(sorted);
        setSortOrder({ ...sortOrder, [column]: order });
    };

    // Function to filter transactions by recipient name
    const filterTransactions = () => {
        if (donationState) {
            console.log('donationState', donationState)
            let filtered = donationState;

            // Apply the name filter if provided
            if (filterText) {
                console.log('filterText', filterText)

                // filtered.filter((transaction)=>{
                //     console.log('transaction',transaction.status)
                //   return  transaction.status && transaction.status.toLowerCase().includes(filterText.toLowerCase())
                // })
                filtered = filtered.filter((transaction) =>
                    transaction.status && transaction.status.toLowerCase().includes(filterText.toLowerCase())
                );
            }

            setSortedTransactions(filtered);
        }
    };
    let userType = JSON.parse(localStorage.getItem('userType'))
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`/transactions`);
                const keyId = JSON.parse(localStorage.getItem('keyId'));
                const userType = JSON.parse(localStorage.getItem('userType'));
                // const filteredDonations = response.data.filter((ele) => ele.donor === keyId);
                let filteredDonations;
                if (userType === 'Donor') {
                    filteredDonations = response.data.filter((ele) => ele.donor === keyId);
                }
                else {
                    filteredDonations = response.data.filter((ele) => ele.recipient === keyId);
                }
                updateDonationState(filteredDonations);
                setSortedTransactions(filteredDonations);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDonations();
    }, []);

    return (
        <>
         <Navbar/>
        {userType === 'Donor' ?
            <div style={{ marginBottom: "100px" }} className="accounting-page">
                {/* <h2>Accounting Page</h2> */}
                <h2>{t('home.accountingPage')}</h2>

                {/* Filter Textbox */}
                <input
                    type="text"
                    placeholder="Filter by search"
                    className="filter-text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />

                <button onClick={filterTransactions}>Filter</button>

                {/* Transaction Table */}
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortTransactions('amount')}>
                                Amount{' '}
                                {sortOrder.amount === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                            <th onClick={() => sortTransactions('paymentMethod')}>
                                Payment Method{' '}
                                {sortOrder.paymentMethod === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                            <th onClick={() => sortTransactions('currency')}>
                                Currency{' '}
                                {sortOrder.currency === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                            <th >
                                Status{' '}

                            </th>
                            <th onClick={() => sortTransactions('createdAt')}>
                                Created At{' '}
                                {sortOrder.createdAt === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions?.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>${(transaction.amount) / 100}</td>
                                <td>{transaction.paymentMethod}</td>
                                <td>{transaction.currency}</td>
                                <td>{transaction.status}</td>
                                {/* <td><FetchRecipient id={transaction.recipient}/></td> */}
                                <td>{formatDate(transaction.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1%' }}>
                    <ExportToCSV data={sortedTransactions} />

                    <PrintToPDF>
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th onClick={() => sortTransactions('amount')}>
                                        Amount{' '}
                                        {sortOrder.amount === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                    <th onClick={() => sortTransactions('paymentMethod')}>
                                        Payment Method{' '}
                                        {sortOrder.paymentMethod === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                    <th onClick={() => sortTransactions('currency')}>
                                        Currency{' '}
                                        {sortOrder.currency === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                    <th>Status</th>
                                    <th onClick={() => sortTransactions('createdAt')}>
                                        Created At{' '}
                                        {sortOrder.createdAt === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTransactions?.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>${transaction.amount / 100}</td>
                                        <td>{transaction.paymentMethod}</td>
                                        <td>{transaction.currency}</td>
                                        <td>{transaction.status}</td>
                                        <td>{formatDate(transaction.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </PrintToPDF>
                </div>
            </div>

            :
            <div style={{ marginBottom: "100px" }} className="accounting-page">
                <h2>Accounting Page</h2>

                {/* Filter Textbox */}
                <input
                    type="text"
                    placeholder="Filter by search"
                    className="filter-text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />

                <button onClick={filterTransactions}>Filter</button>

                {/* Transaction Table */}
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortTransactions('amount')}>
                                Amount{' '}
                                {sortOrder.amount === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                            <th onClick={() => sortTransactions('paymentMethod')}>
                                Payment Method{' '}
                                {sortOrder.paymentMethod === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                            <th onClick={() => sortTransactions('currency')}>
                                Currency{' '}
                                {sortOrder.currency === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                            <th >
                                Status{' '}

                            </th>
                            <th onClick={() => sortTransactions('createdAt')}>
                                Created At{' '}
                                {sortOrder.createdAt === 'asc' ? (
                                    <span className="sort-icon">&#9650;</span>
                                ) : (
                                    <span className="sort-icon">&#9660;</span>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions?.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>${(transaction.amount) / 100}</td>
                                <td>{transaction.paymentMethod}</td>
                                <td>{transaction.currency}</td>
                                <td>{transaction.status}</td>
                                {/* <td><FetchRecipient id={transaction.recipient}/></td> */}
                                <td>{formatDate(transaction.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1%' }}>

                    <ExportToCSV data={sortedTransactions} />

                    <PrintToPDF>
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th onClick={() => sortTransactions('amount')}>
                                        Amount{' '}
                                        {sortOrder.amount === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                    <th onClick={() => sortTransactions('paymentMethod')}>
                                        Payment Method{' '}
                                        {sortOrder.paymentMethod === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                    <th onClick={() => sortTransactions('currency')}>
                                        Currency{' '}
                                        {sortOrder.currency === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                    <th>Status</th>
                                    <th onClick={() => sortTransactions('createdAt')}>
                                        Created At{' '}
                                        {sortOrder.createdAt === 'asc' ? (
                                            <span className="sort-icon">&#9650;</span>
                                        ) : (
                                            <span className="sort-icon">&#9660;</span>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTransactions?.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td>${transaction.amount / 100}</td>
                                        <td>{transaction.paymentMethod}</td>
                                        <td>{transaction.currency}</td>
                                        <td>{transaction.status}</td>
                                        <td>{formatDate(transaction.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </PrintToPDF>
                </div>
            </div>}
            <PagesFooter />
        </>
    );
};

export default AccountingPage;