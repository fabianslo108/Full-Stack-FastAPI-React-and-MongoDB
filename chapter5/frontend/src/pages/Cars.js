import Layout from "../components/Layout";
import Card from "../components/Card";
import { React, useState, useEffect } from 'react';
import FormInput from "../components/FormInput";

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [brand, setBrand] = useState('');
    const [minprice, setMinprice] = useState(0);
    const [maxprice, setMaxprice] = useState(100000);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/cars?brand=${brand}&min_price=${minprice}&max_price=${maxprice}&page=1`)
            .then(response => response.json())
            .then(json => setCars(json));
        setIsPending(false);
    }, [brand, minprice, maxprice]);

    const handleChangeBrand = (event) => {
        setCars([]);
        setBrand(event.target.value);
        setIsPending(true);
    };
    const handleChangeMinprice = (event) => {
        setCars([]);
        setMinprice(event.target.value);
        setIsPending(true);
    };
    const handleChangeMaxprice = (event) => {
        setCars([]);
        setMaxprice(event.target.value);
        setIsPending(true);
    };
    return (
        <Layout>
            <h2 className="font-bold font-mono text-lg text-center my-4">Cars - {brand ? brand : "all brands"}</h2>
            <div className="mx-8">
                <label htmlFor="cars">Choose a brand:</label>
                <select name="cars" id="cars" onChange={handleChangeBrand}>
                    <option value="">All cars</option>
                    <option value="Fiat">Fiat</option>
                    <option value="Opel">Opel</option>
                    <option value="Ferrari">Ferrari</option>
                </select>
                <div>
                    <label htmlFor="cars">Min Price:</label>
                    <input placeholder="0" type="number" onChange={handleChangeMinprice}></input>
                </div>
                <FormInput
                    label="Max Price" type="number" placeholder="100000"
                    onChange={handleChangeMaxprice} />
            </div>
            <div className="mx-8">
                {isPending && <div>
                    <h2>Loading cars, brand:{brand}...</h2>
                </div>}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {cars && cars.map(
                        (el) => {
                            return (
                                <Card key={el._id} car={el} />
                            );
                        }
                    )
                    }
                </div>
            </div>
        </Layout>
    );
};

export default Cars;