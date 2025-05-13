import jsPDF from 'jspdf';
import { getWatchProvider } from '../services/tmdb';
import type { Movie } from '../types/sharedTypes';

export async function exportPDF(movies: Movie[], language: string) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const maxY = pageHeight - margin;
  const lineHeight = 5;

  const title =
    language === 'pt-BR' ? '30 Dias de Filmes' : '30 Movies in 30 Days';
  const dayLabel = language === 'pt-BR' ? 'Dia' : 'Day';
  const providerLabel =
    language === 'pt-BR' ? 'Onde assistir' : 'Where to watch';

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(title, pageWidth / 2, margin, {
    align: 'center',
  });

  let y = margin + 10;
  const providerLanguage = language === 'pt-BR' ? 'BR' : 'US';

  const moviesWithProviders = await Promise.all(
    movies.map(async (movie) => ({
      ...movie,
      provider: await getWatchProvider(movie.id, providerLanguage),
    }))
  );

  moviesWithProviders.map((movie, index) => {
    const dia = `${dayLabel} ${index + 1}`;
    const year = movie.release_date?.split('-')[0] ?? '----';
    const title = `${movie.title} (${year})`;
    const overview = movie.overview ?? '';
    const provider = movie.provider ?? '--';

    const overviewLines = pdf.splitTextToSize(overview, contentWidth);
    const providerLine = `${providerLabel}: ${provider}`;
    const blockHeight = lineHeight * (3 + overviewLines.length);

    if (y + blockHeight > maxY) {
      pdf.addPage();
      y = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(220, 38, 38);
    pdf.text(dia, margin, y);
    y += lineHeight;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(33, 33, 33);
    pdf.text(title, margin, y);
    y += lineHeight;

    pdf.setFontSize(8);
    pdf.text(overviewLines, margin, y);
    y += lineHeight * overviewLines.length;

    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(providerLine, margin, y);
    y += lineHeight;

    y += 4;
    pdf.setDrawColor(230);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4;
  });

  pdf.save('30-day-movie.pdf');
}
