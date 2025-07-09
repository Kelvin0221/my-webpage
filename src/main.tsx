import ReactDOM from 'react-dom/client';
import './assets/style/index.css';
import './assets/style/custom-scroll-bar.css'
import AppRouter from './nav-router.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
        <AppRouter />
);