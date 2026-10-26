function Dashboard() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">FlowLedger</p>
                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your dashboard</h1>
                    <p className="mt-2 text-slate-400">Keep an eye on your financial activity.</p>
                </header>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {["Total balance", "This month", "Savings goal"].map((label, index) => (
                        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg" key={label}>
                            <p className="text-sm text-slate-400">{label}</p>
                            <p className="mt-4 text-2xl font-bold">{index === 0 ? "$0.00" : "Coming soon"}</p>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Dashboard