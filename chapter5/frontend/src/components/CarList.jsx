import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Card from "./Card";

const CarList = () => {
    const { auth } = useAuth();
    const [cars, setCars] = useState([]);
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/cars/?min_price=0&max_price=1000000&brand=&page=1`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                console.log("got json");
                console.log(json);
                setCars(json);
            });
    }, []);

    return (
        <div>
            <h2 className="text-xl text-primary text-center font-bold my-5">
                Cars Page
            </h2>
            <div className="mx-8 grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                {cars && cars.map(
                    (el) => {
                        return <Card key={el._id} car={el} />;
                    }
                )}
            </div>
        </div>
    );
};
export default CarList;