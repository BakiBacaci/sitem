/** Kimlikten kararlı bir eğim açısı (-6..6 derece) üretir; her not kendi açısını korur. */
export function tiltFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 13) - 6;
}
