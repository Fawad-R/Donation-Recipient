import React, { useEffect, useState } from 'react';
import '../PagesStyling/SystemSettings.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    MDBInput,
    MDBBtn,
    MDBCheckbox,
    MDBRow,
    MDBCol,
    MDBAccordion,
    MDBTextArea,
    MDBRadio
} from 'mdb-react-ui-kit';

function SystemSettings() {
    let navigate = useNavigate();
    const { t } = useTranslation();
    const [systemSettings, setSystemSettings] = useState({
        systemName: '',
        title: '',
        logo: null,
        favicon: null,
        email: '',
        mobile: '',
        types: []
    });

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        setSystemSettings({ ...systemSettings, logo: file });
    };

    const faviconChange = (event) => {
        const file = event.target.files[0];
        setSystemSettings({ ...systemSettings, favicon: file });
    };
    const [formErrors, setFormErrors] = useState({});
    const handleSave = async () => {
        console.log('numPDF', numPDF)
        console.log('statePdf', statePdf)
        console.log('systemSettings', systemSettings)

        // Perform client-side validation
        if (systemSettings.systemName.trim() === '') {
            alert('Please enter a System Name.');
            return;
        }

        if (systemSettings.title.trim() === '') {
            alert('Please enter a Title.');
            return;
        }

        if (!systemSettings.logo) {
            alert('Please upload a Logo.');
            return;
        }

        if (!systemSettings.email || !/^\S+@\S+\.\S+$/.test(systemSettings.email)) {
            alert('Please enter a valid Email.');
            return;
        }

        if (!systemSettings.mobile || !/^[0-9]+$/.test(systemSettings.mobile)) {
            alert('Please enter a valid Mobile number.');
            return;
        }

        // The form is valid, proceed with the save operation
        const formData = new FormData();
        formData.append('logo', systemSettings.logo);
        formData.append('favicon', systemSettings.favicon);

        try {
            let val = await axios.post('/upload-assets', formData);
            console.log('Logo uploaded successfully');
        } catch (error) {
            console.error('Error uploading logo:', error);
        }
        const { systemName, title, email, mobile } = systemSettings;
        let types = numPDF.slice(1)
        console.log('types', types)
        // systemSettings.types?.map((ele,ind)=>{
        //     console.log('ele', ele)
        //     types.push(ele)
        // })
        systemSettings.types.forEach((ele) => {
            if (typeof ele === 'string') {
                const trimmedType = ele.trim();
                if (trimmedType.length > 0) {
                    types.push(trimmedType);
                }
            }
        });
        if (typeof statePdf === 'string') {
            const trimmedStatePdf = statePdf.trim();
            if (trimmedStatePdf.length > 0) {
                types.push(trimmedStatePdf);
            }
        }
        // types.push(statePdf)
        console.log('types', types)
        try {
            let val = await axios.post('/system-settings', { systemName, title, email, mobile, types });
            console.log('System settings updated successfully');
            if (val.status === 200) {
                alert('Updated!');
                navigate('/');
            } else {
                alert('Error!');
            }
        } catch (error) {
            alert(error);
            console.error('Error updating system settings:', error);
        }
    };
    let fetchDetails = async () => {
        let val = await axios.get('/system-settings')
        console.log('val is here', val)
        console.log('val', val.data)
        setSystemSettings(val.data)
    }
    useEffect(() => {
        fetchDetails()
    }, [])
    const [types, setTypes] = useState([]);
    const [newType, setNewType] = useState('');

    useEffect(() => {
        // Fetch existing Types when the component mounts
        axios.get('/api/types')
            .then((response) => setTypes(response.data))
            .catch((error) => console.error(error));
    }, []);

    const createType = () => {
        axios.post('/api/types', { name: newType })
            .then((response) => {
                setTypes([...types, response.data]);
                setNewType('');
            })
            .catch((error) => console.error(error));
    };

    const updateType = (typeId, newName) => {
        axios.put(`/api/types/${typeId}`, { name: newName })
            .then((response) => {
                const updatedTypes = types.map((type) =>
                    type._id === typeId ? { ...type, name: newName } : type
                );
                setTypes(updatedTypes);
            })
            .catch((error) => console.error(error));
    };

    const deleteType = (typeId) => {
        axios.delete(`/api/types/${typeId}`)
            .then(() => {
                const updatedTypes = types.filter((type) => type._id !== typeId);
                setTypes(updatedTypes);
            })
            .catch((error) => console.error(error));
    };

    // const handleTypeInputChange = (e) => {
    //     setSystemSettings({ ...systemSettings, newType: e.target.value });
    // };
    // const addType = () => {
    //     console.log('systemSettings',systemSettings)
    //     // Add the new type to the types array
    //     if (systemSettings.newType.trim() !== '') {
    //         setSystemSettings({
    //             ...systemSettings,
    //             types: [...systemSettings.types, systemSettings.newType],
    //             newType: '', // Clear the input field
    //         });
    //     }
    // };
    let [statePdf, updateStatePdf] = useState()
    const [numPDF, setNumPDF] = useState([]);
    // const [numPDF, setNumPDF] = useState([statePdf]);
    let AddPDFs = (e) => {
        e.preventDefault();
        console.log('statePdf', statePdf)
        // if(numPDF!==undefined)
        // {
        setNumPDF([...numPDF, statePdf]);
        // }
        // else
        // {
        //     setNumPDF(statePdf);
        // }
        // setNumPDF([...numPDF, { coursePDF: '' }]);
    }
    let inputEventPDF = (e) => {
        console.log('inputEventPDF', e.target.value);
        const newPDF = e.target.value;
        updateStatePdf(newPDF)
        // setFormData((prev) => {
        //     indexing++;
        //     newArr2.push(newPDF);
        //     return { ...prev, coursePDF: newArr2 };
        // });
        // updateStateCheck(true);
    }
    const [pdfUploadVisible, setPdfUploadVisible] = useState(false);


    // Function to toggle PDF upload visibility
    const togglePdfUpload = () => {
        setPdfUploadVisible(!pdfUploadVisible);
    };


    return (
        <div className="system-settings">
            <div className="setting">
                <label>{t('systemName')}:</label>
                <input
                    type="text"
                    placeholder={t('enterSystemName')}
                    value={systemSettings.systemName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, systemName: e.target.value })}
                />
            </div>
            <div className="setting">
                <label>{t('title')}:</label>
                <input
                    type="text"
                    placeholder={t('enterTitle')}
                    value={systemSettings.title}
                    onChange={(e) => setSystemSettings({ ...systemSettings, title: e.target.value })}
                />
            </div>
            <div className="setting">
                <label>{t('logo')}:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                />
                {/* {systemSettings.logo && <img style={{ width: "130px", height: "130px" }} src={URL?.createObjectURL(systemSettings.logo)} alt="Uploaded Logo" />} */}
                {systemSettings.logo && <img style={{ width: "130px", height: "130px" }} src={`uploads/${systemSettings.logo}`} alt="Uploaded Logo" />}
            </div>
            <div className="setting">
                <label>{t('favicon')}:</label>
                <input type="file"
                    accept='image/*'
                    onChange={faviconChange}
                />
            </div>
            <div className="setting">
                <label>{t('email')}:</label>
                <input
                    type="email"
                    placeholder={t('enterEmail')}
                    value={systemSettings.email}
                    onChange={(e) => setSystemSettings({ ...systemSettings, email: e.target.value })}
                />
            </div>
            <div className="setting">
                <label>{t('mobile')}:</label>
                <input
                    type="tel"
                    placeholder={t('enterMobile')}
                    value={systemSettings.mobile}
                    onChange={(e) => setSystemSettings({ ...systemSettings, mobile: e.target.value })}
                />
            </div>
            {/* <div className="setting">
                <label>{t('types')}:</label>
                <div>
                    <input
                        type="text"
                        placeholder={t('enterTypes')}
                        value={systemSettings.newType}
                        onChange={handleTypeInputChange}
                    />
                    <button onClick={addType}>Add Type</button>
                </div>
                <ul>
                    {systemSettings.types?.map((type, index) => (
                        <li key={index}>{type}</li>
                    ))}
                </ul>
            </div> */}
            <div>
                <label style={{ textAlign: "left" }} htmlFor="">
                    Types:
                </label>
                <MDBCol md="12">

                    {systemSettings.types?.map((ele, ind) => {
                        const handleTypeChange = (e) => {
                            const updatedTypes = [...systemSettings.types];
                            updatedTypes[ind] = e.target.value;
                            setSystemSettings({ ...systemSettings, types: updatedTypes });
                        };
                        return (
                            <>
                                {console.log('ele', ele)}
                                {console.log('ind', ind)}
                                <MDBInput
                                    required
                                    onChange={handleTypeChange} type="text" name="types" placeholder="Title" style={{ height: "100%", color: "black", marginBottom: '2px' }}
                                    id="file"
                                    className="box-file"
                                    data-multiple-caption="{count} files selected"
                                    multiple=""
                                    value={ele}
                                />
                            </>)
                    })}



                    {numPDF
                        ? numPDF.map((ele, ind) => {
                            return (
                                <>
                                    {

                                        <MDBInput
                                            required
                                            onChange={inputEventPDF} type="text" name="types" placeholder="Title" style={{ height: "100%", color: "black", marginBottom: '2px' }}
                                            id="file"
                                            className="box-file"
                                            data-multiple-caption="{count} files selected"
                                            multiple=""
                                        />

                                    }
                                    {formErrors.coursePDF && (
                                        <p className="error">{formErrors.coursePDF}</p>
                                    )}
                                </>
                            );
                        })
                        : ''}
                </MDBCol>
                <MDBCol md="12">
                    <button
                        className="MDBBtn button"
                        onClick={(e) => AddPDFs(e)}
                    >
                        Add more Types
                    </button>
                </MDBCol>
            </div>
            <div>
            </div>
            <button onClick={handleSave} className="btn btn-primary">
                {t('save')}
            </button>
        </div>
    );
}

export default SystemSettings;
