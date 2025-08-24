import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Blackjack from './Blackjack';
import SeatAndBuyIn from './SeatAndBuyIn';
import BettingScreen from './BettingScreen';
import DeckSelect from './DeckSelect';
import RunHub from './RunHub';
import Shop from './Shop';
import MainMenu from './MainMenu';
import './index.css';
import DeckViewer from './DeckViewer';

const router = createBrowserRouter([
  { path: '/', element: <MainMenu /> },
  { path: '/blackjack', element: <Blackjack /> },
  { path: '/seat-buy-in', element: <SeatAndBuyIn /> },
  { path: '/bet', element: <BettingScreen /> },
  { path: '/deck-select', element: <DeckSelect /> },
  { path: '/run-hub', element: <RunHub /> },
  { path: '/shop', element: <Shop /> },
  { path: '/deck-viewer', element: <DeckViewer /> },
]);

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
