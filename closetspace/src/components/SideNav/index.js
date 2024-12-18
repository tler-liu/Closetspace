/* eslint-disable react/react-in-jsx-scope */
import NavItem from "./components/NavItem";
import { useState } from "react";

const SideNav = ({ navItems }) => {
    const [value, setValue] = useState("All");
    return (
        <div className="sidenav-wrapper">
            <h1 className="logo">Closetspace</h1>
            {navItems.map((item) => {
                return (
                    <NavItem
                        key={item.label}
                        label={item.label}
                        isSelected={value === item.label}
                        setValue={setValue}
                        linkTo={item.linkTo}
                    />
                );
            })}
        </div>
    );
};

export default SideNav;
