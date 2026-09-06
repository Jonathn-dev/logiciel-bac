export const exportService = {
  // Export entire student data to JSON
  exportToJson(data: any, fileName: string = 'atlas-bac-backup.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export summary markdown report
  exportToMarkdown(profile: any, stats: any, notebooks: any[]) {
    const mdContent = `# 🇩🇿 أطلس البكالوريا 2026 - تقرير الطالب الشامل
**الاسم**: ${profile.name}
**الشعبة والمستوى**: ${profile.level}
**الولاية**: ${profile.state}
**سنة البكالوريا**: ${profile.bacYear}
**تاريخ التصدير**: ${new Date().toLocaleDateString('ar-DZ')}

---

## 📊 الإحصائيات العامة ومؤشر الجاهزية
- **مجموع نقاط الخبرة (XP)**: ${stats?.totalXP || 3420} XP
- **المستوى الحالي**: المستوى ${stats?.currentLevel || 14}
- **أيام التتابع (Streak)**: ${stats?.streakDays || 18} يوماً متواصلاً
- **المعدل المستهدف**: ${profile.targetGrade}/20

---

## 📚 الملخصات والدفاتر المفهرسة (RAG Vector Store)
${notebooks
  .map(
    (n, idx) => `
### ${idx + 1}. ${n.title}
- **المادة**: ${n.subject === 'history' ? 'تاريخ' : n.subject === 'geography' ? 'جغرافيا' : 'شامل'}
- **عدد المتجهات**: ${n.vectorCount} Vector
- **تاريخ آخر تحديث**: ${n.lastUpdated}
- **الوصف**: ${n.summary}
`
  )
  .join('\n')}

---
*تم إنشاء هذا التقرير آلياً عبر منصة أطلس البكالوريا الذكية للتاريخ والجغرافيا.*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير-بكالوريا-2026-${profile.name.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Import JSON backup
  importFromJson(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          resolve(parsed);
        } catch (err) {
          reject(new Error('الملف غير صالح أو تالف. يرجى اختيار ملف JSON صحيح.'));
        }
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsText(file);
    });
  },
};
