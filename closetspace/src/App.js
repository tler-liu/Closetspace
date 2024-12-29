import "./App.scss";
import SideNav from "./components/SideNav";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { Route, Routes } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/firestore";
import Item from "./pages/Item";
import Recommender from "./pages/Recommender";
import { sideNavItems } from "./config/sideNav";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./contexts/AuthContext";

function App() {
    const [clothingItems, setClothingItems] = useState(null);
    const { currentUser } = useAuth();

    const getClothingItems = async () => {
        if (!currentUser) {
            return;
        }

        try {
            const q = query(
                collection(db, process.env.REACT_APP_COLLECTION_NAME),
                where("uid", "==", currentUser.uid)
            );
            const querySnapshot = await getDocs(q);

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
    }, [currentUser]);

    return (
        <div className="App">
            <SideNav navItems={sideNavItems} />
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home files={clothingItems || []} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/explore"
                    element={
                        <PrivateRoute>
                            <Recommender />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <PrivateRoute>
                            <Upload getClothingItems={getClothingItems} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/item/:id"
                    element={
                        <PrivateRoute>
                            <Item
                                clothingItems={clothingItems}
                                getClothingItems={getClothingItems}
                            />
                        </PrivateRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
