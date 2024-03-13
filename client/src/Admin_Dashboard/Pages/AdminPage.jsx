import React, { useEffect, useState } from 'react';
import '../../PagesStyling/AdminPage.css'
import axios from 'axios';
import FetchUser from './FetchUser';
import { useNavigate } from 'react-router-dom';
import { Avatar, Table } from '@mui/material';
import Loader from '../../PageComponents/Loader';
import SystemSettings from '../../PageComponents/SystemSettings';
import ReportGenerator from '../../PageComponents/ReportGenerator';
// import { AdminNav } from '../../PageComponents/AdminNav';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserPanel from '../../Pages/UserPanel';

const data = [
  { id: 1, column1: 'Row 1 Data 1', column2: 'Row 1 Data 2', column3: 'Row 1 Data 3' },
  { id: 2, column1: 'Row 2 Data 1', column2: 'Row 2 Data 2', column3: 'Row 2 Data 3' },
  // Add more data as needed
];

const TableRow = ({ data }) => (
  <tr className="align-middle">
    <td className="text-nowrap">
      <div className="d-flex align-items-center">
        <Avatar src={data.avatar} size="l" name={data.name} />
        <div className="ms-2">{data.name}</div>
      </div>
    </td>
    <td className="text-nowrap">{data.name}</td>
    <td className="text-nowrap">{data.phone}</td>
    <td className="text-nowrap">{data.recipientType}</td>
    <td className="text-nowrap">
      {/* <button onClick={() => EditUser(row._id, row.name, row.phone, row.recipientType)} className="btn btn-primary btn-sm mx-1">Edit</button>
      <button onClick={() => DeleteUser(row._id)} className="btn btn-danger btn-sm mx-1">Delete</button> */}
    </td>
  </tr>
);


