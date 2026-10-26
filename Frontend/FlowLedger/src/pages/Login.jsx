import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate()

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post("http://localhost:3000/login",
                {
                    email: Email,
                    password: Password

                }, {
                withCredentials: true
            }
            )

            if (data.user.role === "sadmin") {
                navigate("/superadmindashboard")
            } else {
                navigate("/dashboard")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }

    return (
        <>
            <div>
                {Loading ? (
                    <h1>Loading...</h1>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input type='Email'
                            placeholder='Enter Email'
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)} />

                        <input type='password'
                            placeholder='Enter Password'
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)} />

                        <button type='submit'>LOGIN</button>
                    </form>
                )}
            </div>
        </>
    )
}

export default Login