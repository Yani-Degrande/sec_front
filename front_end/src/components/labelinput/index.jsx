// - Import dependencies
import { useState } from "react";
import { useFormContext } from "react-hook-form";

// - Import Styles
import "./index.scss";

// - Import Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

const LabelInput = ({
  label,
  name,
  type,
  isInvalid,
  validationRules,
  onChange,
  errors,
  ...rest
}) => {
  const { register, isSubmitting } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`label-input flex ${isInvalid ? "invalid" : null}`}>
      <label htmlFor={name}>{label}</label>
      <div className="input-container">
        <input
          {...register(name, validationRules[name])}
          type={showPassword ? "text" : type}
          name={name}
          id={name}
          disabled={isSubmitting}
          autoComplete="off"
          onChange={onChange}
          {...rest}
        />
        {type === "password" && (
          <div className="password-toggle" onClick={handlePasswordToggle}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        )}
        {errors
          ? errors[name] && (
              <div
                className={`input__error flex ${
                  type === "password" ? "pwd" : null
                }`}
              >
                <p>{errors[name].message}</p>
              </div>
            )
          : null}
      </div>
    </div>
  );
};

export default LabelInput;
