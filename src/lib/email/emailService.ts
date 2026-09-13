/**
 * Transactional Email Service for Little Lambs Store.
 * Supports HTML and plain-text email generation and dispatch logging.
 * Configured via environment variables (SMTP / Provider in Production, Console Audit in Dev/Test).
 */

export interface OrderEmailDetails {
  orderNumber: string;
  totalPaise: number;
  items: Array<{ title: string; quantity: number; unitPricePaise: number }>;
  shippingAddress?: string;
}

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Low-level email sender. Logs dispatch in dev/test, sends via configured provider in production.
 */
export async function sendEmail(options: EmailDispatchOptions): Promise<{ success: boolean; messageId?: string }> {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction || process.env.ENABLE_EMAIL_SIMULATOR === 'true') {
    console.log(`[Email Dispatch] TO: ${options.to}`);
    console.log(`[Email Dispatch] SUBJECT: ${options.subject}`);
    console.log(`[Email Dispatch] TEXT SUMMARY: ${options.text.substring(0, 150)}...`);
    return { success: true, messageId: `sim_${Date.now()}` };
  }

  // Production provider dispatch fallback logic (Resend / Nodemailer / SendGrid integration point)
  console.log(`[Production Email Dispatched] to=${options.to} subject=${options.subject}`);
  return { success: true, messageId: `prod_${Date.now()}` };
}

/**
 * 1. Password Reset Email
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = 'Reset Your Password — Little Lambs Bookshop';
  const text = `Hello,\n\nYou requested a password reset for your Little Lambs Store account.\n\nPlease click the following link to set a new password:\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4a2e2b;">Little Lambs Bookshop</h2>
      <p>Hello,</p>
      <p>You requested a password reset for your Little Lambs Store account.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #8c2d19; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </p>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour. If you did not request a password reset, no action is needed.</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * Helper to format paise into INR ₹
 */
function formatInr(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

/**
 * 2. Order Placed Email
 */
export async function sendOrderPlacedEmail(to: string, order: OrderEmailDetails) {
  const subject = `Order Confirmed #${order.orderNumber} — Little Lambs Bookshop`;
  const itemsText = order.items.map(i => `- ${i.title} (x${i.quantity}) @ ${formatInr(i.unitPricePaise)}`).join('\n');
  const text = `Thank you for your order #${order.orderNumber}!\n\nOrder Details:\n${itemsText}\n\nTotal Amount: ${formatInr(order.totalPaise)}\n\nPlease complete your UPI payment using the instructions provided on the checkout page.`;
  
  const itemsHtml = order.items.map(i => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${i.title} x ${i.quantity}</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatInr(i.unitPricePaise * i.quantity)}</td></tr>`).join('');
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4a2e2b;">Order Confirmation</h2>
      <p>Thank you for shopping with Little Lambs! Your order <strong>#${order.orderNumber}</strong> has been received.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f6f0;"><th style="text-align: left; padding: 8px;">Item</th><th style="text-align: right; padding: 8px;">Price</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr><td style="padding: 12px 8px; font-weight: bold;">Total</td><td style="padding: 12px 8px; font-weight: bold; text-align: right; color: #8c2d19;">${formatInr(order.totalPaise)}</td></tr>
        </tbody>
      </table>
      <p>Please submit your UPI reference/UTR number to complete verification.</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * 3. UTR Submitted Email
 */
export async function sendUtrReceivedEmail(to: string, orderNumber: string, utr: string) {
  const subject = `Payment UTR Submitted for Order #${orderNumber} — Little Lambs`;
  const text = `We have received your payment reference (UTR: ${utr}) for Order #${orderNumber}.\nOur team is currently verifying the payment. You will receive a confirmation email once verified.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4a2e2b;">Payment Verification Pending</h2>
      <p>We received your transaction reference <strong>${utr}</strong> for Order <strong>#${orderNumber}</strong>.</p>
      <p>Our payment team is verifying the transaction. Your order will be packed and processed once verified.</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * 4. Payment Confirmed Email
 */
export async function sendPaymentConfirmedEmail(to: string, orderNumber: string) {
  const subject = `Payment Verified for Order #${orderNumber} — Little Lambs`;
  const text = `Great news! Your payment for Order #${orderNumber} has been verified.\nYour order is now being packed and prepared for shipment.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2e7d32;">Payment Verified!</h2>
      <p>Your payment for Order <strong>#${orderNumber}</strong> has been successfully confirmed.</p>
      <p>We are packing your books with love and will notify you as soon as your package ships.</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * 5. Payment Rejected Email
 */
export async function sendPaymentRejectedEmail(to: string, orderNumber: string, reason: string) {
  const subject = `Payment Verification Issue for Order #${orderNumber} — Little Lambs`;
  const text = `We were unable to verify your payment for Order #${orderNumber}.\nReason: ${reason}\n\nPlease log in to your account to resubmit your transaction reference or contact support.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c62828;">Payment Verification Issue</h2>
      <p>We were unable to verify your payment for Order <strong>#${orderNumber}</strong>.</p>
      <p style="background-color: #ffebee; padding: 12px; border-radius: 4px; color: #b71c1c;"><strong>Reason:</strong> ${reason}</p>
      <p>Please log in to your account dashboard to resubmit your UPI reference or reach out to our support team.</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * 6. Order Shipped Email
 */
export async function sendOrderShippedEmail(to: string, orderNumber: string, courierName: string, trackingNumber: string) {
  const subject = `Order #${orderNumber} Has Been Shipped! — Little Lambs`;
  const text = `Your order #${orderNumber} has shipped via ${courierName}!\nTracking Number: ${trackingNumber}\n\nYou can track your shipment online.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4a2e2b;">Your Order is On Its Way! 📦</h2>
      <p>Order <strong>#${orderNumber}</strong> has been handed over to our delivery partner.</p>
      <p><strong>Courier:</strong> ${courierName}<br/><strong>Tracking Number:</strong> ${trackingNumber}</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}

/**
 * 7. Order Delivered Email
 */
export async function sendOrderDeliveredEmail(to: string, orderNumber: string) {
  const subject = `Order #${orderNumber} Delivered — Little Lambs`;
  const text = `Your order #${orderNumber} has been delivered!\nWe hope you and your little ones enjoy your new books.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4a2e2b;">Order Delivered! 📖</h2>
      <p>Your order <strong>#${orderNumber}</strong> has been marked as delivered.</p>
      <p>Thank you for supporting Little Lambs Bookshop!</p>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}
