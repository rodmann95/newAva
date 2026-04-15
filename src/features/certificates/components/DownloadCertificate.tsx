"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Loader2Icon, DownloadIcon, CheckCircleIcon } from "lucide-react";
import { issueCertificate } from "../actions";

interface DownloadCertificateProps {
  courseId: string;
  courseTitle: string;
  userName: string;
}

export function DownloadCertificate({ courseId, courseTitle, userName }: DownloadCertificateProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    
    // 1. Issue certificate in DB and get/create verification code
    const { data, error } = await issueCertificate(courseId);
    
    if (error || !data) {
      alert("Erro ao emitir certificado: " + error);
      setIsLoading(false);
      return;
    }

    const verificationCode = data.verification_code;
    const verificationUrl = `${window.location.origin}/verify/${verificationCode}`;

    try {
      // 2. Create PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Background / Border
      doc.setDrawColor(218, 165, 32); // Gold
      doc.setLineWidth(5);
      doc.rect(5, 5, width - 10, height - 10);
      doc.setLineWidth(1);
      doc.rect(7, 7, width - 14, height - 14);

      // Header
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.text("CERTIFICADO DE CONCLUSÃO", width / 2, 40, { align: "center" });

      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");
      doc.text("Certificamos que", width / 2, 60, { align: "center" });

      // Student Name
      doc.setFontSize(32);
      doc.setFont("helvetica", "bolditalic");
      doc.setTextColor(0, 51, 102); // Dark Blue
      doc.text(userName, width / 2, 80, { align: "center" });

      // Course Info
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");
      doc.text("concluiu com êxito o treinamento", width / 2, 100, { align: "center" });
      
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(courseTitle, width / 2, 115, { align: "center" });

      // Footer Date
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.text(`Emitido em ${dateStr}`, width / 2, 140, { align: "center" });

      // QR Code
      const qrDataUrl = await QRCode.toDataURL(verificationUrl);
      doc.addImage(qrDataUrl, "PNG", width - 50, height - 50, 35, 35);
      
      doc.setFontSize(8);
      doc.text(`Código de Verificação: ${verificationCode}`, width - 32, height - 10, { align: "center" });
      doc.text("Valide em plataforma-ava.gov/verify", width - 32, height - 6, { align: "center" });

      // Seal / Logo Placeholder
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.circle(50, height - 40, 20);
      doc.setFontSize(10);
      doc.text("PLATAFORMA", 50, height - 42, { align: "center" });
      doc.text("AVA", 50, height - 37, { align: "center" });

      // Save
      doc.save(`Certificado-${courseTitle.replace(/\s+/g, '-')}.pdf`);

    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all hover:scale-105"
    >
      {isLoading ? (
        <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <DownloadIcon className="mr-2 h-5 w-5" />
      )}
      Baixar Meu Certificado
    </Button>
  );
}
