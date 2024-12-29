const Button = ({ label, size, variant, onClickFn, style, disabled }) => {
    return (
        <button
            className={`button ${size} ${variant}`}
            onClick={onClickFn}
            style={style}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;
