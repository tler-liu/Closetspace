import Card from "../Card"

const CardGrid = ({cards}) => {
    console.log(cards)
    return (<div className="cardgrid-wrapper">
        {cards.map(({label, path}) => {
            return <Card key={label} label={label} path={path}/>
        })}
    </div>)
}

export default CardGrid;