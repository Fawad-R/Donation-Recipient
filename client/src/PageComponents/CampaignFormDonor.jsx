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



import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const CampaignFormDonor = () => {
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

  let navigate = useNavigate()
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
        console.log('val.status0', val)
        console.log('val.status', val.status)
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
  let FetchNextPage = async (e) => {
    console.log(e)
    navigate(`/singlecampaign/${e}`)
  }
  return (
    <div className="campaign-form-container">
      <Container fluid style={{ background: 'linear-gradient(to right, #4b6cb7, #182848)' }}>
        <Row className="align-items-center justify-content-center text-center" style={{ minHeight: '5vh' }}>
          <Col xs={12} sm={6} md={4} lg={3}>
            <h6 style={{ color: 'white', marginTop: '2px' }}>Campaign</h6>
          </Col>
        </Row>
      </Container>
      <div className="card-container__new">
        {fetchedData !== null ? (
          <Container>

            <Row>
              {fetchedData !== null ? (
                fetchedData?.map((ele, ind) => {
                  return (
                    <Col key={ind} xs={12} sm={12} md={4} lg={4}>
                      <Card className='mb-3' style={{ width: '100%' }}>
                        {/* // onClick={() => FetchNextPage(ele._id)} */}
                        {/* <div key={ind} className="card__new"> */}
                        <Card.Body>
                          <Card.Text>
                            <Row>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                <img src={`uploads/${ele.projections[0]}`} alt="" style={{ width: '100%', height: '250px' }} />
                              </Col>
                            </Row>
                          </Card.Text>

                          <Card.Title>
                            <h2 className='text-justify'>{ele.title}</h2>
                          </Card.Title>
                          <Card.Text>
                            <p className="date text-left">
                              <span className="bold-text">Start Date:</span>
                              {ele.startDate ? ele.startDate.substring(0, 10) : ''}
                            </p>
                          </Card.Text>
                          <Card.Text>
                            <p className="date text-left">
                              <span className="bold-text text-left">End Date:</span>
                              {ele.endDate ? ele.endDate.substring(0, 10) : ''}
                            </p>
                          </Card.Text>
                          <Card.Text>
                            <p className="price text-left">
                              <span className="bold-text">Price:</span> {ele.price}$
                            </p>
                          </Card.Text>
                          <Card.Text>
                            <p className="description text-justify">
                              <span className="bold-text">Description:</span> {ele.description}
                            </p>
                          </Card.Text>
                        </Card.Body>
                        {/* </div> */}
                      </Card>
                    </Col>
                  );
                })
              ) : (
                ''
              )}
            </Row>
          </Container>
        ) : (
          ''
        )}
      </div>


    </div>
  );
};

export default CampaignFormDonor;
