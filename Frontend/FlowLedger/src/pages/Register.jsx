
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Register() {
    const [Username, setUsername] = useState("")
    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const HandleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data } = await axios.post(
                "http://localhost:3000/register",
                {
                    name: Name,
                    username: Username,
                    email: Email,
                    password: Password
                },
                { withCredentials: true }
            )

            if (data) {
                navigate("/dashboard")
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {Loading ? (
                <h1>Loading...</h1>
            ) : (
                <form onSubmit={HandleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={Username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">REGISTER</button>
                </form>
            )}
        </div>
    )
}

export default Register
