import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { 
    translation: { 
      "Dashboard": "Dashboard", 
      "Employees": "Employees", 
      "Settings": "Settings", 
      "Sign Out": "Sign Out", 
      "Upgrade to PRO": "Upgrade to PRO",
      "Total Employees": "Total Employees",
      "Upcoming Milestones": "Upcoming Milestones",
      "Active Alerts": "Active Alerts",
      "Dashboard Overview": "Dashboard Overview",
      "Pricing": "Pricing",
      "Plan": "Plan",
      "Language": "Language",
      "Dark Mode": "Dark Mode",
      "Light Mode": "Light Mode",
      "Happening Today": "Happening Today",
      "User Management": "User Management"
    } 
  },
  mm: { 
    translation: { 
      "Dashboard": "ဒက်ရှ်ဘုတ်", 
      "Employees": "ဝန်ထမ်းများ", 
      "Settings": "ဆက်တင်များ", 
      "Sign Out": "ထွက်ရန်", 
      "Upgrade to PRO": "PRO သို့ အဆင့်မြှင့်ပါ",
      "Total Employees": "စုစုပေါင်း ဝန်ထမ်းများ",
      "Upcoming Milestones": "လာမည့် မှတ်တိုင်များ",
      "Active Alerts": "လက်ရှိ သတိပေးချက်များ",
      "Dashboard Overview": "ဒက်ရှ်ဘုတ် အကျဉ်းချုပ်",
      "Pricing": "ဈေးနှုန်း",
      "Plan": "အစီအစဉ်",
      "Language": "ဘာသာစကား",
      "Dark Mode": "အမှောင်မုဒ်",
      "Light Mode": "အလင်းမုဒ်",
      "Happening Today": "ယနေ့ဖြစ်ရပ်များ",
      "User Management": "အသုံးပြုသူ စီမံခန့်ခွဲမှု"
    } 
  },
  zh: { 
    translation: { 
      "Dashboard": "儀表板", 
      "Employees": "員工", 
      "Settings": "設定", 
      "Sign Out": "登出", 
      "Upgrade to PRO": "升級至 PRO",
      "Total Employees": "總員工",
      "Upcoming Milestones": "即將到來的里程碑",
      "Active Alerts": "活動警報",
      "Dashboard Overview": "儀表板概覽",
      "Pricing": "定價",
      "Plan": "計劃",
      "Language": "語言",
      "Dark Mode": "深色模式",
      "Light Mode": "淺色模式",
      "Happening Today": "今日事件",
      "User Management": "用戶管理"
    } 
  },
  vn: { 
    translation: { 
      "Dashboard": "Bảng điều khiển", 
      "Employees": "Nhân viên", 
      "Settings": "Cài đặt", 
      "Sign Out": "Đăng xuất", 
      "Upgrade to PRO": "Nâng cấp lên PRO",
      "Total Employees": "Tổng số nhân viên",
      "Upcoming Milestones": "Các sự kiện sắp tới",
      "Active Alerts": "Cảnh báo hoạt động",
      "Dashboard Overview": "Tổng quan bảng điều khiển",
      "Pricing": "Bảng giá",
      "Plan": "Gói",
      "Language": "Ngôn ngữ",
      "Dark Mode": "Chế độ tối",
      "Light Mode": "Chế độ sáng",
      "Happening Today": "Sự kiện hôm nay",
      "User Management": "Quản lý người dùng"
    } 
  }
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
