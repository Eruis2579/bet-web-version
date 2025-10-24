import Header from "./header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen">
                <Header />
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}