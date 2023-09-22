// - Import Styles
import "./index.scss";

const Button = ({ label, type, isInvalid, isSubmitting, ...rest }) => {
  return (
    <button
      type={type}
      disabled={isSubmitting}
      className={`primary-btn ${isInvalid}`}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;
