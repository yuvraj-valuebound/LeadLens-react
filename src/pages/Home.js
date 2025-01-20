// Everything working with static searching from mongo db.

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "../api";
import Loader from "../components/Loader";
import Header from "../components/Header";
import "./FormContainer.css";

function DataCard({ title, data }) {
  // Define the ordered keys for "Unified Lead Details"
  const unifiedLeadKeys = [
    "Name",
    "Title",
    "ProfessionalRole",
    "Industry",
    "Location",
    "Email",
    "PhoneNumber",
    "OtherInformation",
    "RelevantSkills",
    "PastExperiences",
    "SocialMediaProfiles",
    "EndorsementsAndRecommendations",
    "Certifications",
    "EducationalBackground",
  ];

  // Define the ordered keys for "Unified Company Details"
  const unifiedCompanyKeys = [
    "CompanyName",
    "CompanySize",
    "HeadquartersLocation",
    "GlobalPresence",
    "Industry",
    "CampusVisitors",
    "GrowthNews",
    "HiringNews",
    "KeyActivities",
    "NotableAchievements",
    "RecentEvents",
    "JobOpenings",
  ];

  // Helper function to check if a value is not null, undefined, empty string, or empty object/array
  const isValidValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return false;
    }
    return true;
  };

  // Custom rendering for Unified Lead Details
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      // If the value is an array, render each item
      return value.map((item, index) => (
        <div key={index} className="text-sm">
          {typeof item === "object" ? renderValue(item) : item}
        </div>
      ));
    }

    if (typeof value === "object" && value !== null) {
      // Recursively render nested objects
      return (
        <div className="ml-4 text-sm my-3">
          {Object.entries(value).map(([key, subValue]) => (
            <div key={key}>
              <span className="font-semibold text-gray-700">{key}:</span>
              <span className="text-gray-600">
                {typeof subValue === "object"
                  ? renderValue(subValue)
                  : subValue}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // For primitive types (string, number, etc.)
    return value;
  };

  // Custom rendering for Unified Lead Details and Unified Company Details
  const renderUnifiedDetails = () => {
    return (
      <div className="space-y-2">
        {unifiedLeadKeys.map((key) => {
          const value = data[key];
          if (isValidValue(value)) {
            return (
              <div key={key} className="text-sm">
                <span className="font-semibold text-gray-700">{key}:</span>{" "}
                <span className="text-gray-600">{renderValue(value)}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Custom rendering for Unified Company Details
  const renderUnifiedCompanyDetails = () => {
    return (
      <div className="space-y-2">
        {unifiedCompanyKeys.map((key) => {
          const value = data[key];
          if (isValidValue(value)) {
            return (
              <div key={key} className="text-sm">
                <span className="font-semibold text-gray-700">{key}:</span>{" "}
                <span className="text-gray-600">{renderValue(value)}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Custom rendering for Lead Recent Posts (nested cards)
  const renderLeadRecentPosts = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((post, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md"
          >
            <h4 className="text-md font-bold text-gray-800 mb-2">
              Post {index + 1}
            </h4>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Title:</span>{" "}
              <span className="text-gray-600">{post.Title}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Summary:</span>{" "}
              <span className="text-gray-600">{post.Summary}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Platform:</span>{" "}
              <span className="text-gray-600">{post.Platform}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              <span className="text-gray-600">{post.Date}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Metrics:</span>{" "}
              <span className="text-gray-600">
                Comments: {post.Metrics.Comments}, Likes: {post.Metrics.Likes},
                Shares: {post.Metrics.Shares}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Tone:</span>{" "}
              <span className="text-gray-600">{post.Tone}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">URL:</span>{" "}
              <span className="text-gray-600">
                {post.URL ? (
                  <a
                    href={post.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {post.URL}
                  </a>
                ) : (
                  "null"
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Custom rendering for Company Recent Posts (nested cards)
  const renderCompanyRecentPosts = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((post, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md"
          >
            <h4 className="text-md font-bold text-gray-800 mb-2">
              Post {index + 1}
            </h4>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Title:</span>{" "}
              <span className="text-gray-600">{post.Title}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Summary:</span>{" "}
              <span className="text-gray-600">{post.Summary}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Industry:</span>{" "}
              <span className="text-gray-600">{post.Industry}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              <span className="text-gray-600">{post.Date}</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Metrics:</span>{" "}
              <span className="text-gray-600">
                Engagements: {post.Metrics.Engagements}, Shares:{" "}
                {post.Metrics.Shares}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-700">URL:</span>{" "}
              <span className="text-gray-600">
                {post.URL ? (
                  <a
                    href={post.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {post.URL}
                  </a>
                ) : (
                  "null"
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Custom rendering for Recent Projects and Works (nested cards)
  const renderRecentProjects = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((project, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md"
          >
            <h4 className="text-md font-bold text-gray-800 mb-2">
              Project {index + 1}
            </h4>
            {Object.entries(project).map(([key, value]) => {
              if (isValidValue(value)) {
                return (
                  <div key={key} className="text-sm">
                    <span className="font-semibold text-gray-700">{key}:</span>{" "}
                    <span className="text-gray-600">
                      {Array.isArray(value)
                        ? `[${value.join(", ")}]`
                        : typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 mt-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-white-600 mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {title === "Recent Projects and Works"
          ? renderRecentProjects()
          : title === "Lead Recent Posts"
          ? renderLeadRecentPosts()
          : title === "Company Recent Posts"
          ? renderCompanyRecentPosts()
          : title === "Unified Lead Details"
          ? renderUnifiedDetails()
          : title === "Unified Company Details"
          ? renderUnifiedCompanyDetails()
          : Object.entries(data || {})
              .filter(([_, value]) => isValidValue(value)) // Filter out invalid values
              .map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-semibold text-gray-700">{key}:</span>{" "}
                  <span className="text-gray-600">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "object"
                      ? JSON.stringify(value)
                      : value}
                  </span>
                </div>
              ))}
      </div>
    </div>
  );
}

function SocialMediaEngagementCard({ title, data }) {
  // Custom rendering for Company Top Performing Posts
  const renderCompanyTopPerformingPosts = () => {
    const posts = data.SocialMediaEngagement?.CompanyTopPerformingPosts || [];

    return (
      <div>
        <h5 className="text-sm font-semibold text-gray-800 mt-0 mb-2">
          Company Top Performing Posts
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md"
            >
              <h6 className="text-sm font-bold text-gray-800 mb-2">
                Post {index + 1}
              </h6>
              <div className="text-sm">
                <span className="font-semibold text-gray-700">Title:</span>{" "}
                <span className="text-gray-600">{post.Title}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-700">
                  Engagement Metrics:
                </span>{" "}
                <span className="text-gray-600">
                  Comments: {post.EngagementMetrics?.Comments ?? "null"}, Likes:{" "}
                  {post.EngagementMetrics?.Likes ?? "null"}, Shares:{" "}
                  {post.EngagementMetrics?.Shares ?? "null"}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-700">Platform:</span>{" "}
                <span className="text-gray-600">{post.Platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 mt-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-white-600 mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="space-y-2">{renderCompanyTopPerformingPosts()}</div>
    </div>
  );
}

const Home = () => {
  const [leadName, setLeadName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [leadResponse, setLeadResponse] = useState(null);
  const [emailResponse, setEmailResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leadId, setLeadId] = useState("");
  const [data, setData] = useState(null);

  async function getLeadData({ person_name, company_name }) {
    try {
      const response = await axios.get("/leads/search", {
        params: {
          person_name,
          company_name,
        },
      });
      setLeadResponse(response.data);
      setLeadId(response.data._id);
    } catch (error) {
      setError("Failed to fetch lead data");
    }
  }

  const handleLeadSubmit = async () => {
    setLoading(true);
    setError("");
    setLeadResponse(null);
    setEmailResponse(null);
    try {
      // First API call to create the lead
      const response = await axios.post("/leads/create", {
        person_name: leadName,
        company_name: companyName,
      });

      // Extract the lead ID from the response
      const leadId = response.data.lead_id;

      if (!leadId) {
        throw new Error("Lead ID not found in the response.");
      }

      // Update the leadId state
      setLeadId(leadId);

      // Fetch the transformed lead data
      const secondResponse = await axios.get("/leads/search", {
        params: {
          lead_id: leadId, // Pass lead_id as a query parameter
        },
      });

      // Save the final response in leadResponse
      setLeadResponse(secondResponse.data);
    } catch (err) {
      setError("There was some problem scrapping the data, Please try again.");
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
    setError("");
    try {
      const response = await axios.post("/emails/generate", {
        lead_id: leadId,
      });
      setEmailResponse(response.data.email_content);
    } catch (err) {
      setError("Failed to generate email, Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="form-container">
        <h2 className="text-xl font-semibold">Enter Lead Details</h2>
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
        <button
          onClick={() =>
            getLeadData({ person_name: leadName, company_name: companyName })
          }
          className="submit-button"
        >
          Create Lead
        </button>

        {loading && (
          <Loader message="Please wait, it may take 4-5 minutes..." />
        )}

        {error && <p className="error">{error}</p>}

        {/* Data Cards Grid */}
        {leadResponse && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <DataCard
              title="Unified Lead Details"
              data={leadResponse.UnifiedLeadDetails}
            />
            <DataCard
              title="Unified Company Details"
              data={leadResponse.UnifiedCompanyDetails}
            />
          </div>
        )}

        {leadResponse && (
          <div className="">
            <SocialMediaEngagementCard
              title="Social Media Engagement"
              data={leadResponse.UnifiedCompanyDetails}
            />
            <DataCard
              title="Lead Recent Posts"
              data={leadResponse.LeadRecentPosts}
            />
            <DataCard
              title="Company Recent Posts"
              data={leadResponse.CompanyRecentPosts}
            />
            <DataCard
              title="Recent Projects and Works"
              data={leadResponse.RecentProjectsAndWork}
            />
            <DataCard title="Keywords" data={leadResponse.Keywords} />
          </div>
        )}

        {leadResponse && (
          <button onClick={handleEmailGeneration} className="submit-button">
            Generate Email
          </button>
        )}

        {emailResponse && (
          <div
            style={{
              padding: "20px 40px",
              margin: "20px 360px",
              borderRadius: "10px",
              backgroundColor: "#f5f5f5",
              border: "1px solid blue",
            }}
          >
            <h2 className="text-xl font-semibold">Generated Email</h2>
            <ReactMarkdown>{emailResponse}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
