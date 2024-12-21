import "./App.scss";
import SideNav from "./components/SideNav";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { Route, Routes } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firestore";
import Item from "./pages/Item";
import Recommender from "./pages/Recommender";
import { sideNavItems } from "./config/sideNav";

function App() {
    const [clothingItems, setClothingItems] = useState(null);

    const getClothingItems = async () => {
        try {
            const querySnapshot = await getDocs(
                collection(db, process.env.REACT_APP_COLLECTION_NAME)
            );

            let newItems = [];
            querySnapshot.forEach((doc) => {
                newItems.push({ ...doc.data(), id: doc.id });
            });

            setClothingItems(newItems);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getClothingItems();
    }, []);

    return (
        <div className="App">
            <SideNav navItems={sideNavItems} />
            <Routes>
                <Route
                    path="/"
                    element={<Home files={clothingItems || []} />}
                />
                <Route path="/explore" element={<Recommender />} />
                <Route
                    path="/upload"
                    element={<Upload getClothingItems={getClothingItems} />}
                />
                <Route
                    path="/item/:id"
                    element={
                        <Item
                            clothingItems={clothingItems}
                            getClothingItems={getClothingItems}
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
