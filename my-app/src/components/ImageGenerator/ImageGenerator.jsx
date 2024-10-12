import React, { useRef, useState } from "react";
import axios from "axios";
import "./ImageGenerator.css";
import defaultImage from "../assets/default_image.svg";

const ImageGenerator = () => {
  const [image_url, setImage_url] = useState(defaultImage);
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    const prompt = inputRef.current.value;
    if (!prompt) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: prompt,
          model: "dall-e-2",
          n: 1,
          size: "512x512",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`, // Use API key from .env
          },
        }
      );

      const imageUrl = response.data.data[0].url;
      setImage_url(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setLoading(false);
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Ai image <span>generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url} alt="Generated" />
        </div>
        <div className="loading">
          <div
            className={
              loading ? "loading-bar-full" : "loading-bar"
            }
          ></div>
          <div
            className={
              loading ? "loading-text" : "display-none"
            }
          >
            Loading...
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe What You Want To See"
        />
        <div
          className="generate-btn"
          onClick={generateImage}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
