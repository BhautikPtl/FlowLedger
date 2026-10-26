import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, url }) => {
    const [isAuth, setisAuth] = useState(null);

    useEffect(() => {
        axios.post(`http://localhost:3000/${url}`)
            .then(() => setisAuth(true))
            .catch(() => setisAuth(false));
    }, [url]);

    if (isAuth === null) {
        return <h3>loading......</h3>;
    }


    return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
