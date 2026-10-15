import '../reporting';
import '../styles';
import { hydrateRoot } from 'react-dom/client';
import Page from '../pages/reach';
import '../site.css';

hydrateRoot(document.getElementById('root')!, <Page />);
