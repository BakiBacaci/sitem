/** Yalnızca Latin/ASCII harflerden oluşan adlar (Plip, Thermal Drift) İngilizce sayılır; böylece büyük harfe çevrilince "İ" olmaz. */
export function titleLang(title: string): 'en' | 'tr' {
  return /^[A-Za-z0-9\s.'&:-]+$/.test(title) ? 'en' : 'tr';
}
