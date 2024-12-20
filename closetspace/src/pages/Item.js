import { useParams } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firestore";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

const Item = ({ clothingItems = [], getClothingItems }) => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    return (
        <div className="item-page">
            <img src={secure_url} className="item-image" />
            <div className="item-details">
                <div>
                    <h1>{name}</h1>
                    <p>{`Brand: ${brand}`}</p>
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
