// - Import dependecies
import { useFormContext } from "react-hook-form";
import React, { useRef, useEffect } from "react";

// - Import Styles
import "./index.scss";

const CodeInput = ({ name, isInvalid, validationRules, ...rest }) => {
  const { register, isSubmitting } = useFormContext();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.addEventListener("input", handleInput);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("input", handleInput);
      }
    };
  }, []);

  const handleInput = (e) => {
    const input = e.target;
    const value = input.value;

    if (/^[0-9]$/.test(value)) {
      if (input.nextSibling) {
        input.nextSibling.focus();
      }
    } else {
      input.value = "";
    }
  };

  return (
    <div className={`code-input flex ${isInvalid}`}>
      <div className="input-container">
        <input
          ref={inputRef}
          {...register(name, validationRules)}
          type="text"
          name={name}
          id={name}
          disabled={isSubmitting}
          autoComplete="off"
          maxLength={1}
          {...rest}
        />
      </div>
    </div>
  );
};

export default CodeInput;
