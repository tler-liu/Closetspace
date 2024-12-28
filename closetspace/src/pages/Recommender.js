import { useEffect, useState } from "react";
import { db } from "../config/firestore";
import { collection, getDocs } from "firebase/firestore";
import CardGrid from "../components/CardGrid";
import Loader from "../components/Loader";

const Recommender = ({}) => {
    const [recommendations, setRecommendations] = useState(null);

    const getRecommendations = async () => {
        try {
            const querySnapshot = await getDocs(
                collection(db, process.env.REACT_APP_COLLECTION_NAME)
            );

            let newItems = [];
            querySnapshot.forEach((doc) => {
                newItems.push({ ...doc.data(), id: doc.id });
            });

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
    }, []);

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
