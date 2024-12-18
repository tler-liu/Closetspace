/* eslint-disable react/react-in-jsx-scope */
import { Link } from "react-router-dom";
const NavItem = ({ label, isSelected = false, setValue, linkTo }) => {
    return (
        <Link to={linkTo}>
            <div
                className={
                    "nav-item-container " + (isSelected ? "selected" : "")
                }
                onClick={() => {
                    setValue(label);
                }}
            >
                {/* <Link to={linkTo} /> */}
                {label}
            </div>
        </Link>
    );
};

export default NavItem;
