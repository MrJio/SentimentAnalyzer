/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SentimentChart from "./SentimentChart";
import GaugeComponent from "react-gauge-component";
import "./App.css";

const sentimentLevels = [
  { label: "Mostly Negative", min: 0, max: 40, emoji: "😠", color: "#ff4d4f" },
  { label: "Somewhat Negative", min: 40, max: 49, emoji: "😕", color: "#ffa940" },
  { label: "Neutral", min: 49, max: 60, emoji: "😐", color: "#d9d9d9" },
  { label: "Somewhat Positive", min: 60, max: 75, emoji: "🙂", color: "#73d13d" },
  { label: "Mostly Positive", min: 75, max: 100, emoji: "😃", color: "#52c41a" },
];

const getSentimentDisplay = (percentage) => {
  const numericValue = parseFloat(percentage);
  return sentimentLevels.find((level) => numericValue >= level.min && numericValue < level.max);
};

const SecondPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query");

  const [summary, setSummary] = useState("Loading summary...");
  const [sentiment, setSentiment] = useState(null);
  const [socialMediaData, setSocialMediaData] = useState(null);

  const total = socialMediaData?.datasets?.[0]?.data?.reduce((a, b) => a + b, 0) || 0;
  const positive = socialMediaData?.datasets?.[0]?.data?.[0] || 0;
  const negative = socialMediaData?.datasets?.[0]?.data?.[2] || 0;
  const redditSentimentValue = total ? (positive / total) * 100 : 50;
  
  const sentimentDisplay = getSentimentDisplay(redditSentimentValue.toFixed(1));
  const gaugeValue = redditSentimentValue;
  

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/news?query=${searchQuery}`);
        const data = await response.json();
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary("No summary available.");
        }

        if (data.sentiment) {
          setSentiment(data.sentiment);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        setSummary("Failed to load summary");
      }
    };

    const fetchRedditSentiment = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5002/api/reddit?query=${searchQuery}`);
        const data = await response.json();
        if (data.sentiments) {
          setSocialMediaData({
            labels: ["Positive", "Neutral", "Negative"],
            datasets: [
              {
                label: "Reddit Sentiment Count",
                data: [
                  data.sentiments.positive,
                  data.sentiments.neutral,
                  data.sentiments.negative
                ],
                backgroundColor: ["#73d13d", "#d9d9d9", "#ff4d4f"]
              }
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching Reddit sentiment:", error);
      }
    };

    if (searchQuery) {
      fetchSummary();
      fetchRedditSentiment();
    }
  }, [searchQuery]);

  return (
    <div className="secondPageContainer">
      <div className="searchHeader">
        <div className="searchBox2">{searchQuery}</div>
        <button className="backButton" onClick={() => navigate("/")}>←</button>
      </div>

      <div className="contentContainer">
        <div className="summaryBox">
          <h2>Related News on Topic</h2>
          <p className={summary === "Failed to load summary" ? "centered-summary-text" : ""}>
            {summary}
          </p>
        </div>

        <div className="rightSections">
          <div className="socialMediaBox">
            <h2>Reddit Post<br/>(100 post)</h2>
            <SentimentChart data={socialMediaData || { datasets: [{ data: [0, 0, 0] }] }} />
          </div>

          <div className="sentimentSummaryBox">
            <div className="sentimentMeterContent">
              <h2 className="sentimentBoxTitle">Public Sentiment</h2>
              <div className="sentimentMeterWrapper">
                <GaugeComponent
                  type="semicircle"
                  value={gaugeValue}
                  minValue={0}
                  maxValue={100}
                  arc={{
                    width: 0.4,
                    padding: 0.005,
                    cornerRadius: 1,
                    gradient: true,
                    subArcs: [
                      { limit: 10, color: "#F28268" },
                      { limit: 50, color: "#EEEEEE" },
                      { limit: 100, color: "#87EBA8" },
                    ],
                  }}
                  labels={{
                    valueLabel: { hide: true },
                    tickLabels: {
                      type: "outer",
                      ticks: [
                        { value: 0, label: "Negative" },
                        { value: 50, label: "Neutral" },
                        { value: 100, label: "Positive" },
                      ],
                    },
                  }}
                  pointer={{
                    type: "arrow",
                    length: 1.5,
                    width: 10,
                    color: "grey",
                  }}
                  style={{ width: "100%", height: "140px", marginTop: "-10px" }}
                />
                <div style={{ fontSize: "2.5rem", marginTop: "-70px" }}>
                  {sentimentDisplay?.emoji || "😐"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;