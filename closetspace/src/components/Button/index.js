const Button = ({ label, size, variant, onClickFn, style }) => {
    return (
        <button
            className={`button ${size} ${variant}`}
            onClick={onClickFn}
            style={style}
        >
            {label}
        </button>
    );
};

export default Button;
