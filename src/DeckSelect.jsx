// DeckSelect.jsx
import React from "react";
import { useNavigate } from "react-router";

export default function DeckSelect() {
    const navigate = useNavigate();

    const handleSelect = (deck) => {
        console.log("Selected deck:", deck);
        // later you can store this in context/state
        navigate("/seat-buy-in"); // example next screen
    };

    return (
        <div style={containerStyle}>
            <div className="rounded-2xl border border-zinc-200 p-6">
                <h1 style={titleStyle}>Choose Your Deck</h1>

                <div style={deckGridStyle}>
                    <DeckCard
                        title="Standard Deck"
                        description="A standard 52 card deck. So it would seem..."
                        onSelect={() => handleSelect("standard")}
                    />
                    <DeckCard
                        title="Coming soon..."
                        description="..."
                        onSelect={() => handleSelect("face-heavy")}
                    />
                    <DeckCard
                        title="Coming soon..."
                        description="..."
                        onSelect={() => handleSelect("ace-stacker")}
                    />
                </div>

                <button style={backButtonStyle} onClick={() => navigate("/")}>
                    Back to Menu
                </button>
            </div>
        </div>
    );
}

function DeckCard({ title, description, onSelect }) {
    return (
        <button style={deckCardStyle} onClick={onSelect}>
            <h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>{title}</h2>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>{description}</p>
        </button>
    );
}

/* Inline styles */
const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#eee",
    padding: "24px",
    fontFamily: "sans-serif",
};

const titleStyle = {
    marginBottom: "24px",
    fontSize: "28px",
};

const deckGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    width: "100%",
    maxWidth: "720px",
    marginBottom: "24px",
};

const deckCardStyle = {
    border: "1px solid",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "left",
    cursor: "pointer",
    color: "#eee",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
};

const backButtonStyle = {
    marginTop: "12px",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "1px solid ",
    color: "#eee",
    cursor: "pointer",
};
