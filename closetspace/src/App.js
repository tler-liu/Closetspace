import "./App.scss";
import Card from "./components/Card";
import CardGrid from "./components/CardGrid";
import SideNav from "./components/SideNav";
import { Helmet } from "react-helmet";
import { fetchData } from "./actions/actionHandlers";
import { useEffect, useState } from "react";
import Dropzone from "./components/Dropzone";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { Route, Routes } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firestore";

function App() {
    const [clothingItems, setClothingItems] = useState(null);

    const getClothingItems = async () => {
        const querySnapshot = await getDocs(collection(db, "clothing_items"));

        let newItems = [];
        querySnapshot.forEach((doc) => {
            newItems.push(doc.data());
        });

        setClothingItems(newItems);
    };

    useEffect(() => {
        getClothingItems();
    }, []);

    return (
        <div className="App">
            <SideNav
                navItems={[
                    { label: "All", linkTo: "/" },
                    { label: "Upload", linkTo: "/upload" },
                ]}
            />
            <Routes>
                <Route
                    path="/"
                    element={<Home files={clothingItems || []} />}
                />
                <Route
                    path="/upload"
                    element={<Upload getClothingItems={getClothingItems} />}
                />
            </Routes>
        </div>
    );
}

export default App;
