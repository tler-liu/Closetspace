import NavItem from "./components/NavItem";

const SideNav = ({ navItems }) => {
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
        </div>
    );
};

export default SideNav;
