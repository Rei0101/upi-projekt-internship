import PropTypes from "prop-types";

export default function Button({ type, className, onClick, text }) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};
