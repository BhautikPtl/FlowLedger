
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Register() {
    const [Username, setUsername] = useState("")
    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Loading, setLoading] = useState(false)
    const [Error, setError] = useState("")

    const navigate = useNavigate()

    const HandleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

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
            setError(error.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
            {Loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-10 text-center shadow-2xl">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
                    <p className="text-sm text-slate-300">Creating your account...</p>
                </div>
            ) : (
                <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
                    <div className="mb-8">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">FlowLedger</p>
                        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
                        <p className="mt-2 text-sm text-slate-400">Start tracking your money with confidence.</p>
                    </div>
                    <form className="space-y-4" onSubmit={HandleSubmit}>
                        {[
                            ["Username", "text", Username, setUsername, "Choose a username"],
                            ["Name", "text", Name, setName, "Your full name"],
                            ["Email", "email", Email, setEmail, "you@example.com"],
                            ["Password", "password", Password, setPassword, "At least 6 characters"]
                        ].map(([label, type, value, setter, placeholder]) => (
                            <label className="block text-sm font-medium text-slate-300" key={label}>
                                {label}
                                <input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" type={type} placeholder={placeholder} value={value} onChange={(e) => setter(e.target.value)} required />
                            </label>
                        ))}
                        {Error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">{Error}</p>}
                        <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900" type="submit">Create account</button>
                    </form>
                    <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <button className="font-semibold text-cyan-400 hover:text-cyan-300" onClick={() => navigate("/login")} type="button">Sign in</button></p>
                </section>
            )}
            </div>
        </main>
    )
}

export default Register
