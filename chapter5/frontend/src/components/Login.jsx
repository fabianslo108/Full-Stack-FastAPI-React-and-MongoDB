import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const Login = () => {
    const [apiError, setApiError] = useState();
    const { setAuth } = useAuth();
    let navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onFormSubmit = async (data) => {
        const response = await fetch("http://127.0.0.1:8000/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const token = await response.json();
            await getUserData(token["token"]);
        } else {
            let errorResponse = await response.json();
            setApiError(errorResponse["detail"]);
            setAuth(null);
        }
    };

    const onErrors = (errors) => console.error(errors);

    const getUserData = async (token) => {
        const response = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (response.ok) {
            let userData = await response.json();
            userData["token"] = token;
            localStorage.setItem("carUserData", JSON.stringify(userData));
            setAuth(userData);
            setApiError(null);
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="mx-auto p-10 rounded-lg shadow-2xl">
            <h2 className="text-xl text-primary text-center font-bold my-2">
                Login page
            </h2>
            <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <div className="flex flex-col justify-center items-center">
                    <input
                        type="text"
                        placeholder="email@email.com"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="email"
                        autoComplete="off"
                        {...register("email", { required: "The email is required" })}
                    />
                    {errors?.email && errors.email.message}
                    <input
                        type="password"
                        placeholder="your password"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="password"
                        {...register("password", { required: "The password is required" })}
                    />
                    {errors?.password && errors.password.message}
                    <button className="btn btn-outline btn-accent m-3 btn-block">
                        Login
                    </button>
                </div>
            </form>
            {apiError && (
                <div className="alert alert-error shadow-lg">
                    <div>
                        <span>{apiError}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Login;