function AdminPage() {
  let navigate = useNavigate()
  const [selectedItemIndex, setSelectedItemIndex] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0); // Initialize with the default selected item (e.g., Recipients)

  const [adminState, updateAdminState] = useState([]);
  const [adminLoading, updateAdminLoading] = useState(true);
  const [adminLoading2, updateAdminLoading2] = useState(true);
  const [setttings, updateSettings] = useState(false);

  const handleItemClick = async (index) => {
    setSelectedItem(index)
    try {
      let val = await axios.get('/receipientOnly')
      setSelectedItemIndex(val.data);
      updateAdminLoading2(false)
      updateSettings(false)
    }
    catch (error) {
      // alert(error)
      toast.error(error, {
        position: 'top-right',
      });
    }
  };
  useEffect(() => {
    handleItemClick(0)
  }, [])

  const handleItemClick2 = async (index) => {
    setSelectedItem(index)
    try {
      let val = await axios.get('/donorOnly')
      setSelectedItemIndex(val.data);
      updateSettings(false)
    }
    catch (error) {
      toast.error(error, {
        position: 'top-right',
      });
    }
  };
  const handleItemClick3 = async (index) => {
    setSelectedItem(index)
    try {
      let val = await axios.get('/Allcampaigns')
      console.log('bal.data', val.data)
      setSelectedItemIndex(val.data);
      updateSettings(false)
    }
    catch (error) {
      toast.error(error, {
        position: 'top-right',
      });
    }
  };
  const handleItemClick4 = async (index) => {
    setSelectedItem(index)
    updateSettings(true)
  };
  const handleItemClick5 = async (index) => {
    setSelectedItem(index)
    updateSettings(true)
  };
  const handleItemClick6 = async (index) => {
    setSelectedItem(index)
    updateSettings(true)
  };
  let EditUser = async (e, name, phone, recipientType) => {
    const confirmDelete = window.confirm('Are you sure you want to update this user?');
    if (confirmDelete) {

      console.log('e', e)
      console.log('name,phone,recipientType', name, phone, recipientType)
      try {
        let val = await axios.put(`/receipients/${e}`, { name, phone, recipientType })
        if (val.status === 200) {
          toast.success('Updated!', {
            position: 'top-right',
          });
          setTimeout(() => {
            /* eslint-disable no-restricted-globals */
            location.reload()
          }, 3000);
        }
        else {

        }
      }
      catch (error) {
        toast.error(error, {
          position: 'top-right',
        });
      }
    }
    else {

    }
  }
  let EditUser2 = async (e, firstName, lastName, recipientType) => {
    console.log('e', e)
    console.log('firstName, lastName, recipientType', firstName, lastName, recipientType)
    const confirmDelete = window.confirm('Are you sure you want to update this user?');
    if (confirmDelete) {

      try {
        let val = await axios.put(`/receipients/${e}`, { firstName, lastName, recipientType })
        if (val.status === 200) {
          toast.success('Updated!', {
            position: 'top-right',
          });
          setTimeout(() => {
            /* eslint-disable no-restricted-globals */
            location.reload()
          }, 3000);
        }
        else {

        }
      }
      catch (error) {
        toast.error(error, {
          position: 'top-right',
        });
      }
    }
    else {

    }

  }
  let DeleteUser = async (e) => {
    console.log('e', e)
    const confirmDelete = window.confirm('Confirm Delete?');
    if (confirmDelete) {


      try {
        let val = await axios.delete(`/receipients/${e}`)
        if (val.status === 200) {
          toast.success('Deleted!', {
            position: 'top-right',
          });
          setTimeout(() => {
            /* eslint-disable no-restricted-globals */
            location.reload()
          }, 3000);
        }
        else {

        }
      }
      catch (error) {
        toast.error(error, {
          position: 'top-right',
        });
      }
    }
    else {

    }
  }
  let EditCampaign = async (e, title, startDate, endDate, price) => {
    console.log('e', e)
    console.log('title,startDate,endDate,price', title, startDate, endDate, price)
    const confirmDelete = window.confirm('Are you sure you want to update this campaign?');
    if (confirmDelete) {


      try {
        let val = await axios.put(`/campaign/${e}`, { title, startDate, endDate, price })
        if (val.status === 200) {
          toast.success('Updated!', {
            position: 'top-right',
          });
          setTimeout(() => {
            /* eslint-disable no-restricted-globals */
            location.reload()
          }, 3000);
        }
        else {

        }
      }
      catch (error) {
        toast.error(error, {
          position: 'top-right',
        });
      }
    }
    else {

    }
  }
  let DeleteCampaign = async (e) => {
    console.log('e', e)
    const confirmDelete = window.confirm('Confirm Delete?');
    if (confirmDelete) {


      try {
        let val = await axios.delete(`/campaign/${e}`)
        if (val.status === 200) {
          toast.success('Deleted!', {
            position: 'top-right',
          });
          setTimeout(() => {
            /* eslint-disable no-restricted-globals */
            location.reload()
          }, 3000);
        }
        else {

        }
      }
      catch (error) {
        toast.error(error, {
          position: 'top-right',
        });
      }
    }
    else {

    }
  }
  let checkAdmin = async (req, res) => {
    try {
      let keyId = JSON.parse(localStorage.getItem('keyId'))
      console.log('keyId', keyId)
      let val = await axios.get(`/receipients/${keyId}`)
      console.log('val', val.data)
      console.log('val.data', val.data)
      updateAdminState(val.data)
      updateAdminLoading(false)
    }
    catch (error) {
      toast.error(error, {
        position: 'top-right',
      });
      // Navigate to the next page after a delay
      setTimeout(() => {
        navigate('/login')
      }, 3000); // Adjust the delay as needed
    }
  }
  useEffect(() => {
    checkAdmin()
  }, [])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let { t } = useTranslation()
  let Logout=async(e)=>{
    let val=await axios.get('/logoutt');
    if (val.status==200) {
      localStorage.setItem('keyId',JSON.stringify(null))
      localStorage.setItem('userType',JSON.stringify(null))
      let keyId=JSON.parse(localStorage.getItem('keyId'));
      alert('Logged Out!')
      navigate('/login')
    }
    else
    {
      alert('error while logging you out!')
    }
  }

  return (

    adminLoading ?
      (
        <Loader />
      )
      :
      adminState.isAdmin ?
        <div >
          <ToastContainer />
          <div className="admin-panel">
            <div className="sidebar">
              <h2 style={{ color: 'white' }}>Admin</h2>
              <ul>
                <li className={selectedItem === 0 ? 'active' : ''} onClick={() => handleItemClick(0)}>{t('home.recipients')}</li>
                <li className={selectedItem === 1 ? 'active' : ''} onClick={() => handleItemClick2(1)}>{t('home.donors')}</li>
                <li className={selectedItem === 2 ? 'active' : ''} onClick={() => handleItemClick3(2)}>{t('home.campaigns')}</li>
                <li className={selectedItem === 3 ? 'active' : ''} onClick={() => handleItemClick4(3)}>{t('home.basicSettings')}</li>
                <li className={selectedItem === 4 ? 'active' : ''} onClick={() => handleItemClick5(4)}>{t('home.reports')}</li>
                <li className={selectedItem === 5 ? 'active' : ''} onClick={() => handleItemClick6(5)}>{t('home.user')}</li>
                <button className='sm bg-danger' style={{display:'block',margin:"2%"}} onClick={Logout}>Logout</button>
                {/* <li className={selectedItem === 0 ? 'active' : ''} >Basic Settings</li> */}
              </ul>
            </div>
            <div className="main-content">
              <header>

                {selectedItem === 0 ? <h1>{t('home.recipients')}</h1> : ''}
                {selectedItem === 1 ? <h1>{t('home.donors')}</h1> : ''}
                {selectedItem === 2 ? <h1>{t('home.campaigns')}</h1> : ''}
                {selectedItem === 3 ? <h1>{t('home.basicSettings')}</h1> : ''}
                {selectedItem === 4 ? <h1>{t('home.reports')}</h1> : ''}
                <div className='AdminTopbarNew2' >
                  <button onClick={toggleSidebar}>
                    <i className={`fa ${isSidebarOpen ? 'fa-arrow-left' : 'fa-bars'}`}></i>
                  </button>
                  {isSidebarOpen && (
                    // className='Dashboard_Sidebar_New_Admin_'
                    <div >
                      <ul className='Dashboard_Sidebar_New_Admin_'>
                        <li className={selectedItem === 0 ? 'active' : ''} onClick={() => handleItemClick(0)}>{t('home.recipients')}</li>
                        <li className={selectedItem === 1 ? 'active' : ''} onClick={() => handleItemClick2(1)}>{t('home.donors')}</li>
                        <li className={selectedItem === 2 ? 'active' : ''} onClick={() => handleItemClick3(2)}>{t('home.campaigns')}</li>
                        <li className={selectedItem === 3 ? 'active' : ''} onClick={() => handleItemClick4(3)}>{t('home.basicSettings')}</li>
                        <li className={selectedItem === 4 ? 'active' : ''} onClick={() => handleItemClick5(4)}>{t('home.reports')}</li>
                        <li className={selectedItem === 5 ? 'active' : ''} onClick={() => handleItemClick6(5)}>{t('home.user')}</li>
                        <button className='sm bg-danger' style={{display:'block',margin:"2%"}} onClick={Logout}>Logout</button>
                      </ul>
                    </div>
                  )}
                </div>
              </header>

              <div className="table-responsive">
                <Table responsive striped hover className="table table-bordered">

                  {
                    setttings ?
                      selectedItem == 3 ?
                        <SystemSettings />
                        :
                        selectedItem == 4 ?
                          <ReportGenerator />
                          :
                          <UserPanel />
                      :
                      <thead>
                        {
                          selectedItemIndex.length !== null ?
                            selectedItemIndex[0]?.userType == 'Recipient' ?
                              <tr>
                                <th scope="col">Profile</th>
                                {/* <th>Email</th> */}
                                <th scope="col">Name</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Type</th>
                                <th scope="col">Actions</th>
                              </tr>
                              :
                              selectedItemIndex[0]?.userType == 'Donor' ?
                                <tr>
                                  <th scope="col">Profile</th>
                                  {/* <th>Email</th> */}
                                  {/* <th scope="col">First Name</th> */}
                                  <th scope="col">Last Name</th>
                                  <th scope="col">Type</th>
                                  {/* <th>Subscription</th> */}
                                  <th scope="col">Actions</th>
                                </tr>
                                :
                                <tr>
                                  <th scope="col">Title</th>
                                  {/* <th>description</th> */}
                                  <th scope="col">startDate</th>
                                  <th scope="col">endDate</th>
                                  <th scope="col">price</th>
                                  <th scope="col">user</th>
                                  <th scope="col">Actions</th>
                                </tr>
                            : ''
                        }
                      </thead>
                  }          <tbody>
                    {
                      setttings ?
                        ''
                        :
                        adminLoading2 ?
                          (
                            <Loader />
                          )
                          :
                          selectedItemIndex.length !== null ?
                            selectedItemIndex[0]?.userType == 'Recipient' ?
                              selectedItemIndex.map((row, ind) => (
                                <tr key={row._id}>
                                  {/* <img src={`uploads/${row.profilePicture}`} alt="Admin" className="rounded-circle" width="150" /> */}
                                  <td className="text-nowrap">
                                    <div className="d-flex align-items-center">
                                      <Avatar src={`uploads/${row.profilePicture}`} size="l" name={row.name} />
                                      <div className="ms-2">{row.name}</div>
                                    </div>
                                  </td>

                                  <td className="text-nowrap">
                                    <input type="text" name="name" id="" value={row.name} onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSelectedItemIndex((prevData) => {
                                        const newData = [...prevData];
                                        newData[ind].name = newValue;
                                        return newData;
                                      });
                                    }}
                                    />
                                  </td>
                                  <td className="text-nowrap">
                                    <input type="text" name="phone" id="" value={row.phone} onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSelectedItemIndex((prevData) => {
                                        const newData = [...prevData];
                                        newData[ind].phone = newValue;
                                        return newData;
                                      });
                                    }}
                                    />
                                  </td>
                                  <td className="text-nowrap">
                                    <input type="text" name="recipientType" id="" value={row.recipientType} onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSelectedItemIndex((prevData) => {
                                        const newData = [...prevData];
                                        newData[ind].recipientType = newValue;
                                        return newData;
                                      });
                                    }}
                                    />
                                  </td>
                                  <td className="text-nowrap">
                                    <button style={{ marginRight: '1px' }} onClick={() => EditUser(row._id, row.name, row.phone, row.recipientType)} className="btn btn-primary btn-sm mx-1">Edit</button>
                                    <button onClick={() => DeleteUser(row._id)} className="btn btn-danger btn-sm mx-1">Delete</button>
                                  </td>
                                </tr>
                              ))

                              :
                              selectedItemIndex[0]?.userType == 'Donor' ?
                                selectedItemIndex.map((row, ind) => (
                                  <tr key={row._id}>
                                    {/* <img src={`uploads/${row.profilePicture}`} alt="Admin" className="rounded-circle" width="150" /> */}
                                    <td className="text-nowrap">
                                      <div className="d-flex align-items-center">
                                        <Avatar src={`uploads/${row.profilePicture}`} size="l" name={row.firstName} />
                                        <div className="ms-2">{row.firstName}</div>
                                      </div>
                                    </td>
                                    {/* <td>{row.email}</td> */}
                                    {/* <td>{row.firstName} {row.lastName}</td>
                          <td>{row.recipientType}</td> */}
                                    {/* <td>
                              <input type="text" name="firstName" id="" value={row.firstName} onChange={(e) => {
                                const newValue = e.target.value;
                                setSelectedItemIndex((prevData) => {
                                  const newData = [...prevData];
                                  newData[ind].firstName = newValue;
                                  return newData;
                                });
                              }}
                              />
                            </td> */}
                                    <td className="text-nowrap">
                                      <input type="text" name="lastName" id="" value={row.lastName} onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedItemIndex((prevData) => {
                                          const newData = [...prevData];
                                          newData[ind].lastName = newValue;
                                          return newData;
                                        });
                                      }}
                                      />
                                    </td>
                                    <td className="text-nowrap">
                                      <input type="text" name="recipientType" id="" value={row.recipientType} onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedItemIndex((prevData) => {
                                          const newData = [...prevData];
                                          newData[ind].recipientType = newValue;
                                          return newData;
                                        });
                                      }}
                                      />
                                    </td >

                                    {/* <td>{row.subscription?.active}</td> */}
                                    <td className="text-nowrap">
                                      <button style={{ marginRight: '1px' }} onClick={() => { EditUser2(row._id, row.firstName, row.lastName, row.recipientType) }} className="btn btn-primary btn-sm mx-1">Edit</button>
                                      <button className="btn btn-danger btn-sm mx-1">Delete</button>
                                    </td>
                                  </tr>
                                ))
                                : selectedItemIndex.map((row, ind) => (
                                  <tr key={row._id}>
                                    <td className="text-nowrap">
                                      <input type="text" name="title" id="" value={row.title} onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedItemIndex((prevData) => {
                                          const newData = [...prevData];
                                          newData[ind].title = newValue;
                                          return newData;
                                        });
                                      }}
                                      />
                                    </td>
                                    <td className="text-nowrap">
                                      {/* row.startDate ? row.startDate.substring(0, 10) */}
                                      <input type="text" name="startDate" id="" value={row.startDate ? row.startDate.substring(0, 10) : ""} onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedItemIndex((prevData) => {
                                          const newData = [...prevData];
                                          newData[ind].startDate = newValue;
                                          return newData;
                                        });
                                      }}
                                      />
                                    </td >
                                    <td className="text-nowrap">
                                      <input type="text" name="endDate" id="" value={row.endDate ? row.endDate.substring(0, 10) : ""} onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedItemIndex((prevData) => {
                                          const newData = [...prevData];
                                          newData[ind].endDate = newValue;
                                          return newData;
                                        });
                                      }}
                                      />
                                    </td>
                                    <td className="text-nowrap">
                                      <input type="text" name="price" id="" value={row.price} onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedItemIndex((prevData) => {
                                          const newData = [...prevData];
                                          newData[ind].price = newValue;
                                          return newData;
                                        });
                                      }}
                                      />
                                    </td>
                                    <td className="text-nowrap"><FetchUser id={row.userId} />
                                    </td>
                                    <td className="text-nowrap">
                                      <button style={{ marginRight: '1px' }} onClick={() => EditCampaign(row._id, row.title, row.startDate, row.endDate, row.price)} className="btn btn-primary btn-sm mx-1">Edit</button>
                                      <button onClick={() => DeleteCampaign(row._id)} className="btn btn-danger btn-sm mx-1">Delete</button>
                                    </td>
                                  </tr>
                                ))
                            : ''
                    }
                  </tbody>
                </Table>
                {/* </table> */}

                {/* <TableRow data={selectedItemIndex}/> */}
              </div>
            </div>
          </div>
        </div>

        :
        // ''
        <h6>You are not an ADMIN</h6>
    // navigate('/')
  );
}

export default AdminPage;
