// Import dependencies
import { useState, useEffect, useRef, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

// Import Components
import LabelInput from "../../components/labelinput";
import Button from "../../components/button";

// Import Context
import { UserContext } from "../../context/UserProvider";

// - Import Images
import googleIcon from "../../assets/images/Google_Icons-09-512.webp";

// Import Styles
import "./index.scss";

const validationRules = {
  email: {
    required: "Email is required",
  },
  password: {
    required: "Password is required",
  },
};

const Login = () => {
  // ================== Context ==================

  const { login, loading, error } = useContext(UserContext);

  // ================== States ==================

  // - Error States
  const [errorMessages, setErrorMessages] = useState([]);

  // ================== Variables ==================

  const navigate = useNavigate();

  // ================== Variables ==================

  const formRef = useRef();

  // ================== Functions ==================

  // Function to handle the enter key press
  const handleEnterKeyPress = (event) => {
    // 13 is the enter key code
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  // Function to clear error messages
  const clearErrorMessages = () => {
    setErrorMessages([]);
  };

  // ================== Form ==================

  // - Register form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Function to handle form submission
  const onSubmit = async (data) => {
    const credentials = {
      email: data.email,
      password: data.password,
    };
    const repsonse = await login(credentials);
    if (repsonse) {
      navigate(repsonse);
    }
    reset();
  };

  // ================== Google Login ==================

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  // ================== Effects ==================

  useEffect(() => {
    const timeoutId = setTimeout(clearErrorMessages, 60000);

    // Cleanup the timeout when the component unmounts or if error messages change
    return () => clearTimeout(timeoutId);
  }, [errorMessages]);

  // ================== Render ==================

  return (
    <div className="login flex">
      <div className="login__container flex">
        <div className="login__top flex">
          <div className="login-title flex">
            <h2>Welcome back!</h2>
            <p>Please enter your details to continue</p>
          </div>
          <div className="login__socials flex">
            <div className="google-login flex" onClick={() => googleLogin()}>
              <img src={googleIcon} alt="google" />
            </div>
          </div>
          <div className="login__divider">
            <span>or</span>
          </div>
        </div>

        <FormProvider
          {...{ register, handleSubmit, formState: { errors, isSubmitting } }}
        >
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group flex">
              <LabelInput
                label="Email"
                name="email"
                type="email"
                validationRules={validationRules}
                isInvalid={errors.email || error}
                errors={errors}
              />
              <LabelInput
                label="Password"
                name="password"
                type="password"
                validationRules={validationRules}
                isInvalid={errors.password || error}
                errors={errors}
              />
            </div>
            <div className="login__forgot-password">
              <a href="/change-password">Forgot Password?</a>
            </div>
            <Button
              label={loading ? "Loading..." : "Login"}
              type="submit"
              isSubmitting={isSubmitting}
              onKeyDown={handleEnterKeyPress}
            />
          </form>
        </FormProvider>
        {error ? (
          <div className="login__error flex">
            <p>{error}</p>
          </div>
        ) : null}
      </div>
      {/* {user ? navigate("/dashboard") : null} */}
    </div>
  );
};

export default Login;
