import '../styles';
import { hydrateRoot } from 'react-dom/client';
import Page from '../pages/privacy';
import '../site.css';

hydrateRoot(document.getElementById('root')!, <Page />);
