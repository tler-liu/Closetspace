const Card = ({ label, path }) => {
    return (
        <div className="card-wrapper">
            <img src={path} alt="no-img" className="card-img" />
            {label}
        </div>
    );
};

export default Card;
