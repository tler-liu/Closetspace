import CardGrid from "../components/CardGrid";

const Home = ({files}) => {
    return <CardGrid cards={files || []}/>
}

export default Home;