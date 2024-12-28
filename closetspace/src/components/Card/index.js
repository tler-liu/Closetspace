import { Link } from "react-router-dom";

const Card = ({ label, path, id, linkable = true, brand }) => {
    if (linkable) {
        return (
            <Link to={`/item/${id}`}>
                <div className="card-wrapper">
                    <img src={path} alt="no-img" className="card-img" />
                    <h3>{brand}</h3>
                    <p>{label}</p>
                </div>
            </Link>
        );
    } else {
        return (
            <div className="card-wrapper">
                <img src={path} alt="no-img" className="card-img" />
                <h3>{brand}</h3>
                <p>{label}</p>
            </div>
        );
    }
};

export default Card;
