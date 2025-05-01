'use client';
import { QRCodeCanvas } from 'qrcode.react';

export const QrCodeImage = ({ value }: { value: string }) => (
  <QRCodeCanvas value={value} marginSize={4} />
);
