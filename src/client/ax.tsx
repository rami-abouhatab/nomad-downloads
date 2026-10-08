import '../styles';
import { hydrateRoot } from 'react-dom/client';
import Page from '../pages/ax';
import '../site.css';

hydrateRoot(document.getElementById('root')!, <Page />);
