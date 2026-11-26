import { createBrowserRouter } from 'react-router-dom';
import { AboutPage } from '../features/about/AboutPage';
import { EmploymentPage } from '../features/employment/EmploymentPage';
import { OverviewPage } from '../features/overview/OverviewPage';
import { RegionsPage } from '../features/regions/RegionsPage';
import { UnemploymentPage } from '../features/unemployment/UnemploymentPage';
import { WagesPage } from '../features/wages/WagesPage';
import { WomenPage } from '../features/women/WomenPage';
import { AppLayout } from './layout/AppLayout';
import { NotFoundPage } from './NotFoundPage';
import { RouteError } from './RouteError';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                // Pathless wrapper: a crash inside a page shows RouteError *inside* the layout.
                errorElement: <RouteError />,
                children: [
                    { index: true, element: <OverviewPage /> },
                    { path: 'unemployment', element: <UnemploymentPage /> },
                    { path: 'employment', element: <EmploymentPage /> },
                    { path: 'regions', element: <RegionsPage /> },
                    { path: 'wages', element: <WagesPage /> },
                    { path: 'women', element: <WomenPage /> },
                    { path: 'about', element: <AboutPage /> },
                    { path: '*', element: <NotFoundPage /> },
                ],
            },
        ],
    },
]);