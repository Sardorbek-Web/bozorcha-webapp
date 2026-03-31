import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      home: "Bosh sahifa",
      cart: "Savat",
      profile: "Profil",
    },
  },
  ru: {
    translation: {
      home: "Главная",
      cart: "Корзина",
      profile: "Профиль",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;