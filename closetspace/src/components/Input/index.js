const Input = ({ value, placeholder, size, onInputFn }) => {
    return (
        <input
            onInput={onInputFn}
            type="text"
            placeholder={placeholder}
            value={value}
            className={`input ${size}`}
        />
    );
};

export default Input;
