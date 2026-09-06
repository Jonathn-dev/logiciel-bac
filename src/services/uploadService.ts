export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

export const uploadService = {
  // Convert local file to base64 DataURL
  async uploadAvatar(file: File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('الملف يجب أن يكون صورة بتنسيق مدعوم (JPG, PNG, WebP)'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('حجم الصورة يجب ألا يتجاوز 5 ميغابايت'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          fileName: file.name,
          size: file.size,
          type: file.type,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  // Read text / PDF / docx simulation for notebooks
  async readDocumentText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  },
};
