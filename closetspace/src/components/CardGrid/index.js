import Card from "../Card";

const CardGrid = ({ cards, linkable = true }) => {
    return (
        <div className="cardgrid-wrapper">
            {cards.map(({ name, secure_url = null, id = null, src = null, brand = "" }) => {
                return (
                    <Card key={secure_url || src} label={name} brand={brand} path={secure_url || src} id={id} linkable={linkable}/>
                );
            })}
        </div>
    );
};

export default CardGrid;
