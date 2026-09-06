import { SettingsState } from '../store/settingsStore';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export const settingsApi = {
  // Fetch remote settings
  async fetchSettings(): Promise<ApiResponse<Partial<SettingsState>>> {
    try {
      const stored = localStorage.getItem('atlas_bac_settings_store_v1');
      if (stored) {
        return {
          success: true,
          data: JSON.parse(stored),
          message: 'تم تحميل الإعدادات بنجاح',
        };
      }
      return {
        success: true,
        message: 'تم استخدام الإعدادات الافتراضية',
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'خطأ في جلب الإعدادات',
      };
    }
  },

  // Save settings
  async saveSettings(payload: Partial<SettingsState>): Promise<ApiResponse<null>> {
    try {
      localStorage.setItem('atlas_bac_settings_store_v1', JSON.stringify(payload));
      return {
        success: true,
        message: 'تم حفظ وتزامن الإعدادات بنجاح',
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'تعذر حفظ الإعدادات في الذاكرة المحلية',
      };
    }
  },

  // Clear cache / reset
  async clearCache(): Promise<ApiResponse<null>> {
    try {
      // Clear temporary items but keep user stats safe
      sessionStorage.clear();
      return {
        success: true,
        message: 'تم مسح الذاكرة المؤقتة بنجاح وتحديث واجهات النظام',
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'فشل مسح الذاكرة المؤقتة',
      };
    }
  },
};
