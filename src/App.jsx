//import { Button } from "@/components/ui/button";
//import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800">
      {/* Navigation */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">MyWebsite</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
            <a href="#" className="hover:text-blue-600">
              About
            </a>
            <a href="#" className="hover:text-blue-600">
              Services
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to MyWebsite</h2>
        <p className="text-lg md:text-xl mb-6">
          We help you build stunning and responsive web applications.
        </p>
        <Button className="text-lg px-6 py-3">Get Started</Button>
      </section>

      {/* Feature Card */}
      <section className="container mx-auto px-6 py-12">
        <Card className="max-w-xl mx-auto shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-semibold mb-2">Interactive Counter</h3>
            <p className="mb-4">Click the button below to increase the count.</p>
            <Button onClick={() => setCount((prev) => prev + 1)}>
              Count is {count}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MyWebsite. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default App;