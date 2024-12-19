import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from '../api';
import Loader from '../components/Loader';
import Header from '../components/Header';
import './FormContainer.css';

const Home = () => {
  const [leadName, setLeadName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [leadResponse, setLeadResponse] = useState(null);
  const [emailResponse, setEmailResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const leadId = "";
  const [leadId, setLeadId] = useState('');

  const handleLeadSubmit = async () => {
    setLoading(true);
    setError('');
    setLeadResponse(null);
    setEmailResponse(null);
    try {
      // First API call to create the lead
      const response = await axios.post('/leads/create', {
        person_name: leadName,
        company_name: companyName,
      });

      // Extract the lead ID from the response
      // leadId = response.data.lead_id;
      const leadId = response.data.lead_id;
      console.log("lead id first response : ",leadId)

      if (!leadId) {
        throw new Error('Lead ID not found in the response.');
      }

      // Update the leadId state
      setLeadId(leadId);

      // Second API call with the lead ID
      const secondResponse = await axios.get('/leads/search', {
        params: {
          lead_id: leadId, // Pass lead_id as a query parameter
        },
      });

      console.log("lead id second response: ",leadId)

      // Save the final response in leadResponse
      setLeadResponse(secondResponse.data);
    } catch (err) {
      setError('There was some problem scrapping the data, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailGeneration = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Using lead ID for email generation:', leadId);
      const response = await axios.post('/emails/generate', {
        lead_id: leadId,
      });
      setEmailResponse(response.data);
    } catch (err) {
      setError('Failed to generate email, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="form-container">
        <h2>Enter Lead Details</h2>
        <input
          type="text"
          placeholder="Lead's Name"
          value={leadName}
          onChange={(e) => setLeadName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLeadSubmit} className="submit-button">
          Get data for lead
        </button>

        {loading && <Loader message="Please wait, it may take 4-5 minutes..." />}

        {/* {error && <p className="error">{error}</p>} */}

        {leadResponse && (
          <div className="markdown-container">
            <ReactMarkdown>{JSON.stringify(leadResponse, null, 2)}</ReactMarkdown>
          </div>
        )}

        {leadResponse && (
          <button onClick={handleEmailGeneration} className="submit-button">
            Generate Email
          </button>
        )}

        {emailResponse && (
          <div className="markdown-container">
            <ReactMarkdown>{JSON.stringify(emailResponse, null, 2)}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
