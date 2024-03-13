import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDropzone } from 'react-dropzone';
import '../PagesStyling/CampaignForm.css'
import '../PagesStyling/createCampaign.css'
import '../PagesStyling/DonorCampaign.css'
import { useTranslation } from 'react-i18next';
import { Table } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
const CampaignForm = () => {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userType, setUserType] = useState('');
  const [fetchedData, updateFetchedData] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const [recipientCustomAmounts, setRecipientCustomAmounts] = useState({});
  let navigate=useNavigate()
  useEffect(() => {
    const storedUserType = JSON.parse(localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);

  const onDropProgress = (acceptedFiles) => {
    const newUploadedImages = [...uploadedImages];
    acceptedFiles.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setProgress(100);
        newUploadedImages.push(fileReader.result);
        setUploadedImages(newUploadedImages);
      };
      fileReader.readAsDataURL(file);
    });
  };

  const dataURItoBlob = (dataURI) => {
    const [contentType, data] = dataURI.split(';base64,');
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: contentType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('title', title);

    uploadedImages.forEach((image, index) => {
      const blob = dataURItoBlob(image);
      formData.append('projectionsAndProgress', blob);
    });

    for (const entry of formData.entries()) {
      console.log('entry', entry);
    }

    let val = await fetch('/allcampaigns', {
      method: 'POST',
      body: formData,
    });

    let val2 = await val.json();

    if (val.status === 200) {
      alert('New campaign created!');
      console.log(val2);
      setCreateMode(false);
      fetchRecipient();
    }
    else {
      alert(val.status);

    }
  };

  const { getRootProps: getProgressRootProps, getInputProps: getProgressInputProps } = useDropzone({
    onDrop: onDropProgress,
    accept: 'image/*',
    multiple: true,
  });

  let fetchRecipient = async () => {
    try {
      // let val = await axios.get('/campaign');
      let val = await axios.get('/Allcampaigns');
      console.log('val.data', val.data);
      updateFetchedData(val.data);
      console.log('fetchedData', fetchedData);
      console.log('recipientCustomAmounts', recipientCustomAmounts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecipient();
  }, []);

  let updateData = async (e, id, startDate, endDate, price, description, title) => {
    e.preventDefault()
    try {
      let val = await fetch(`/campaign/${id}`, {
        method: "PUT",
        headers: {
          'content-type': "application/json"
        },
        body: JSON.stringify({ startDate, endDate, price, description, title })
      })
      if (val.status === 200) {
        alert('Campiagn updated sucessfully')
        fetchRecipient();
        // location.reload()
      }
      else {
        alert('You can only update your campaign!')
        // location.reload()
      }
    } catch (error) {
      alert(error)

    }
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let DeleteCampaign = async (e) => {
    console.log('e', e)
    const confirmDelete = window.confirm('Confirm Delete?');
    if (confirmDelete) {

      try {
        console.log('herer')
        let val = await axios.delete(`/campaign/${e}`)
        console.log('val.status0',val)
        console.log('val.status',val.status)
        if (val.data !== 'error') {
          toast.success('Deleted!', {
            position: 'top-right',
          });
          setTimeout(() => {
            /* eslint-disable no-restricted-globals */
            location.reload()
          }, 3000);
        }
        else {
          alert('You can only delete your campaign!')
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
  let FetchNextPage=async(e)=>{
    console.log(e)
    navigate(`/singlecampaign/${e}`)
  }
  return (
    <div className="campaign-form-container">
      <ToastContainer/>
      {userType !== 'Recipient' ? (
        <Container>
        <h6 style={{ marginTop: '2px' }}>Campaign</h6>
        <div className="card-container__new">
          {fetchedData !== null ? (
            fetchedData?.map((ele, ind) => {
              return (
                // onClick={()=>FetchNextPage(ele._id)}
                <div key={ind} className="card__new">
                  <div className="image-container">
                    {ele.projections.map((ele, ind) => (
                      <img key={ind} src={`uploads/${ele}`} alt="" />
                    ))}
                  </div>
                  <h2>{ele.title}</h2>
                  <p className="date">
                    <span className="bold-text">Start Date:</span>
                    {ele.startDate ? ele.startDate.substring(0, 10) : ''}
                  </p>
                  <p className="date">
                    <span className="bold-text">End Date:</span>
                    {ele.endDate ? ele.endDate.substring(0, 10) : ''}
                  </p>
                  <p className="price">
                    <span className="bold-text">Price:</span> {ele.price}
                  </p>
                  <p className="description">
                    <span className="bold-text">Description:</span> {ele.description}
                  </p>
                </div>
              );
            })
          ) : (
            ''
          )}
        </div>
      </Container>
      ) : (
        <>
        {/* style={{ marginBottom: "100px" }} */}
          <div >
            {/* {!createMode ? <button onClick={() => setCreateMode(true)}>{t('home.createNewCampaign')}</button> : ''} */}
            {/* <Table> */}
            <Table style={{
    width: '97%', // Make the table width responsive
    padding: '10px', // Add padding to the entire table
    margin: '2px auto',     // Remove margin
 // Separate border model for cell spacing
    borderSpacing: '10px',     // Add cell spacing
  }} responsive striped hover className="table table-bordered">
              {!createMode ?
                <thead>
                  <tr>
                    <th scope="col">Images</th>
                    <th scope="col">Title</th>
                    {/* <th>description</th> */}
                    <th scope="col">startDate</th>
                    <th scope="col">endDate</th>
                    <th scope="col">price</th>
                    <th scope="col">user</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                : ""}
              <tbody>
                {!createMode ? (
                  fetchedData?.length !== 0 ? (

                    fetchedData?.map((ele, ind) => {
                      return (
                        // <form key={ind} className="campaign-item-form">
                          // <h2>{ele.title}</h2>

                          <tr key={ele._id}>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '1%', flexWrap: 'wrap' }} className="image-container">
                              {ele.projections.map((ele, ind) => {
                                return <img style={{ width: '30px', height: '20px', margin: '5px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }} key={ind} src={`uploads/${ele}`} alt="" />;
                              })}

                            </div>
                            <td className="text-nowrap">
                              <input
                                type="date"
                                name="startDate"
                                value={ele.startDate ? ele.startDate.substring(0, 10) : ''}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  updateFetchedData((prevData) => {
                                    const newData = [...prevData];
                                    newData[ind].startDate = newValue;
                                    return newData;
                                  });
                                }}
                              />
                            </td>
                            <td className="text-nowrap">
                              <input
                                type="date"
                                name="endDate"
                                value={ele.endDate ? ele.endDate.substring(0, 10) : ''}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  updateFetchedData((prevData) => {
                                    const newData = [...prevData];
                                    newData[ind].endDate = newValue;
                                    return newData;
                                  });
                                }}
                              />
                            </td>
                            <td className="text-nowrap">
                              <input
                                type="number"
                                name="price"
                                value={ele.price}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  updateFetchedData((prevData) => {
                                    const newData = [...prevData];
                                    newData[ind].price = newValue;
                                    return newData;
                                  });
                                }}
                              />
                            </td>
                            <td className="text-nowrap">
                              <input
                                type="text"
                                name="title"
                                value={ele.title}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  updateFetchedData((prevData) => {
                                    const newData = [...prevData];
                                    newData[ind].title = newValue;
                                    return newData;
                                  });
                                }}
                              />
                            </td>
                            <td className="text-nowrap">
                              <input
                                type="text"
                                name="description"
                                value={ele.description}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  updateFetchedData((prevData) => {
                                    const newData = [...prevData];
                                    newData[ind].description = newValue;
                                    return newData;
                                  });
                                }}
                              />
                            </td>
                            <td className="text-nowrap">
                              <button className="btn btn-primary btn-sm mx-1"
                                onClick={(e) =>
                                  updateData(
                                    e,
                                    ele._id,
                                    ele.startDate,
                                    ele.endDate,
                                    ele.price,
                                    ele.description,
                                    ele.title
                                  )
                                }
                              >
                                {t('home.save')}
                              </button>
                              <button onClick={() => DeleteCampaign(ele._id)} className="btn btn-danger btn-sm mx-1">Delete</button>
                            </td>
                          </tr>
                        // {/* </form> */}
                      );
                    })
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )
                }
              </tbody>
            </Table>
          </div>
          {!createMode ? <button style={{marginBottom:'20px'}} onClick={() => setCreateMode(true)}>{t('home.createNewCampaign')}</button> : ''}
          {createMode ? (
            <div style={{ marginBottom: '20px' }} className='CreateMode'>
              <h6>{t('home.createNewCampaign')}</h6>
              <form className="form-container2" onSubmit={handleSubmit}>
                <div>
                  <label className="form-label">{t('home.title')}:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title"
                    className="form-input"
                  />
                </div>
                <div className="date-picker-container">
                  <div className="date-picker">
                    <label className="form-label date-picker-label">{t('home.startDate')}</label>
                    <DatePicker selected={startDate} minDate={tomorrow} onChange={setStartDate} placeholderText="Select Start Date" />
                  </div>
                  <div className="date-picker">
                    <label className="form-label date-picker-label">{t('home.endDate')}</label>
                    <DatePicker selected={endDate} minDate={startDate} onChange={setEndDate} placeholderText="Select End Date" />
                  </div>
                </div>
                <div>
                  <label className="form-label">{t('home.price')}:</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter Price"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">{t('home.description')}:</label>
                  <textarea
                    value={description}
                    rows="7"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Description"
                    className="textarea-input"
                  />
                </div>
                <div>
                  <label className="form-label">{t('home.projectionsAndProgressImages')}:</label>
                  {uploadedImages?.length > 0 && (
                    <div>
                      {uploadedImages.map((image, index) => (
                        <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: '100px', height: '100px', marginRight: '5px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }} />
                      ))}
                    </div>
                  )}
                  <div {...getProgressRootProps()} style={{ border: '2px dashed #ccc', backgroundColor: '#fff', padding: '20px', textAlign: 'center', cursor: 'pointer', marginTop: '10px' }}>
                    <input {...getProgressInputProps()} />
                    <p>Drag 'n' drop</p>
                  </div>
                </div>

                <div>
                  <label className="form-label">Progress:</label>
                  <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '20px', borderRadius: '4px', marginTop: '10px' }}>
                    <div style={{ height: '100%', backgroundColor: '#007bff', borderRadius: '4px', textAlign: 'center', lineHeight: '20px', color: '#fff', width: `${progress}%` }}>{progress}%</div>
                  </div>
                </div>

                <div>
                  <button type="submit" className="submit-button">{t('home.submit')}</button>
                </div>
              </form>
            </div>) : (
            ''
          )}
        </>
      )}

    </div>
  );
};

export default CampaignForm;
