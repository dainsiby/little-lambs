export interface UpiParams {
  orderNumber: string;
  amountPaise: number;
}

export function getUpiCredentials() {
  const vpa = process.env.UPI_VPA || 'littlelambs@upi';
  const payeeName = process.env.UPI_PAYEE_NAME || 'Little Lambs Store';
  return { vpa, payeeName };
}

export function generateUpiPaymentUri({ orderNumber, amountPaise }: UpiParams): string {
  const { vpa, payeeName } = getUpiCredentials();
  const amountRupees = (amountPaise / 100).toFixed(2);
  const note = `Order ${orderNumber}`;

  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: amountRupees,
    cu: 'INR',
    tn: note,
  });

  return `upi://pay?${params.toString()}`;
}
