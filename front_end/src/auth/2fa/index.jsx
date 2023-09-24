import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import CodeInput from "../../components/codeInput";
import { verify, deleteUniqueToken } from "../../api/2fa";
import { FiLock } from "react-icons/fi";

const TwoFactorAuth = () => {
  // ==================== State ====================
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const [completed, setCompleted] = useState(false); // State to track code completion
  const [submitted, setSubmitted] = useState(false); // Boolean flag to prevent multiple submissions

  const [code, setCode] = useState(["", "", "", "", "", ""]); // State to track code input values

  const [timer, setTimer] = useState(null); // Timer variable
  const countdownDuration = 240; // Countdown duration in seconds (adjust as needed)
  const [countdown, setCountdown] = useState(countdownDuration);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const uniqueToken = queryParams.get("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ==================== Functions ====================

  console.log(loading);

  // Delete the unique token from the database
  const deleteToken = useCallback(async () => {
    try {
      await deleteUniqueToken({ jwtToken: uniqueToken });
    } catch (err) {
      console.log(err);
    }
  }, [uniqueToken]);

  // Start the timer
  const startTimer = useCallback(() => {
    if (timer === null) {
      setCountdown(countdownDuration);
      setTimer(
        setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000)
      );
    }
  }, [timer]);

  // Clear the timer
  const clearTimer = useCallback(() => {
    // Clear the timer when the code is successfully submitted
    if (timer) {
      clearInterval(timer);
    }
  }, [timer]);

  // Reset the form
  const resetForm = useCallback(() => {
    setCode(["", "", "", "", "", ""]); // Reset the code input values
    reset(); // Reset the React Hook Form state
    try {
      document.getElementById("code0").focus(); // Focus on the first input field
    } catch (err) {
      console.log(err);
    }
  }, [reset]);

  // Submit the form
  const onSubmit = useCallback(async () => {
    const codeString = code.join(""); // Combine individual input values
    setLoading(true);
    try {
      const credentials = {
        code: codeString,
        jwtToken: uniqueToken,
      };
      await verify(credentials);
      clearTimer(); // Clear the timer
      setErrorMessages([]);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessages([err.response.data.code]);
      resetForm();
    } finally {
      setLoading(false);
    }
  }, [code, uniqueToken, resetForm, clearTimer, navigate]);

  // Handle code input change
  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) && index >= 0 && index < 6) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (index < 5 && value !== "") {
        // Focus the next input field if not the last one
        document.getElementById(`code${index + 1}`).focus();
      }
    }
  };

  // Format the remaining time as "mm:ss"
  const formattedCountdown = `${Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`;

  // ==================== Effects ====================

  // Clear error messages after 60 seconds
  useEffect(() => {
    // Set a timeout to clear error messages after 60 seconds (60000 milliseconds)
    const timeoutId = setTimeout(() => {
      setErrorMessages([]);
    }, 60000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  // Start the timer when the component is mounted
  useEffect(() => {
    startTimer(); // Start the timer when the component is mounted
    return () => clearTimer(); // Cleanup: clear the timer when unmounting
  }, [clearTimer, startTimer]);

  // Redirect to the login page when the timer reaches 0
  useEffect(() => {
    if (countdown === 0) {
      try {
        deleteToken();
      } catch (err) {
        console.log(err);
      }
      navigate("/");
      clearTimer();
    }
  }, [countdown, navigate, clearTimer, deleteToken]);

  // Handle backspace key press
  useEffect(() => {
    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && index > 0) {
        e.preventDefault();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        document.getElementById(`code${index - 1}`).focus();
      }
    };

    code.forEach((value, index) => {
      const element = document.getElementById(`code${index}`);
      element.addEventListener("keydown", (e) => handleKeyDown(e, index));

      // Return a cleanup function to remove the event listener when unmounted
      return () => {
        element.removeEventListener("keydown", (e) => handleKeyDown(e, index));
      };
    });
  }, [code]);

  // Check if code is completed
  useEffect(() => {
    // Check if all code fields are filled
    const isCodeCompleted = code.every((value) => /^[0-9]$/.test(value));
    setCompleted(isCodeCompleted);

    if (completed && !submitted) {
      onSubmit(); // Automatically submit the form when code is completed
      setCompleted(false); // Reset the state
      setSubmitted(true); // Set the boolean flag to prevent multiple submissions
    }
  }, [code, onSubmit, completed, submitted]);

  // ==================== Render ====================
  return (
    <div className="two-factor-auth flex">
      <div className="lock-icon flex">
        <FiLock className="flex" />
      </div>
      <div className="two-factor-auth__title flex">
        <h1>Two-Factor Authentication</h1>
        <p>Enter the six-digit code from your authentication app</p>
        <div className="countdown">Time Remaining: {formattedCountdown}</div>
      </div>
      <FormProvider {...{ register, handleSubmit, errors }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group flex">
            {code.map((value, index) => (
              <CodeInput
                key={index}
                name={`code${index}`}
                value={value}
                onChange={(e) => handleCodeChange(e, index)}
                isInvalid={errorMessages.length > 0 ? "is-invalid" : ""}
              />
            ))}
          </div>
        </form>
      </FormProvider>
      <div className="two-factor-auth__error flex">
        {errorMessages.length > 0 ? (
          <div className="login__error flex">
            <p>{errorMessages[0]}</p>
          </div>
        ) : null}
      </div>
      <a href="/" className="cancel" onClick={deleteToken}>
        Cancel
      </a>
    </div>
  );
};

export default TwoFactorAuth;
