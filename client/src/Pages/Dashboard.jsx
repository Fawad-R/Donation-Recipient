// Dashboard.js
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;
