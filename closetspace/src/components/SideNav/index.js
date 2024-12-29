import NavItem from "./components/NavItem";
import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SideNav = ({ navItems }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {}
    }
    return (
        <div className="sidenav-wrapper">
            <h1 className="logo">Closetspace</h1>
            {navItems.map((item) => {
                return (
                    <NavItem
                        key={item.label}
                        label={item.label}
                        linkTo={item.linkTo}
                    />
                );
            })}
            <Button label="Log out" variant="destroy" size="medium" onClickFn={handleLogout} style={{"marginTop": "auto"}}/>
        </div>
    );
};

export default SideNav;
