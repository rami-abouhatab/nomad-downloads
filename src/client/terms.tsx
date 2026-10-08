import '../styles';
import { hydrateRoot } from 'react-dom/client';
import Page from '../pages/terms';
import '../site.css';

hydrateRoot(document.getElementById('root')!, <Page />);
