import { Link } from "react-router-dom";

const Card = ({ label, path, id }) => {
    return (
        <Link to={`/item/${id}`}>
            <div className="card-wrapper">
                <img src={path} alt="no-img" className="card-img" />
                {label}
            </div>
        </Link>
    );
};

export default Card;
