
//third response
import { useState, useEffect, useContext } from "react";
import "./Dashboard_Styles/Assessment3.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineSend } from "react-icons/md";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

function Assessment3() {
  const [responses, setResponses] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  // Enhanced token retrieval function
  const getTokenValue = () => {
    try {
      // First try from context
      if (typeof authToken === "object" && authToken?.token) {
        return authToken.token;
      }
      if (typeof authToken === "string" && authToken) {
        return authToken;
      }

      // Then try from localStorage
      const tokenFromStorage = localStorage.getItem('userToken');
      if (!tokenFromStorage) {
        return null;
      }
      
      // Try to parse as JSON first
      try {
        const parsedToken = JSON.parse(tokenFromStorage);
        return parsedToken.token || tokenFromStorage;
      } catch (parseError) {
        // If parsing fails, treat as plain string token
        return tokenFromStorage;
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Fetch questions with better error handling
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tokenValue = getTokenValue();
        if (!tokenValue) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await axios.get(
          http://localhost:5000/api/questions/personality,
          {
            headers: {
              Authorization: Bearer ${tokenValue}
            },
            timeout: 10000 // 10 second timeout
          }
        );
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response format from server.");
        }
        
        setQuestions(response.data);
        
        // Check if we have saved responses in localStorage
        try {
          const savedResponses = localStorage.getItem('personalityResponses');
          if (savedResponses) {
            const parsed = JSON.parse(savedResponses);
            setResponses(parsed);
          }
        } catch (storageError) {
          console.warn("Failed to load saved responses:", storageError);
          // Clear corrupted data
          localStorage.removeItem('personalityResponses');
        }
        
      } catch (err) {
        console.error("Error fetching questions:", err);
        
        let errorMessage = "Failed to load assessment questions.";
        
        if (err.code === 'ECONNABORTED') {
          errorMessage = "Request timed out. Please check your internet connection.";
        } else if (err.response?.status === 401) {
          errorMessage = "Your session has expired. Please log in again.";
          // Redirect to login or clear auth data
          localStorage.removeItem('userToken');
        } else if (err.response?.status === 403) {
          errorMessage = "You don't have permission to access this assessment.";
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [authToken]);

  // Update progress when responses change
  useEffect(() => {
    if (questions.length > 0) {
      const answeredCount = Object.keys(responses).length;
      const progressPercent = Math.floor((answeredCount / questions.length) * 100);
      setProgress(progressPercent);
      
      // Auto-save responses to localStorage
      try {
        localStorage.setItem('personalityResponses', JSON.stringify(responses));
      } catch (storageError) {
        console.warn("Failed to save responses to localStorage:", storageError);
      }
    }
  }, [responses, questions]);

  // Calculate pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  // Navigation functions with error handling
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  // Enhanced handleChange with validation
  const handleChange = (questionId, option, type) => {
    if (!questionId || !option) {
      console.warn("Invalid question ID or option");
      return;
    }

    setResponses((prevResponses) => {
      if (type === "checkbox") {
        const selectedOptions = prevResponses[questionId] || [];
        return {
          ...prevResponses,
          [questionId]: selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option]
        };
      } else {
        return { ...prevResponses, [questionId]: option };
      }
    });
  };

  // Enhanced AI recommendations function
  const getAIRecommendations = async (careerTestResponses, skillsResponses, personalityResponses) => {
    try {
      const responseAI = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Based on the following assessments, provide structured career advice in JSON format with categories (Career Interest, Skills and Competency, Personality and Work Style):

Career Interest Test:
${JSON.stringify(careerTestResponses)}

Skills and Competency Assessment:
${JSON.stringify(skillsResponses)}

Personality and Work Style:
${JSON.stringify(personalityResponses)}

IMPORTANT: Return only valid JSON without any markdown formatting, code blocks, or additional text. Format your response as a JSON object with a 'recommendations' array. Each item in the array should contain:
- careerTitle
- matchPercentage
- description
- educationPath
- averageSalary (as a salary range in USD, e.g., "$70,000 - $90,000")
- skills

Example format:
{"recommendations": [{"careerTitle": "Software Engineer", "matchPercentage": "85%", "description": "...", "educationPath": "...", "averageSalary": "$70,000 - $90,000", "skills": ["Programming", "Problem Solving"]}]}`,
            },
          ],
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "My OpenRouter App",
          },
          timeout: 30000 // 30 second timeout for AI requests
        }
      );

      console.log("AI response:", responseAI.data);

      // Enhanced AI response parsing
      let aiRecommendations = [];
      try {
        const aiContent = responseAI.data.choices?.[0]?.message?.content;
        if (!aiContent) {
          throw new Error("No content in AI response");
        }
        
        // Clean the AI response by removing markdown code blocks
        let cleanedContent = aiContent.trim();
        
        // Remove markdown code blocks if present
        if (cleanedContent.startsWith('json') || cleanedContent.startsWith('')) {
          // Find the first occurrence of  and remove everything before the JSON
          const jsonStart = cleanedContent.indexOf('{');
          const jsonEnd = cleanedContent.lastIndexOf('}') + 1;
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleanedContent = cleanedContent.substring(jsonStart, jsonEnd);
          } else {
            // Try to extract content between code blocks
            const codeBlockRegex = /(?:json)?\s*([\s\S]*?)\s*```/;
            const match = cleanedContent.match(codeBlockRegex);
            if (match && match[1]) {
              cleanedContent = match[1].trim();
            }
          }
        }
        
        const parsedAI = JSON.parse(cleanedContent);
        aiRecommendations = parsedAI.recommendations || [];
        
        // Validate recommendations structure
        if (!Array.isArray(aiRecommendations)) {
          throw new Error("AI response doesn't contain valid recommendations array");
        }
        
      } catch (parseError) {
        console.warn("Failed to parse AI response as JSON:", parseError);
        // Create fallback recommendation from text
        const aiContent = responseAI.data.choices?.[0]?.message?.content || "No response available";
        aiRecommendations = [
          {
            careerTitle: "General Career Advice",
            matchPercentage: "N/A",
            description: aiContent.substring(0, 500) + (aiContent.length > 500 ? "..." : ""),
            educationPath: "See description for details",
            averageSalary: "Varies",
            skills: [],
          },
        ];
      }

      return aiRecommendations;
    } catch (error) {
      console.error("AI API Error:", error.response?.data || error.message);
      
      // Return appropriate fallback based on error type
      let errorMessage = "Unable to get AI recommendations at this time.";
      if (error.code === 'ECONNABORTED') {
        errorMessage = "AI request timed out. Using default recommendations.";
      } else if (error.response?.status === 401) {
        errorMessage = "AI service authentication failed.";
      } else if (error.response?.status === 429) {
        errorMessage = "AI service rate limit exceeded. Please try again later.";
      }

      return [
        {
          careerTitle: "AI Service Unavailable",
          matchPercentage: "N/A",
          description: errorMessage + " Please try again later or contact support if the problem persists.",
          educationPath: "N/A",
          averageSalary: "N/A",
          skills: [],
        },
      ];
    }
  };

  // Enhanced submit handler
  const handleSubmit = async () => {
    try {
      // Validate all questions are answered
      if (Object.keys(responses).length < questions.length) {
        const unansweredCount = questions.length - Object.keys(responses).length;
        const confirmMessage = You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Do you want to proceed anyway?;
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }

      // Get and validate auth token
      const tokenValue = getTokenValue();
      if (!tokenValue) {
        alert("Authentication required. Please log in again.");
        navigate('/login'); // Adjust path as needed
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Get all responses from localStorage with error handling
      let careerTestResponses = {};
      let skillsResponses = {};
      
      try {
        careerTestResponses = JSON.parse(localStorage.getItem("careerTestResponses") || "{}");
        skillsResponses = JSON.parse(localStorage.getItem("skillsResponses") || "{}");
      } catch (parseError) {
        console.warn("Failed to parse stored responses:", parseError);
        // Continue with empty objects
      }

      // Prepare data for API
      const assessmentData = {
        careerTest: careerTestResponses,
        skillsAssessment: skillsResponses,
        personalityAssessment: responses,
      };

      // Submit to backend API with timeout
      const response = await axios.post(
        "http://localhost:5000/api/assessments",
        assessmentData,
        {
          headers: {
            Authorization: Bearer ${tokenValue},
          },
          timeout: 15000 // 15 second timeout
        }
      );

      if (!response.data?._id) {
        throw new Error("Invalid response from server - missing assessment ID");
      }

      // Get career recommendations from backend
      const recommendResponse = await axios.post(
        "http://localhost:5000/api/careers/recommend",
        { assessmentId: response.data._id },
        {
          headers: {
            Authorization: Bearer ${tokenValue},
          },
          timeout: 15000
        }
      );

      // Get AI recommendations (non-blocking)
      let aiRecommendations = [];
      try {
        aiRecommendations = await getAIRecommendations(
          careerTestResponses,
          skillsResponses,
          responses
        );
      } catch (aiError) {
        console.warn("AI recommendations failed:", aiError);
        // Continue without AI recommendations
      }

      // Store all recommendations in localStorage
      try {
        localStorage.setItem("careerRecommendations", JSON.stringify(recommendResponse.data));
        localStorage.setItem("AIRecommendations", JSON.stringify(aiRecommendations));
        
        // Clear assessment responses from localStorage
        localStorage.removeItem("careerTestResponses");
        localStorage.removeItem("skillsResponses");
        localStorage.removeItem("personalityResponses");
      } catch (storageError) {
        console.warn("Failed to save results to localStorage:", storageError);
        // Continue to navigate anyway
      }

      // Navigate to results page
      navigate("/dashboard/Assessment2/assessment3/results/");
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      let errorMessage = "There was an error submitting your assessment.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please check your internet connection and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        localStorage.removeItem('userToken');
        navigate('/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to submit this assessment.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <p>Loading assessment questions...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // No questions state
  if (questions.length === 0) {
    return (
      <div className="assessment-container">
        <h1>Personality Assessment</h1>
        <div className="no-questions-message">
          <p>No questions available for this category.</p>
          <p>Please contact an administrator to set up questions for this assessment.</p>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="career-test-container1">
      <h2 className="title">Personality & Work Style Assessment</h2>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: ${progress}% }}></div>
        </div>
        <div className="progress-text">{progress}% Complete</div>
      </div>
      
      <div className="pagination-info">
        Page {currentPage} of {totalPages} | Questions {indexOfFirstQuestion + 1}-{Math.min(indexOfLastQuestion, questions.length)} of {questions.length}
      </div>

      <form className="career-test-form">
        {currentQuestions.map((q, index) => (
          <div key={q._id || index} className="question-block">
            <p className="question1">
              <strong>{q.question}</strong>
            </p>
            <div className="options-container">
              {q.options?.map((option, optIndex) => (
                <label key={optIndex} className={`option-label ${
                  q.type === "radio" 
                    ? responses[q._id] === option ? 'selected' : ''
                    : (responses[q._id] || []).includes(option) ? 'selected' : ''
                }`}>
                  <input
                    type={q.type}
                    name={question-${q._id || index}}
                    value={option}
                    checked={q.type === "radio" ? responses[q._id] === option : (responses[q._id] || []).includes(option)}
                    onChange={() => handleChange(q._id, option, q.type)}
                  />
                  {option}
                </label>
              )) || <p>No options available for this question.</p>}
            </div>
          </div>
        ))}

        <div className="navigation-buttons">
          {currentPage > 1 && (
            <button 
              type="button" 
              className="btnDash1" 
              onClick={goToPreviousPage}
              disabled={isSubmitting}
            >
              <TbPlayerTrackPrev /> Previous
            </button>
          )}
          
          {currentPage < totalPages ? (
            <button 
              type="button" 
              className="btnDash1" 
              onClick={goToNextPage}
              disabled={isSubmitting}
            >
              Next <TbPlayerTrackNext />
            </button>
          ) : (
            <button
              type="button"
              className="btnDash1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"} {!isSubmitting && <MdOutlineSend />}
            </button>
          )}
        </div>
        
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              type="button"
              className={page-button ${currentPage === i + 1 ? 'active' : ''}}
              onClick={() => paginate(i + 1)}
              disabled={isSubmitting}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

export default Assessment3;