const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const router = express.Router();

function buildInvoiceHtml({ invoiceNumber, customerName, items, total, paymentMethod, email }) {
  const rows = (items || []).map((item) => {
    const quantity = Number(item.quantity || 1);
    const price = Number(item.price || 0);
    const subtotal = quantity * price;
    return `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">${item.name || 'Sneaker Item'}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${quantity}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rp ${price.toLocaleString('id-ID')}</td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rp ${subtotal.toLocaleString('id-ID')}</td>
      </tr>
    `;
  }).join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; max-width: 720px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0040df; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0; color: #0040df;">${env.companyName}</h2>
          <p style="margin: 4px 0 0; color: #6b7280;">Invoice Pembelian</p>
        </div>
        <div style="text-align: right; color: #374151;">
          <div><strong>No. Invoice:</strong> ${invoiceNumber}</div>
          <div><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID')}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 20px;">
        <div>
          <p style="margin: 0 0 4px; font-weight: bold;">Kepada</p>
          <p style="margin: 0;">${customerName || email}</p>
          <p style="margin: 0; color: #6b7280;">${email}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0 0 4px; font-weight: bold;">Pembayaran</p>
          <p style="margin: 0;">${paymentMethod}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px 8px; text-align: left;">Produk</th>
            <th style="padding: 12px 8px; text-align: center;">Qty</th>
            <th style="padding: 12px 8px; text-align: right;">Harga</th>
            <th style="padding: 12px 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div style="margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #111827;">
        Total: Rp ${Number(total || 0).toLocaleString('id-ID')}
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p style="margin: 0 0 4px;">${env.companyName}</p>
        <p style="margin: 0 0 4px;">${env.companyEmail} • ${env.companyPhone}</p>
        <p style="margin: 0;">${env.companyAddress}</p>
      </div>
    </div>
  `;
}

function buildInvoicePdf({ invoiceNumber, customerName, items, total, paymentMethod, email }) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'tmp', `${invoiceNumber}.pdf`);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);

    doc.pipe(stream);

    doc.fontSize(24).fillColor('#0040df').text(`${env.companyName} Invoice`, { align: 'left' });
    doc.moveDown(0.4);
    doc.fontSize(12).fillColor('#374151').text(`Invoice Number: ${invoiceNumber}`);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`);
    doc.text(`Customer: ${customerName || email}`);
    doc.text(`Email: ${email}`);
    doc.text(`Metode Pembayaran: ${paymentMethod}`);
    doc.moveDown(1);

    doc.fontSize(14).fillColor('#111827').text('Detail Pesanan', { underline: true });
    doc.moveDown(0.4);

    let y = doc.y;
    items.forEach((item, index) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const subtotal = quantity * price;
      doc.fontSize(11).text(`${index + 1}. ${item.name || 'Sneaker Item'}`, 40, y);
      doc.text(`${quantity}x`, 260, y);
      doc.text(`Rp ${price.toLocaleString('id-ID')}`, 320, y);
      doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, 430, y);
      y += 18;
    });

    doc.moveDown(1.5);
    doc.fontSize(14).fillColor('#111827').text(`Total: Rp ${Number(total || 0).toLocaleString('id-ID')}`);
    doc.end();
  });
}

async function sendInvoiceEmail({ to, invoiceNumber, customerName, items, total, paymentMethod }) {
  const user = env.gmailUser;
  const pass = env.gmailAppPassword;

  if (!user || !pass) {
    return {
      success: false,
      skipped: true,
      message: 'Gmail credentials belum dikonfigurasi. Invoice dibuat tetapi email belum dikirim.'
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const filePath = await buildInvoicePdf({ invoiceNumber, customerName, items, total, paymentMethod, email: to });

  const mailOptions = {
    from: env.mailFrom || user,
    to,
    subject: `Invoice Pembelian ${env.companyName} #${invoiceNumber}`,
    html: buildInvoiceHtml({ invoiceNumber, customerName, items, total, paymentMethod, email: to }),
    attachments: [
      {
        filename: `${invoiceNumber}.pdf`,
        path: filePath,
        contentType: 'application/pdf'
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, filePath };
}

router.post('/', async (req, res, next) => {
  try {
    const { email, items, total, paymentMethod, customerName } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi untuk mengirim invoice.' });
    }

    const invoiceNumber = `SL-${Date.now().toString().slice(-6)}`;
    const result = await sendInvoiceEmail({
      to: email,
      invoiceNumber,
      customerName: customerName || email.split('@')[0],
      items: Array.isArray(items) ? items : [],
      total: Number(total || 0),
      paymentMethod: paymentMethod || 'Transfer Bank'
    });

    res.json({
      message: result.success ? 'Invoice berhasil dikirim ke email Anda.' : result.message,
      invoiceNumber,
      emailSent: Boolean(result.success),
      emailStatus: result.success ? 'sent' : 'pending'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
