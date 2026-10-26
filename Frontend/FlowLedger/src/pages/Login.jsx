import React, { useState } from 'react';
import axios from "axios";

function Login() {

    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.PreventDefault();

    }

    return (
        <>
            <div>
                <form>
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