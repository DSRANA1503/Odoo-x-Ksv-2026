import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToCSV = (data: any[], headers: string[], filename: string) => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      row.map((cell: any) => `"${(cell != null ? cell : '').toString().replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: any[], headers: string[], filename: string, title: string) => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [23, 55, 110], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    styles: { font: 'helvetica', fontSize: 10 }
  });

  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
