// - Import dependencies
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// - Import components
import LabelInput from "../../../components/labelinput";
import Button from "../../../components/button";
import PopUp from "../../../components/pop-up";

// - Import API
import { forgotPassword } from "../../../api/users";

// - Import styles
import "./index.scss";

// - Create EmailForm component
const EmailForm = () => {
  // - Declare a new state variable, which we'll call "email"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    // - Call the API to send the email
    try {
      const response = await forgotPassword({ email: data.email });
      if (response.redirectToVerification) {
        navigate(`/auth/change-password/verify?token=${response.uniqueToken}`, {
          state: { email: data.email },
        });
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
    <div className="email-form flex">
      <div className="email-form__container flex">
        <div className="email-form__icon flex">?</div>
        <div className="email-form__title flex">
          <h1>Forgot your password?</h1>
          <p>
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
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
            </div>
            <Button
              label={
                loading ? "Loading..." : success ? "Resend email" : "Send email"
              }
              type="submit"
              isInvalid={errors.length > 0}
              isSubmitting={isSubmitting}
            />
            <a href="/" className="cancel">
              Cancel
            </a>
          </form>
        </FormProvider>
        {error && (
          <div className="email-form__error flex">
            <p>{error}</p>
          </div>
        )}

        <PopUp
          state="success"
          showPopup={success}
          onClose={() => setSuccess(false)}
        >
          <p>
            An email has been sent with a password reset link. Please check your
            inbox to reset your password.
          </p>
        </PopUp>
      </div>
    </div>
  );
};

export default EmailForm;
