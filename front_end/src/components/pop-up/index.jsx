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

const PopUp = ({ children, state, onClose, countDown = 5, showPopup }) => {
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <div
      className={`popup ${isVisible ? "show" : ""} flex`}
      style={{ borderLeft: `6px solid ${states[state].color}` }}
    >
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
            className={`progress-bar ${showPopup ? "show" : ""}`}
            style={{
              backgroundColor: states[state].color,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
