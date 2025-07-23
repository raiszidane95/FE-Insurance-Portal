
import { useEffect, useState } from 'react';

function base64ToBlob(base64, contentType = 'application/pdf') {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = Array.from(slice).map(ch => ch.charCodeAt(0));
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}
export default function PdfViewer({ base64data }) {
  const [pdfData, setPdfData] = useState(null);
  useEffect(() => {
    if (base64data) {
      const blob = base64ToBlob(base64data);
      setPdfData(URL.createObjectURL(blob));
    }
  }, [base64data]);

  return (
    <div>
      {pdfData && (
        <iframe
          src={`${pdfData}`}
          width="100%"
          height="500px"
          title="PDF Viewer"
          type='application/pdf'
        />
      )}
    </div>
  );
}
