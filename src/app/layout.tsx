import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Words",
    description: "A simple word search website",
    keywords: ["word", "search", "english", "dictionary"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased flex flex-col min-h-screen`}>
                <header className="border-b-2 border-b-gray-200 p-4">
                    <h1 className={`text-center ${pacifico.className}`}>
                        Words
                    </h1>
                </header>
                <main className="grow">{children}</main>
                <footer className="border-t-2 border-t-gray-200 p-6">
                    <p className="text-center">
                        &copy; {new Date().getFullYear()} Words | Made by{" "}
                        <span className={pacifico.className}>
                            Ianel Tombozafy
                        </span>
                    </p>
                </footer>
            </body>
        </html>
    );
}
