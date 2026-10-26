import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate()

    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { data } = await axios.post("http://localhost:3000/login",
            {
                username: Username,
                password: Password

            }, {
            withCredentials: true
        }
        )

        if (data) {
            navigate("/dashboard")
        }

    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type='text'
                        placeholder='Enter Username'
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)} />

                    <input type='password'
                        placeholder='Enter Password'
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)} />
                </form>
            </div>
        </>
    )
}

export default Login