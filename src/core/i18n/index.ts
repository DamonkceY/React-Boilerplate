import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './languages/en';
import fr from './languages/fr';
import ar from './languages/ar';

const resources = {
	en,
	fr,
	ar,
};

i18n.use(initReactI18next)?.init({
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
