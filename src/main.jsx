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
import DeckViewer from './DeckViewer';
import { UserProvider } from './context/UserContext';

const basename = process.env.NODE_ENV === 'development' ? '' : '/blackjack-frontend/';

console.log(process.env.NODE_ENV, basename);

const router = createBrowserRouter(
  [
    { path: '/', element: <SeatAndBuyIn /> },
    { path: '/dev/', element: <MainMenu /> },
    { path: '/blackjack', element: <Blackjack /> },
    { path: '/seat-buy-in', element: <SeatAndBuyIn /> },
    { path: '/deck-select', element: <DeckSelect /> },
    { path: '/run-hub', element: <RunHub /> },
    { path: '/shop', element: <Shop /> },
    { path: '/deck-viewer', element: <DeckViewer /> },
  ],
  { basename }
);

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
