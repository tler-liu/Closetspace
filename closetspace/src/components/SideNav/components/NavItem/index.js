import { Link, useResolvedPath, useMatch } from "react-router-dom";
const NavItem = ({ label, linkTo }) => {
    const resolvedPath = useResolvedPath(linkTo);
    const isSelected = useMatch({ path: resolvedPath.pathname, end: true });
    return (
        <Link to={linkTo}>
            <div
                className={
                    "nav-item-container " + (isSelected ? "selected" : "")
                }
            >
                {label}
            </div>
        </Link>
    );
};

export default NavItem;
