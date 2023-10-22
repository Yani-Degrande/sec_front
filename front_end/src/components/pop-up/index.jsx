// - Import styles
import "./index.scss";

// - Import dependencies
import { useState, useEffect } from "react";
import { FiCheck, FiAlertTriangle, FiInfo } from "react-icons/fi";

const states = {
  success: {
    title: "Success!",
    icon: <FiCheck />,
    color: "rgb(129, 206, 129)",
  },
  error: {
    title: "Error!",
    icon: <FiAlertTriangle />,
    color: "#f0d1d1",
  },
  info: {
    title: "Info!",
    icon: <FiInfo />,
    color: "#7dccdb",
  },
};

const PopUp = ({ children, state, onClose, countDown = 20, showPopup }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      setIsVisible(false); // Hide the popup after the countdown
    }, countDown * 1000);

    setIsVisible(showPopup); // Show the popup when the showPopup prop is true

    return () => {
      clearTimeout(timer);
    };
  }, [countDown, onClose, showPopup]);

  useEffect(() => {
    const interval = 100 / (countDown * 1000);
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => prevProgress - interval);
    }, 1000);

    // Clear the interval when progress reaches 0
    if (progress <= 0) {
      clearInterval(progressInterval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [countDown, progress]);
  return (
    <div className={`popup ${isVisible ? "show" : ""} flex`}>
      <div
        className="popup__icon flex"
        style={{ backgroundColor: states[state].color }}
      >
        {states[state].icon}
      </div>
      <div className="popup__content">
        <div className="popup-header">
          <h2>{states[state].title}</h2>
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">{children}</div>
        <div className="popup-progress">
          <div
            className="progress-bar"
            style={{ width: `${Math.round(progress)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
