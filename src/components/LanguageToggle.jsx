import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLang("uz")}>UZ</button>
      <button onClick={() => changeLang("ru")}>RU</button>
    </div>
  );
}