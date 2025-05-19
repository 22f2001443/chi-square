import { useState } from "react";
import "./App.css"; // Make sure this file contains relevant CSS

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="app">
      {/* Navigation */}
      <header className="navbar">
        <div className="container nav-content">
          <h1 className="logo">MyWebsite</h1>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Welcome to MyWebsite</h2>
        <p>We help you build stunning and responsive web applications.</p>
        <button className="primary-btn">Get Started</button>
      </section>

      {/* Feature Section */}
      <section className="features">
        <div className="feature-card">
          <h3>Interactive Counter</h3>
          <p>Click the button below to increase the count.</p>
          <button className="counter-btn" onClick={() => setCount(count + 1)}>
            Count is {count}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div>
          &copy; {new Date().getFullYear()} MyWebsite. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

export default App;
