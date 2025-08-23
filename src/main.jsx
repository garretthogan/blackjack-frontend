import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LandingPage from "./LandingPage";
import Blackjack from "./Blackjack";
import './index.css'
import SeatAndBuyIn from "./SeatAndBuyIn";
import BettingScreen from "./BettingScreen";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: '/blackjack', element: <Blackjack /> },
  { path: '/seat-buy-in', element: <SeatAndBuyIn /> },
  { path: '/bet', element: <BettingScreen /> }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);