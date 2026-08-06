import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found for PDF export. Falling back to window.print()`);
    try {
      window.print();
    } catch (e) {
      console.error("window.print failed:", e);
    }
    return false;
  }

  try {
    // Hide buttons or no-print elements temporarily
    const noPrintElems = element.querySelectorAll(".print\\:hidden, .no-print");
    noPrintElems.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        // Fix Tailwind v4 unsupported oklch color function for html2canvas
        const styleElements = clonedDoc.querySelectorAll("style");
        styleElements.forEach((styleEl) => {
          if (styleEl.textContent && styleEl.textContent.includes("oklch")) {
            styleEl.textContent = styleEl.textContent.replace(/oklch\([^)]+\)/g, "rgb(16, 185, 129)");
          }
        });

        const allElements = clonedDoc.querySelectorAll<HTMLElement>("*");
        allElements.forEach((el) => {
          const styleAttr = el.getAttribute("style");
          if (styleAttr && styleAttr.includes("oklch")) {
            el.setAttribute("style", styleAttr.replace(/oklch\([^)]+\)/g, "rgb(16, 185, 129)"));
          }
        });
      },
    });

    // Restore hidden elements
    noPrintElems.forEach((el) => {
      (el as HTMLElement).style.display = "";
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating PDF with html2canvas/jsPDF:", error);
    try {
      window.print();
    } catch (err) {
      console.error("Fallback window.print error:", err);
    }
    return false;
  }
}

