import PropTypes from 'prop-types';

export default function Input({type, id, value, change}) {
    return (
        <input
            type={type}
            id={id}
            value={value}
            onChange={change}
            required
          />
    );
}

Input.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    change: PropTypes.func,
}