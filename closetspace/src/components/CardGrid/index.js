import Card from "../Card";

const CardGrid = ({ cards }) => {
    return (
        <div className="cardgrid-wrapper">
            {cards.map(({ name, secure_url }) => {
                return <Card key={name} label={name} path={secure_url} />;
            })}
        </div>
    );
};

export default CardGrid;
