/* eslint-disable react/react-in-jsx-scope */
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

function App() {
    const [files, setFiles] = useState(null);
    useEffect(() => {
        const initializeData = async () => {
            fetchData(setFiles);
        };
        initializeData();
    }, []);

    return (
        <div className="App">
            <SideNav
                navItems={[
                    { label: "All", linkTo: "/" },
                    { label: "Tops", linkTo: "/" },
                    { label: "Bottoms", linkTo: "/" },
                    { label: "Upload", linkTo: "/upload" },
                ]}
            />
            <Routes>
                <Route path="/" element={<Home files={files || []} />} />
                <Route path="/upload" element={<Upload />} />
            </Routes>
            {/* <Home files={files || []}/> */}
        </div>
    );
}

export default App;
