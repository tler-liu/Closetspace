import { useParams } from "react-router-dom";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firestore";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { useState } from "react";

const Item = ({ clothingItems = [], getClothingItems }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [editingBrand, setEditingBrand] = useState(false);
    const [brandVal, setBrandVal] = useState();
    const [editingName, setEditingName] = useState(false);
    const [nameVal, setNameVal] = useState();
    let entry = null;

    clothingItems?.forEach((item) => {
        if (item.id === id) {
            entry = item;
        }
    });

    if (entry === null) {
        return "";
    }

    const { secure_url, name, public_id, brand = "Not specified" } = entry;

    const removeItem = async () => {
        // const formData = new FormData();
        // formData.append("public_id", public_id);

        // const URL = process.env.REACT_APP_CLOUDINARY_URL_DESTROY;
        try {
            // TODO: delete image from cloudinary DB

            // const data = await fetch(URL, {
            //     method: "POST",
            //     body: formData,
            // }).then((res) => res.json());

            await deleteDoc(doc(db, "clothing_items", id));
        } catch (error) {
            console.log(error);
        }

        getClothingItems();
    };

    const updateItem = async (field) => {
        let newData = { ...entry };
        switch (field) {
            case "name":
                newData = { ...newData, name: nameVal };
                break;
            case "brand":
                newData = { ...newData, brand: brandVal };
                break;
        }
        try {
            await setDoc(doc(db, "clothing_items", id), {
                ...newData,
            });
            getClothingItems();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="item-page">
            <img src={secure_url} className="item-image" />
            <div className="item-details">
                <div className="item-fields">
                    {editingName ? (
                        <Input
                            placeholder="Name..."
                            value={nameVal}
                            onInputFn={(e) => {
                                setNameVal(e.target.value);
                            }}
                            onKeyUpFn={(e) => {
                                if (e.key === "Enter") {
                                    // updateDoc and fetchData
                                    updateItem("name");
                                    setEditingName(!editingName);
                                } else if (e.key === "Escape") {
                                    setEditingName(!editingName);
                                }
                            }}
                            onFocusOutFn={() => {
                                setEditingName(!editingName);
                            }}
                            style={{
                                fontSize: "32px",
                                fontWeight: "600",
                                padding: "12px",
                            }}
                        />
                    ) : (
                        <h1
                            onDoubleClick={() => {
                                setEditingName(!editingName);
                                setNameVal(name);
                            }}
                        >
                            {name}
                        </h1>
                    )}
                    {editingBrand ? (
                        <Input
                            placeholder="Brand..."
                            value={brandVal}
                            onInputFn={(e) => {
                                setBrandVal(e.target.value);
                            }}
                            onKeyUpFn={(e) => {
                                if (e.key === "Enter") {
                                    // updateDoc and fetchData
                                    updateItem("brand");
                                    setEditingBrand(!editingBrand);
                                } else if (e.key === "Escape") {
                                    setEditingBrand(!editingBrand);
                                }
                            }}
                            onFocusOutFn={() => {
                                setEditingBrand(!editingBrand);
                            }}
                            style={{ fontSize: "16px", padding: "12px" }}
                        />
                    ) : (
                        <p
                            onDoubleClick={() => {
                                setEditingBrand(!editingBrand);
                                setBrandVal(brand);
                            }}
                        >{`Brand: ${brand}`}</p>
                    )}
                </div>
                <Button
                    label="Remove Item"
                    size="medium"
                    variant="destroy"
                    onClickFn={() => {
                        removeItem();
                        navigate("/");
                    }}
                />
            </div>
        </div>
    );
};

export default Item;
