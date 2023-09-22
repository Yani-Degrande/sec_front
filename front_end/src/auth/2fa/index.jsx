import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import CodeInput from "../../components/codeInput";
import { verify, deleteUniqueToken } from "../../api/2fa";
import { FiLock } from "react-icons/fi";

const TwoFactorAuth = () => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [completed, setCompleted] = useState(false); // State to track code completion

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const uniqueToken = queryParams.get("token");

  const deleteToken = useCallback(async () => {
    try {
      await deleteUniqueToken({ jwtToken: uniqueToken });
    } catch (err) {
      console.log(err);
    }
  }, [uniqueToken]);

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const [timer, setTimer] = useState(null); // Timer variable
  const countdownDuration = 120; // Countdown duration in seconds (adjust as needed)
  const [countdown, setCountdown] = useState(countdownDuration);

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

  const clearTimer = useCallback(() => {
    // Clear the timer when the code is successfully submitted
    if (timer) {
      clearInterval(timer);
    }
  }, [timer]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const resetForm = useCallback(() => {
    setCode(["", "", "", "", "", ""]); // Reset the code input values
    reset(); // Reset the React Hook Form state
    document.getElementById("code0").focus(); // Focus on the first input field
  }, [reset]);

  const onSubmit = useCallback(async () => {
    const codeString = code.join(""); // Combine individual input values
    setLoading(true);
    try {
      const credentials = {
        code: codeString,
        jwtToken: uniqueToken,
      };
      const response = await verify(credentials);
      setData(response);
      resetForm(); // Reset the form upon successful submission
      clearTimer(); // Clear the timer
      setErrorMessages([]);
    } catch (err) {
      setErrorMessages([err.response.data.code]);
    } finally {
      setLoading(false);
      resetForm();
    }
  }, [code, uniqueToken, resetForm, clearTimer]);

  useEffect(() => {
    // Set a timeout to clear error messages after 60 seconds (60000 milliseconds)
    const timeoutId = setTimeout(() => {
      setErrorMessages([]);
    }, 60000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    startTimer(); // Start the timer when the component is mounted
    return () => clearTimer(); // Cleanup: clear the timer when unmounting
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      deleteToken();
      navigate("/");
      clearTimer();
    }
  }, [countdown, navigate, clearTimer, deleteToken]);

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

  useEffect(() => {
    // Check if all code fields are filled
    const isCodeCompleted = code.every((value) => /^[0-9]$/.test(value));
    setCompleted(isCodeCompleted);

    if (completed) {
      onSubmit(); // Automatically submit the form when code is completed
      setCompleted(false); // Reset the state
    }
  }, [code, onSubmit, completed]);

  // Format the remaining time as "mm:ss"
  const formattedCountdown = `${Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`;

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
      {data ? (
        <div>
          <p>{data.refreshToken}</p>
          <p>{data.accesToken}</p>
        </div>
      ) : null}
    </div>
  );
};

export default TwoFactorAuth;
