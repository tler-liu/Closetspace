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

    let entry = null;

    clothingItems?.forEach((item) => {
        if (item.id === id) {
            entry = item;
        }
    });

    const {
        secure_url,
        name,
        public_id,
        brand = "Not specified",
    } = entry || {};

    const [fields, setFields] = useState({
        name: name,
        brand: brand,
    });
    const [editing, setEditing] = useState({
        name: false,
        brand: false,
    });

    const removeItem = async () => {
        try {
            // TODO: delete image from cloudinary DB
            const response = await fetch("/deleteItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ public_id: public_id }),
            });

            console.log("response", response);

            await deleteDoc(doc(db, process.env.REACT_APP_COLLECTION_NAME, id));
        } catch (error) {
            console.log(error);
        }

        getClothingItems();
    };

    const updateItem = async (field) => {
        let newData = { ...entry };
        switch (field) {
            case "name":
                newData = { ...newData, name: fields.name };
                break;
            case "brand":
                newData = { ...newData, brand: fields.brand };
                break;
        }
        try {
            await setDoc(doc(db, process.env.REACT_APP_COLLECTION_NAME, id), {
                ...newData,
            });
            getClothingItems();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetField = async (fieldName, newVal) => {
        setFields({
            ...fields,
            [fieldName]: newVal,
        });
    };

    const handleChangeEditing = async (fieldName, newVal) => {
        setEditing({
            ...editing,
            [fieldName]: newVal,
        });
    };

    if (entry === null) {
        return "";
    }

    return (
        <div className="item-page">
            <img src={secure_url} className="item-image" />
            <div className="item-details">
                <div className="item-fields">
                    {editing.name ? (
                        <Input
                            placeholder="Name..."
                            value={fields.name}
                            onInputFn={(e) => {
                                handleSetField("name", e.target.value);
                            }}
                            onKeyUpFn={(e) => {
                                if (e.key === "Enter") {
                                    // updateDoc and fetchData
                                    updateItem("name");
                                    handleChangeEditing("name", !editing.name);
                                } else if (e.key === "Escape") {
                                    handleChangeEditing("name", !editing.name);
                                }
                            }}
                            onFocusOutFn={(e) => {
                                handleChangeEditing("name", !editing.name);
                            }}
                            style={{
                                fontSize: "32px",
                                fontWeight: "600",
                                padding: "12px",
                            }}
                            name="name"
                        />
                    ) : (
                        <h1
                            onDoubleClick={() => {
                                handleChangeEditing("name", !editing.name);
                                handleSetField("name", name);
                            }}
                        >
                            {name}
                        </h1>
                    )}
                    {editing.brand ? (
                        <Input
                            placeholder="Brand..."
                            value={fields.brand}
                            onInputFn={(e) => {
                                handleSetField("brand", e.target.value);
                            }}
                            onKeyUpFn={(e) => {
                                if (e.key === "Enter") {
                                    // updateDoc and fetchData
                                    updateItem("brand");
                                    handleChangeEditing(
                                        "brand",
                                        !editing.brand
                                    );
                                } else if (e.key === "Escape") {
                                    handleChangeEditing(
                                        "brand",
                                        !editing.brand
                                    );
                                }
                            }}
                            onFocusOutFn={() => {
                                handleChangeEditing("brand", !editing.brand);
                            }}
                            style={{ fontSize: "16px", padding: "12px" }}
                            name="brand"
                        />
                    ) : (
                        <p
                            onDoubleClick={() => {
                                handleChangeEditing("brand", !editing.brand);
                                handleSetField("brand", brand);
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
