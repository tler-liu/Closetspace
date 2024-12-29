import { useEffect, useState } from "react";
import { db } from "../config/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import CardGrid from "../components/CardGrid";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";

const Recommender = ({}) => {
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState("");
    const { currentUser } = useAuth();

    const getRecommendations = async () => {
        setError("");
        try {
            const q = query(
                collection(db, process.env.REACT_APP_COLLECTION_NAME),
                where("uid", "==", currentUser.uid)
            );
            // const querySnapshot = await getDocs(
            //     collection(db, process.env.REACT_APP_COLLECTION_NAME)
            // );
            const querySnapshot = await getDocs(q);

            let newItems = [];
            querySnapshot.forEach((doc) => {
                newItems.push({ ...doc.data(), id: doc.id });
            });

            // TODO: let user know to upload items first
            if (newItems.length == 0) {
                setError("Please upload items to your wardrobe first!");
                return;
            }

            const response = await fetch("/recommendItems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ documents: newItems }),
            });

            if (response.ok) {
                const responseData = await response.json();
                const { recommendations } = responseData;

                // update recommendations state
                setRecommendations(recommendations);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getRecommendations();
    }, [currentUser]);

    if (error) {
        return <div className="loader-wrapper">{error}</div>;
    }

    return recommendations ? (
        <CardGrid cards={recommendations || []} linkable={false} />
    ) : (
        <div className="loader-wrapper">
            <Loader />
            {"Analyzing your Closet"}
        </div>
    );
};

export default Recommender;
