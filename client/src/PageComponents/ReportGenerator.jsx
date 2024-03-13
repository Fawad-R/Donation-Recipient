import '../PagesStyling/ReportGenerator.css';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


function ReportGenerator() {
    const { t } = useTranslation()
    const [selectedOption, setSelectedOption] = useState('dataOption1');
    const [selectedItemIndex, setSelectedItemIndex] = useState([]);
    const [csvData, setCsvData] = useState('');
    const [showCsvTable, setShowCsvTable] = useState(false);

    useEffect(() => {
        fetchDataForOption(selectedOption);
    }, [selectedOption]);

    const fetchDataForOption = async (option) => {
        try {
            let response;
            if (option === 'dataOption1') {
                response = await axios.get('/receipientOnly');
            } else if (option === 'dataOption2') {
                response = await axios.get('/donorOnly');
            } else if (option === 'dataOption3') {
                response = await axios.get('/Allcampaigns');
            }

            setSelectedItemIndex(response.data);
        } catch (error) {
            alert(error);
        }
    }

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const generateCSVReport = () => {
        const csv = Papa.unparse(selectedItemIndex);
        setCsvData(csv);
        setShowCsvTable(true);
    };

    const downloadCSVReport = () => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderCSVTable = () => {
        if (showCsvTable) {
            const lines = csvData.split('\n');
            return (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                {lines[0].split(',').map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lines.slice(1).map((line, index) => (
                                <tr key={index}>
                                    {line.split(',').map((cell, index) => (
                                        <td key={index}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        return null;
    };
    // const renderCSVTable = () => {
    //     if (showCsvTable) {
    //         return (
    //             <div className="table-responsive">
    //                 <table className="table table-bordered table-striped">
    //                     <thead className="thead-dark">
    //                         <tr>
    //                             {Object.keys(selectedItemIndex[0]).map((header) => (
    //                                 <th key={header}>{header}</th>
    //                             ))}
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {selectedItemIndex.map((item, index) => (
    //                             <tr key={index}>
    //                                 {Object.values(item).map((cell, index) => (
    //                                     <td key={index}>{cell}</td>
    //                                 ))}
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         );
    //     }
    //     return null;
    // };

    return (
        // <div className="report-generator">
        //     <div className="option-selector form-group">
        //         <label htmlFor="reportOptionSelect">Select</label>
        //         <select id="reportOptionSelect" className="form-control" value={selectedOption} onChange={handleOptionChange}>
        //             <option value="dataOption1">{t('home.recipients')}</option>
        //             <option value="dataOption2">{t('home.donors')}</option>
        //             <option value="dataOption3">{t('home.campaigns')}</option>
        //         </select>
        //     </div>
        //     <div style={{ margin: "1%" }} className="button-container">
        //         <button className="btn btn-primary" onClick={generateCSVReport}>
        //             {t('home.generateCSVReport')}
        //         </button>
        //         {showCsvTable && (
        //             <button className="btn btn-success" onClick={downloadCSVReport}>
        //                 {t('home.downloadCSVReport')}
        //             </button>
        //         )}
        //     </div>
        //     {renderCSVTable()}
        // </div>
        <div className="report-generator">
        {/* <h2>{t('home.reportGenerator')}</h2> */}
        <div className="option-selector form-group">
            <label htmlFor="reportOptionSelect">{t('home.select')}</label>
            <select id="reportOptionSelect" className="form-control" value={selectedOption} onChange={handleOptionChange}>
                <option value="dataOption1">{t('home.recipients')}</option>
                <option value="dataOption2">{t('home.donors')}</option>
                <option value="dataOption3">{t('home.campaigns')}</option>
            </select>
        </div>
        <div className="button-container">
            <button className="btn btn-primary" onClick={generateCSVReport}>
                {t('home.generate')}
            </button>
            {showCsvTable && (
                <button className="btn btn-success" onClick={downloadCSVReport}>
                    {t('home.download')}
                </button>
            )}
        </div>
        {renderCSVTable()}
    </div>
    );
}

export default ReportGenerator;
