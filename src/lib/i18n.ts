import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: { "Dashboard": "Dashboard", "Employees": "Employees", "Settings": "Settings", "Sign Out": "Sign Out", "Upgrade to PRO": "Upgrade to PRO" } },
  mm: { translation: { "Dashboard": "ဒက်ရှ်ဘုတ်", "Employees": "ဝန်ထမ်းများ", "Settings": "ဆက်တင်များ", "Sign Out": "ထွက်ရန်", "Upgrade to PRO": "PRO သို့ အဆင့်မြှင့်ပါ" } },
  zh: { translation: { "Dashboard": "儀表板", "Employees": "員工", "Settings": "設定", "Sign Out": "登出", "Upgrade to PRO": "升級至 PRO" } },
  vn: { translation: { "Dashboard": "Bảng điều khiển", "Employees": "Nhân viên", "Settings": "Cài đặt", "Sign Out": "Đăng xuất", "Upgrade to PRO": "Nâng cấp lên PRO" } }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
