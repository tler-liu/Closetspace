const Input = ({
    value,
    placeholder,
    size,
    onInputFn,
    onKeyUpFn,
    onFocusOutFn,
    autoFocus = true,
    style,
}) => {
    return (
        <input
            onInput={onInputFn}
            type="text"
            placeholder={placeholder}
            value={value}
            className={`input ${size}`}
            onKeyUp={onKeyUpFn}
            autoFocus={autoFocus}
            onBlur={onFocusOutFn}
            style={style}
        />
    );
};

export default Input;
