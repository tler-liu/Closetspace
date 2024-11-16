

const NavItem = ({label, isSelected = false, setValue}) => {
    return <div className={'nav-item-container ' + (isSelected ? 'selected' : '')}
        onClick={() => {
            setValue(label)
        }}
    >{label}</div>
}

export default NavItem;