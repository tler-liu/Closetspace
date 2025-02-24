const Input = ({
    value,
    placeholder,
    size,
    onInputFn,
    onKeyUpFn,
    onFocusOutFn,
    autoFocus = true,
    style,
    name,
    type = "text",
}) => {
    return (
        <input
            onInput={onInputFn}
            placeholder={placeholder}
            value={value}
            className={`input ${size}`}
            onKeyUp={onKeyUpFn}
            autoFocus={autoFocus}
            onBlur={onFocusOutFn}
            style={style}
            spellCheck={false}
            name={name}
            autoComplete="off"
            type={type}
        />
    );
};

export default Input;
