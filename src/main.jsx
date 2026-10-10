import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './site.jsx';
import './styles.css';
import './theme.css';
import './refinements.css';
import './navigation.css';
import './sections.css';
import './pages.css';
import './service-pages.css';

document.documentElement.dataset.theme = 'light';
createRoot(document.getElementById('root')).render(<App />);
