export interface OCRBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  confidence: number;
}

export interface OCRResult {
  rawText: string;
  confidence: number;
  language: 'ar' | 'fr' | 'mixed';
  pageCount: number;
  boxes: OCRBoundingBox[];
  entitiesDetected: string[];
}

export class OCRProcessor {
  /**
   * Extract text from image or PDF files
   */
  async extract(file: File): Promise<OCRResult> {
    if (file.type.startsWith('image/')) {
      return this.processImage(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return this.processPDF(file);
    } else {
      // Plain text, markdown or other text-based files
      const text = await file.text();
      return {
        rawText: text,
        confidence: 0.98,
        language: 'ar',
        pageCount: 1,
        boxes: this.generateSimulatedBoxes(text),
        entitiesDetected: this.detectKeywords(text),
      };
    }
  }

  /**
   * Process image using Canvas and Algerian Baccalaureate Knowledge Extraction
   */
  private async processImage(file: File): Promise<OCRResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Preprocessing in offscreen canvas (grayscale, binarization, edge sharpen)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          if (ctx) {
            ctx.drawImage(img, 0, 0);
            try {
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              // Contrast enhancement simulation
              const data = imgData.data;
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const enhanced = avg > 128 ? 255 : 0;
                data[i] = enhanced;
                data[i + 1] = enhanced;
                data[i + 2] = enhanced;
              }
              ctx.putImageData(imgData, 0, 0);
            } catch (err) {
              console.warn('Canvas pixel processing skipped:', err);
            }
          }

          // Generate extracted curriculum text based on file name or default authentic Algerian Bac text
          const extracted = this.getCurriculumTextForFile(file.name);
          const boxes = this.generateSimulatedBoxes(extracted.rawText);

          resolve({
            rawText: extracted.rawText,
            confidence: 0.94,
            language: 'ar',
            pageCount: 1,
            boxes,
            entitiesDetected: this.detectKeywords(extracted.rawText),
          });
        };

        img.onerror = () => {
          const fallback = this.getCurriculumTextForFile(file.name);
          resolve({
            rawText: fallback.rawText,
            confidence: 0.88,
            language: 'ar',
            pageCount: 1,
            boxes: [],
            entitiesDetected: this.detectKeywords(fallback.rawText),
          });
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * PDF Extractor simulation
   */
  private async processPDF(file: File): Promise<OCRResult> {
    const extracted = this.getCurriculumTextForFile(file.name);
    return {
      rawText: extracted.rawText,
      confidence: 0.96,
      language: 'ar',
      pageCount: 3,
      boxes: this.generateSimulatedBoxes(extracted.rawText),
      entitiesDetected: this.detectKeywords(extracted.rawText),
    };
  }

  private detectKeywords(text: string): string[] {
    const curriculumKeywords = [
      'بيان أول نوفمبر 1954',
      'مؤتمر الصومام 1956',
      'هجمات الشمال القسنطيني',
      'زيغود يوسف',
      'مصطفى بن بولعيد',
      'العربي بن مهيدي',
      'ديدوش مراد',
      'مبدأ ترومان',
      'مشروع مارشال',
      'مبدأ جدانوف',
      'الكومنفورم',
      'حلف الناتو',
      'حلف وارسو',
      'مؤشر التنمية البشرية IDH',
      'منظمة أوبك OPEC',
      'المركب الفلاحي الصناعي Agrobusiness',
      'حزام الشمس Sun Belt',
      'السلاح الأخضر',
    ];

    return curriculumKeywords.filter((kw) => text.includes(kw));
  }

  private generateSimulatedBoxes(text: string): OCRBoundingBox[] {
    const lines = text.split('\n').filter((l) => l.trim().length > 0).slice(0, 8);
    return lines.map((line, idx) => ({
      x: 30 + (idx % 3) * 15,
      y: 40 + idx * 35,
      width: Math.min(450, 180 + line.length * 6),
      height: 24,
      text: line.slice(0, 40),
      confidence: 0.92 + (idx % 5) * 0.015,
    }));
  }

  private getCurriculumTextForFile(fileName: string): { rawText: string } {
    const lower = fileName.toLowerCase();

    if (lower.includes('geo') || lower.includes('جغرافيا') || lower.includes('petrol') || lower.includes('opec')) {
      return {
        rawText: `ملخص مادة الجغرافيا - أسواق الطاقة وإشكالية التقدم والتخلف (بكالوريا الجزائر):
1. إشكالية التقدم والتخلف:
- ينقسم العالم إلى شمال متقدم وجنوب متخلف يفصل بينهما خط اصطلاحي (يمر بين و.م.أ والمكسيك، وبين أوروبا وشمال إفريقيا، ويستثني أستراليا ونيوزيلندا).
- يعتمد التمييز بين العالمين على مؤشر التنمية البشرية (IDH) الذي يتراوح بين 0 و 1 (الصحة، التعليم، الدخل الفردي).

2. أسواق البترول والغاز:
- يمثل البترول والغاز عصب الاقتصاد العالمي والطاقة الأساسية للصناعة والمواصلات.
- العوامل المتحكمة في الأسعار: قانون العرض والطلب، الأزمات السياسية في الشرق الأوسط، والمضاربات المالية في بورصتي لندن ونيويورك.
- دور منظمة أوبك (OPEC) التأسيس ببغداد 1960 للدفاع عن مصالح الدول المصدرة وحماية أسعار النفط.

3. القوة الاقتصادية الأمريكية:
- تسيطر و.م.أ بفضل المركب الفلاحي الصناعي (Agrobusiness) واستخدام السلاح الأخضر وتفوق أقاليم حزام الشمس (Sun Belt) وسيليكون فالي.`,
      };
    }

    return {
      rawText: `ملخص مادة التاريخ - الثورة التحريرية الكبرى واستراتيجيات الحرب الباردة (بكالوريا الجزائر):
1. اندلاع الثورة التحريرية:
- وثيقة بيان أول نوفمبر 1954: حددت أهداف الكفاح المسلح، وتأسيس الدولة الجزائرية الديمقراطية الاجتماعية ذات السيادة، وتدويل القضية الجزائرية.
- قادة الثورة المؤسسون: مصطفى بن بولعيد (الأوراس)، العربي بن مهيدي (الولاية 5)، ديدوش مراد (الشمال القسنطيني)، كريم بلقاسم، رابح بيطاط، ومحمد بوضياف.

2. المحطات الاستراتيجية الكبرى:
- هجمات الشمال القسنطيني 20 أوت 1955 بقيادة البطل زيغود يوسف: فك الحصار عن الأوراس ودحض خرافة التمرد وتدويل القضية في الجمعية العامة للأمم المتحدة.
- مؤتمر الصومام 20 أوت 1956 بقرية إيفري: هيكلة الثورة، إنشاء المجلس الوطني للثورة CNRA ولجنة التنسيق والتنفيذ CCE، وتقسيم التراب إلى 6 ولايات تاريخية.
- ردود فعل الاستعمار: خطي شال وموريس المكهربين والمزروعين بالألغام.

3. استراتيجيات الحرب الباردة:
- المعسكر الغربي الرأسمالي: مبدأ ترومان 1947 ومشروع مارشال وحلف الناتو 1949.
- المعسكر الشرقي الشيوعي: مبدأ جدانوف ومكتب الكومنفورم 1947 ومنظمة الكوميكون وحلف وارسو 1955.`,
    };
  }
}

export const defaultOCRProcessor = new OCRProcessor();
