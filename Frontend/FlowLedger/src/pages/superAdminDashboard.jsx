function superAdminDashboard() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">FlowLedger Admin</p>
                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Admin dashboard</h1>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {["Total users", "Active accounts", "System status"].map((label) => (
                        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg" key={label}>
                            <p className="text-sm text-slate-400">{label}</p>
                            <p className="mt-4 text-2xl font-bold">{label === "System status" ? "Online" : "Coming soon"}</p>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default superAdminDashboard