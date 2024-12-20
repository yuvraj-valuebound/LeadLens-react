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
      const leadId = response.data.lead_id;

      if (!leadId) {
        throw new Error('Lead ID not found in the response.');
      }

      // Update the leadId state
      setLeadId(leadId);

      // Fetch the transformed lead data
      const secondResponse = await axios.get('/leads/search', {
        params: {
          lead_id: leadId, // Pass lead_id as a query parameter
        },
      });

      // Save the final response in leadResponse
      setLeadResponse(secondResponse.data);

    } catch (err) {
      setError('There was some problem scrapping the data, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailGeneration = async () => {
    if (!leadId) {
      setError("Please create a lead first.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/emails/generate', {
        lead_id: leadId,
      });
      setEmailResponse(response.data.email_content);
    } catch (err) {
      setError('Failed to generate email, Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatLeadData = (data) => {
    const sections = {
      "Unified Lead Details": data.UnifiedLeadDetails,
      "Unified Company Details": data.UnifiedCompanyDetails,
      "Lead Recent Posts": data.LeadRecentPosts,
      "Company Recent Posts": data.CompanyRecentPosts,
      "Recent Projects and Works": data.RecentProjectsAndWork,
      "Keywords": data.Keywords,
    };

    return Object.entries(sections)
      .filter(([_, content]) => content) // Exclude null or undefined content
      .map(([title, content]) => {
        const formattedContent = Object.entries(content)
          .filter(([_, value]) => value !== null && value !== undefined) // Exclude null values
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `<p><strong>${key}:</strong> ${value
                .map((item) => (typeof item === 'object' ? JSON.stringify(item, null, 2) : item))
                .join(', ')}</p>`;
            }
            if (typeof value === 'object') {
              return `<p><strong>${key}:</strong> ${JSON.stringify(value, null, 2)}</p>`;
            }
            return `<p><strong>${key}:</strong> ${value}</p>`;
          })
          .join('');


        return `
          <div>
            <h3 style="color: green;">${title}:</h3>
            ${formattedContent}
          </div>
        `;
      })
      .join("");
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
          Create Lead
        </button>

        {loading && <Loader message="Please wait, it may take 4-5 minutes..." />}

        {error && <p className="error">{error}</p>}

        {leadResponse && (
          <div>
            <h2>Lead Details</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: formatLeadData(leadResponse),
              }}
            ></div>
          </div>
        )}

        {leadResponse && (
          <button onClick={handleEmailGeneration} className="submit-button">
            Generate Email
          </button>
        )}

        {emailResponse && (
          <div>
            <h2>Generated Email</h2>
            <ReactMarkdown>{emailResponse}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
