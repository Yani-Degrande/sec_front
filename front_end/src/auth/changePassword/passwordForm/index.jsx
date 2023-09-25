// - Import styles
import "./index.scss";
// - Import dependencies
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation } from "react-router-dom";
import zxcvbn from "zxcvbn";

// - Import components
import LabelInput from "../../../components/labelinput";
import Button from "../../../components/button";

// - Import api
import { resetPassword } from "../../../api/users";

const validationRules = {
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  },
  repeatPassword: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  },
};

// - Create ChangePassword component function
const PasswordForm = () => {
  // - Declare a new state variable, which we'll call "email"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    const strength = zxcvbn(password).score;
    setPasswordStrength(strength);
    console.log(strength);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordValue = watch("password");
  const confirmNewPasswordValue = watch("repeatPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    const credentials = {
      password: data.password,
      repeatPassword: data.repeatPassword,
      token: token,
    };
    // - Call the API to send the email
    try {
      const response = await resetPassword(credentials);
      if (response.status === 302) {
        setError(
          "2FA is enabled. Please check your email for a verification code."
        );
        throw new Error(
          "2FA is enabled. Please check your email for a verification code."
        );
      }
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError("Oops! Something went wrong. Please try again.");
    }
    reset();
    setLoading(false);
  };

  // Clear error messages after 60 seconds
  useEffect(() => {
    // Set a timeout to clear error messages after 60 seconds (60000 milliseconds)
    const timeoutId = setTimeout(() => {
      setError(null);
      setSuccess(false);
    }, 60000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="password-form flex">
      <div className="password-form__container flex">
        <div className="password-form__title">
          <h2>Change Password</h2>
        </div>
        <div className="password-form__requirements flex">
          <p>
            For enhanced account security, please consider the following
            password requirements:
          </p>
          <ul>
            <li>
              Your password should be at least <b>8</b> characters long.
            </li>
            <li>
              <b>Avoid</b> using easily guessable information in your password,
              such as your{" "}
              <b>username, email address, first name, or last name</b>.
            </li>
            <li>
              Include a mix of uppercase and lowercase letters, numbers, and
              special characters for added complexity.
            </li>
            <li>
              Do <b>not</b> reuse passwords across multiple accounts to prevent
              security vulnerabilities.
            </li>
            <li>
              Change your password periodically to reduce the risk of
              unauthorized access.
            </li>
          </ul>
          <p>
            For more information, please visit our <a href="/help">help page</a>
            .
          </p>
        </div>
        <FormProvider {...{ register, handleSubmit, errors }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group flex">
              <LabelInput
                label="Password"
                name="password"
                type="password"
                validationRules={validationRules}
                isInvalid={errors.password}
                onChange={handlePasswordChange}
              />
              <LabelInput
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                validationRules={validationRules}
                isInvalid={errors.password}
              />
            </div>
            {passwordStrength !== null && (
              <div className="progress-bar-container">
                <div className="password-strength-indicator">
                  <div className="strength-label">
                    {passwordStrength === 0 && "Very Weak"}
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Moderate"}
                    {passwordStrength === 3 && "Strong"}
                    {passwordStrength === 4 && "Very Strong"}
                  </div>
                  <div
                    className={`progress-bar strength-${passwordStrength}`}
                    style={{ width: `${(passwordStrength + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            )}
            <Button
              label={loading ? "Loading..." : "Change Password"}
              type="submit"
              isInvalid={errors.length > 0}
              isSubmitting={isSubmitting}
            />
            {passwordValue !== confirmNewPasswordValue && (
              <div className="password-form__error flex">
                <p>Passwords do not match</p>
              </div>
            )}
            {error && (
              <div className="password-form__error flex">
                <p>{error}</p>
              </div>
            )}
            <a href="/" className="cancel">
              Cancel
            </a>
          </form>
        </FormProvider>

        {success && (
          <div className="password-form__success">
            <p>
              You successfully changed your password. You can now close this
              window and log in with your new password.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// - Export ChangePassword component function
export default PasswordForm;
