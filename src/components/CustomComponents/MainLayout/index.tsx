import Header from "./header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <Header />
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}