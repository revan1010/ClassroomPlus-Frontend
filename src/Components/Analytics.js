import ReactGA from 'react-ga';

export const sendAnalytics = (category, action, label) => {
    ReactGA.event({
        category,
        action,
        label,
    });
}