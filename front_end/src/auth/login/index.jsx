// Import dependencies
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// Import Styles
import "./index.scss";

// Import Components
import LabelInput from "../../components/labelinput";
import Button from "../../components/button";

// Import Services
import { login } from "../../api/users";

// - Import Images
import googleIcon from "../../assets/images/Google_Icons-09-512.webp";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  // Use a state variable to track whether an error is currently displayed
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

  // Function to clear error messages
  const clearErrorMessages = () => {
    setErrorMessages([]);
    setIsErrorDisplayed(false);
  };

  useEffect(() => {
    // Set a timeout to clear error messages after 60 seconds (60000 milliseconds)
    const timeoutId = setTimeout(clearErrorMessages, 60000);

    // Cleanup the timeout when the component unmounts or if error messages change
    return () => clearTimeout(timeoutId);
  }, [errorMessages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const credentials = {
        email: data.email,
        password: data.password,
      };
      const response = await login(credentials);
      if (response.status === 302) {
        const uniqueToken = response.uniqueToken;

        navigate(`/2fa?token=${uniqueToken}`);
      }
      setData(response);
      reset();
      clearErrorMessages(); // Clear error messages upon successful submission
    } catch (err) {
      setIsErrorDisplayed(true); // Set the flag to indicate that an error is displayed
      setErrorMessages(err.response.data.code);
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <div className="login flex">
      <div className="login__container flex">
        <div className="login__top flex">
          <div className="login-title flex">
            <h2>Welcome back!</h2>
            <p>Please enter your details to continue</p>
          </div>
          <div className="login__socials flex">
            <div className="google-login flex">
              <img src={googleIcon} alt="google" />
            </div>
          </div>
          <div className="login__divider">
            <span>or</span>
          </div>
        </div>

        <FormProvider {...{ register, handleSubmit, errors }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group flex">
              <LabelInput
                label="Email"
                name="email"
                type="email"
                validationRules={{
                  required: "Email is required",
                }}
                isInvalid={errors.email}
              />
              <LabelInput
                label="Password"
                name="password"
                type="password"
                validationRules={{
                  required: "Password is required",
                }}
                isInvalid={errors.password}
              />
            </div>
            <div className="login__forgot-password">
              <a href="/change-password">Forgot Password?</a>
            </div>
            <Button
              label={loading ? "Loading..." : "Login"}
              type="submit"
              isInvalid={errors.length > 0}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
        {isErrorDisplayed ? (
          <div className="login__error flex">
            <p>{errorMessages}</p>
          </div>
        ) : null}
      </div>
      {data ? (
        <div>
          <p>{data.refreshToken}</p>
          <p>{data.accesToken}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Login;
