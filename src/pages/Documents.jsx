import React, { useState } from 'react';
import { IoIosDocument } from "react-icons/io";
import { HiDownload } from "react-icons/hi";

const pendingDocuments = [
  {
    id: 1,
    title: 'Personal Details',
    description: 'Download template fill in your information and upload it here by May 5, 2025',
    type: 'urgent',
    status: 'pending',
    templateUrl: '/templates/personal-details.pdf'
  },
  {
    id: 2,
    title: 'Employment Contract',
    description: 'Review and sign your employment contract by May 10, 2025',
    type: 'urgent',
    status: 'pending',
    templateUrl: '/templates/contract.pdf'
  },
  {
    id: 3,
    title: 'Tax Information',
    description: 'Submit your tax information using this template by May 15, 2025',
    type: 'normal',
    status: 'pending',
    templateUrl: '/templates/tax-form.pdf'
  },
  {
    id: 4,
    title: 'Health Insurance',
    description: 'Complete your health insurance enrollment form by May 20, 2025',
    type: 'urgent',
    status: 'pending',
    templateUrl: '/templates/health-insurance.pdf'
  },
  {
    id: 5,
    title: 'Direct Deposit Form',
    description: 'Set up your direct deposit information for payroll by May 12, 2025',
    type: 'urgent',
    status: 'pending',
    templateUrl: '/templates/direct-deposit.pdf'
  },
  {
    id: 6,
    title: 'Emergency Contact',
    description: 'Update your emergency contact information in our system',
    type: 'normal',
    status: 'pending',
    templateUrl: '/templates/emergency-contact.pdf'
  },
  {
    id: 7,
    title: 'Benefits Selection',
    description: 'Choose your benefits package for the upcoming year',
    type: 'urgent',
    status: 'pending',
    templateUrl: '/templates/benefits.pdf'
  },
  {
    id: 8,
    title: 'Company Policy',
    description: 'Review and acknowledge company policies and procedures',
    type: 'normal',
    status: 'completed',
    templateUrl: '/templates/policy.pdf'
  },
  {
    id: 9,
    title: 'Training Certification',
    description: 'Complete required training modules and certification',
    type: 'normal',
    status: 'upcoming',
    templateUrl: '/templates/training.pdf'
  },
  {
    id: 10,
    title: 'Equipment Request',
    description: 'Submit your work equipment request form',
    type: 'normal',
    status: 'pending',
    templateUrl: '/templates/equipment.pdf'
  }
];

const getStatusStyles = (status) => {
  switch (status) {
    case 'pending':
      return {        bg: 'bg-[#F1EFED]',
        text: 'text-[#C1BBB3]',
        border: 'border-[#EB1700]',
        button: 'bg-[#EB1700] hover:bg-[#D21500]'
      };
    case 'completed':
      return {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-400',
        button: 'bg-green-500 hover:bg-green-600'
      };
    case 'upcoming':
      return {
        bg: 'bg-violet-100',
        text: 'text-violet-600',
        border: 'border-violet-400',
        button: 'bg-violet-500 hover:bg-violet-600'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-200',
        button: 'bg-gray-500 hover:bg-gray-600'
      };
  }
};


const DocumentCard = ({ document }) => {
    const statusStyles = getStatusStyles(document.status);
  
    return (
      <div className={`w-[220px] h-[217px] border-2 ${statusStyles.border} rounded-[20px] p-4 flex flex-col`}>
        <div className="mb-4">
          <h3 className="font-semibold mb-1">{document.title}</h3>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${statusStyles.bg} ${statusStyles.text} mb-2`}>
            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
          </span>
          <p className="text-sm text-gray-600 line-clamp-2">
            {document.description}
          </p>
        </div>
        <div className="mt-auto space-y-2">
          <button className={`w-[186px] h-8 text-white rounded-full flex items-center justify-center ${
            document.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : statusStyles.button
          }`}>
            {document.status === 'completed' ? 'View Document' : 'Upload'}
          </button>
          
          <button className="w-[144px] h-6 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-full ml-[21px] text-xs">
            <HiDownload className="mr-1 text-sm" />
            Download Template
          </button>
        </div>
      </div>
    );
  };

const Documents = () => {
  const [selectedOption, setSelectedOption] = useState('manage'); // Default view

  const renderContent = () => {
    switch (selectedOption) {
      case 'manage':
        return (          <div className="w-full h-full">
            <h2 className="text-xl font-semibold mb-6 sticky top-0 bg-white z-10">Pending Documents</h2>
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6 pb-4">
                  {pendingDocuments.map((document) => (
                    <div key={document.id} className="flex justify-center">
                      <DocumentCard document={document} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

    
        
      case 'autofill':
        return (
          <>
            <h2 className="text-xl font-semibold mb-6">Documents Autofill Assistant</h2>
            <div className="w-[360px] border border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 mb-4">
                Let AI help you fill out your documents automatically
              </p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Start Autofill
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative m-8 h-[945px] border border-gray-200 rounded-[25px] bg-white">
      <h1 className="absolute top-5 left-8 text-2xl font-semibold text-gray-800">
        Document Hub
      </h1>
      <div className="absolute w-full border-t border-gray-200 rounded-[6px] top-[59px]"></div>
      
      {/* Sidebar */}
      <div className="absolute left-0 top-[60px] w-[250px] h-[calc(100%-60px)] border-r border-gray-200 p-4">
        <button 
          className={`w-full py-2 px-4 rounded-md text-left text-gray-800 text-sm ${
            selectedOption === 'manage' ? 'bg-gray-100 hover:bg-gray-200 font-bold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedOption('manage')}
        >
          Manage Your Documents
        </button>
        <button 
          className={`w-full py-2 px-4 mt-2 text-left text-gray-800 text-sm ${
            selectedOption === 'autofill' ? 'bg-gray-100 hover:bg-gray-200 font-bold' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedOption('autofill')}
        >
          Documents Autofill Assistant
        </button>
      </div>
      {/* Main Content */}
      <div className="absolute left-[250px] right-0 top-[60px] bottom-0 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Documents;


