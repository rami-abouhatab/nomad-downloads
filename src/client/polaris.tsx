import '../styles';
import { hydrateRoot } from 'react-dom/client';
import Page from '../pages/polaris';
import '../site.css';

hydrateRoot(document.getElementById('root')!, <Page />);
