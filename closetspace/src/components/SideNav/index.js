import NavItem from "./components/NavItem";
import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SideNav = ({ navItems }) => {
    const { logout, currentUser } = useAuth();
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
            <div className="profile">
                <div className="user">{currentUser ? currentUser.email : ""}</div>
                <Button
                    label="Log out"
                    variant="create"
                    size="medium"
                    onClickFn={handleLogout}
                    style={{ width: "100%" }}
                />
            </div>
        </div>
    );
};

export default SideNav;
