/**
 * pdf.js – PDF generation using html2canvas + jsPDF
 */

async function downloadResumeAsPDF(data, template) {
  const btn = document.getElementById('download-pdf');
  btn.classList.add('loading');

  showToast('Generating PDF…', '');

  try {
    // Build an offscreen clone for clean PDF capture
    const clone = document.createElement('div');
    clone.id = 'pdf-clone';
    clone.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 794px;
      background: #fff;
      z-index: -1;
      font-family: 'Inter', 'DM Sans', sans-serif;
    `;
    clone.innerHTML = renderResume(data, template);
    document.body.appendChild(clone);

    // Short delay to let fonts/styles apply
    await new Promise(r => setTimeout(r, 300));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      windowWidth: 794,
    });

    document.body.removeChild(clone);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth  = canvas.width;
    const imgHeight = canvas.height;
    const ratio     = pdfWidth / imgWidth;
    const scaledH   = imgHeight * ratio;

    const imgData = canvas.toDataURL('image/png');

    // Paginate if taller than one page
    if (scaledH <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledH);
    } else {
      let yOffset = 0;
      const pageH = Math.round(pdfHeight / ratio);
      while (yOffset < imgHeight) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width  = imgWidth;
        pageCanvas.height = Math.min(pageH, imgHeight - yOffset);
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, yOffset, imgWidth, pageCanvas.height, 0, 0, imgWidth, pageCanvas.height);
        const pageData = pageCanvas.toDataURL('image/png');
        if (yOffset > 0) pdf.addPage();
        const pageScaledH = pageCanvas.height * ratio;
        pdf.addImage(pageData, 'PNG', 0, 0, pdfWidth, pageScaledH);
        yOffset += pageH;
      }
    }

    const fileName = (data.personal.fullName || 'Resume').replace(/\s+/g, '_') + '_Resume.pdf';
    pdf.save(fileName);

    showToast('✓ PDF downloaded!', 'success');
  } catch (err) {
    console.error('PDF generation error:', err);
    showToast('PDF generation failed. Try again.', 'error');
  } finally {
    btn.classList.remove('loading');
  }
}
