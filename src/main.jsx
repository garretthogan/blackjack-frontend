import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Blackjack from './Blackjack';
import SeatAndBuyIn from './SeatAndBuyIn';
import DeckSelect from './DeckSelect';
import RunHub from './RunHub';
import Shop from './Shop';
import MainMenu from './MainMenu';
import './index.css';
import DeckEditor from './DeckEditor';
import { UserProvider } from './context/UserContext';

const router = createBrowserRouter([
  { path: '/', element: <MainMenu /> },
  { path: '/blackjack', element: <Blackjack /> },
  { path: '/seat-buy-in', element: <SeatAndBuyIn /> },
  { path: '/deck-select', element: <DeckSelect /> },
  { path: '/deck-edit/:deckId', element: <DeckEditor /> },
  { path: '/run-hub', element: <RunHub /> },
  { path: '/shop', element: <Shop /> },
]);

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
