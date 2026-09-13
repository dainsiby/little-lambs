import { auth } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders/orderService";
import { generateUpiPaymentUri, getUpiCredentials } from "@/lib/payment/upi";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { UtrForm } from "./UtrForm";

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderNumber } = await params;
  const order = await getOrderByNumber(session.user.id, orderNumber);

  // Strict ownership protection: if order doesn't exist or belong to this user, 404
  if (!order) {
    notFound();
  }

  const upiUri = generateUpiPaymentUri({
    orderNumber: order.orderNumber,
    amountPaise: order.totalPaise,
  });

  const { vpa, payeeName } = getUpiCredentials();
  const latestPayment = order.payments[0];

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title={`Order ${order.orderNumber}`}
          subtitle={`Placed on ${new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
          badge="Order Details"
        />

        <article className="account-container" style={{ maxWidth: "900px", margin: "0 auto 3rem", padding: "0 1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <Link href="/account/orders" style={{ color: "#8B263E", textDecoration: "none", fontWeight: 600 }}>
              &larr; Back to Order History
            </Link>
          </div>

          <div className="account-card" style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "1.5rem" }}>
            {/* Status Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EDF2F7", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ color: "#1B2A4A", margin: 0, fontSize: "1.35rem" }}>
                  Order {order.orderNumber}
                </h2>
                <p style={{ margin: "0.25rem 0 0", color: "#718096", fontSize: "0.85rem" }}>
                  Ref ID: {order.id}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    padding: "0.35rem 0.65rem",
                    borderRadius: "6px",
                    background:
                      order.paymentStatus === "PAID"
                        ? "#C6F6D5"
                        : order.paymentStatus === "VERIFICATION_PENDING"
                        ? "#FEFCBF"
                        : "#FED7D7",
                    color:
                      order.paymentStatus === "PAID"
                        ? "#22543D"
                        : order.paymentStatus === "VERIFICATION_PENDING"
                        ? "#744210"
                        : "#742A2A",
                  }}
                >
                  Payment: {order.paymentStatus.replace("_", " ")}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    padding: "0.35rem 0.65rem",
                    borderRadius: "6px",
                    background: "#E2E8F0",
                    color: "#2D3748",
                  }}
                >
                  Fulfilment: {order.fulfilmentStatus.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Delivery Address Snapshot */}
            {order.addressSnapshot && (
              <div style={{ background: "#FFFDF9", border: "1px solid #F6AD55", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#1B2A4A", fontSize: "1rem", margin: "0 0 0.5rem" }}>Delivery Address Snapshot</h3>
                <p style={{ margin: 0, color: "#2D3748", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  <strong>{order.addressSnapshot.fullName}</strong> ({order.addressSnapshot.phone})<br />
                  {order.addressSnapshot.addressLine1}
                  {order.addressSnapshot.addressLine2 ? `, ${order.addressSnapshot.addressLine2}` : ""}<br />
                  {order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.postalCode}, {order.addressSnapshot.country}
                </p>
              </div>
            )}

            {/* Shipment & Tracking Details */}
            {order.trackingNumber && (
              <div style={{ background: "#EBF8FF", border: "1px solid #90CDF4", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#2B6CB0", fontSize: "1rem", margin: "0 0 0.5rem" }}>📦 Shipment Tracking Information</h3>
                <div style={{ fontSize: "0.9rem", color: "#2D3748", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div><strong>Carrier:</strong> {order.shippingCarrier || "Postal Express"}</div>
                  <div>
                    <strong>Tracking Number / AWB:</strong>{" "}
                    <code style={{ background: "#FFFFFF", padding: "0.15rem 0.4rem", borderRadius: "4px", fontWeight: 700 }}>
                      {order.trackingNumber}
                    </code>
                  </div>
                  {order.shippedAt && (
                    <div style={{ fontSize: "0.8rem", color: "#718096", marginTop: "0.25rem" }}>
                      Dispatched on {new Date(order.shippedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div style={{ fontSize: "0.85rem", color: "#2F855A", fontWeight: 700, marginTop: "0.25rem" }}>
                      ✓ Delivered on {new Date(order.deliveredAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items Snapshots */}
            <h3 style={{ color: "#1B2A4A", fontSize: "1.1rem", marginBottom: "1rem" }}>Ordered Items</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EDF2F7", paddingBottom: "0.75rem" }}
                >
                  <div>
                    <h4 style={{ margin: 0, color: "#1B2A4A" }}>{item.titleSnapshot}</h4>
                    <p style={{ margin: "0.25rem 0 0", color: "#718096", fontSize: "0.85rem" }}>
                      SKU: {item.skuSnapshot} • Qty: {item.quantity} × ₹{(item.unitPricePaise / 100).toFixed(2)}
                    </p>
                  </div>
                  <strong style={{ color: "#1B2A4A" }}>
                    ₹{(item.lineTotalPaise / 100).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div style={{ borderTop: "2px solid #E2E8F0", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", width: "260px", marginLeft: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#4A5568" }}>
                <span>Subtotal</span>
                <span>₹{(order.subtotalPaise / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#4A5568" }}>
                <span>Shipping</span>
                <span>{order.shippingPaise === 0 ? "FREE" : `₹${(order.shippingPaise / 100).toFixed(2)}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: 700, color: "#8B263E", borderTop: "1px solid #CBD5E0", paddingTop: "0.5rem" }}>
                <span>Total</span>
                <span>₹{(order.totalPaise / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Manual UPI Payment Section */}
          <div className="account-card" style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ color: "#1B2A4A", margin: "0 0 1rem", fontSize: "1.2rem" }}>Payment Details & Instructions</h3>

            {order.paymentStatus === "PAID" ? (
              <div style={{ background: "#F0FFF4", border: "1px solid #9AE6B4", padding: "1.25rem", borderRadius: "8px", color: "#22543D" }}>
                <h4 style={{ margin: "0 0 0.5rem" }}>✓ Payment Verified & Confirmed</h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Thank you! Your payment of ₹{(order.totalPaise / 100).toFixed(2)} has been verified. Your order is being processed for dispatch.
                </p>
                {latestPayment?.utrReference && (
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#2F855A" }}>
                    Verified UTR: <strong>{latestPayment.utrReference}</strong>
                  </p>
                )}
              </div>
            ) : order.paymentStatus === "VERIFICATION_PENDING" ? (
              <div style={{ background: "#FEFCBF", border: "1px solid #F6AD55", padding: "1.25rem", borderRadius: "8px", color: "#744210" }}>
                <h4 style={{ margin: "0 0 0.5rem" }}>⏳ Payment Verification Pending</h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Your payment evidence has been submitted and is currently being verified by our finance team. Your stock reservation is locked.
                </p>
                {latestPayment?.utrReference && (
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#975A16" }}>
                    Submitted UTR Reference: <strong>{latestPayment.utrReference}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div style={{ background: "#FFFDF9", border: "1px solid #E2E8F0", padding: "1.25rem", borderRadius: "8px" }}>
                <h4 style={{ color: "#1B2A4A", margin: "0 0 0.75rem" }}>Pay via Manual UPI QR</h4>
                <p style={{ color: "#4A5568", fontSize: "0.9rem", margin: "0 0 1rem" }}>
                  Please scan the UPI QR code below using Google Pay, PhonePe, Paytm, or BHIM, or transfer to the UPI ID:
                </p>

                <div style={{ background: "#EDF2F7", padding: "1rem", borderRadius: "8px", display: "inline-block", marginBottom: "1rem" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#2D3748" }}>
                    <strong>Payee Name:</strong> {payeeName}<br />
                    <strong>UPI VPA ID:</strong> <code style={{ background: "#FFFFFF", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>{vpa}</code><br />
                    <strong>Exact Amount:</strong> <strong style={{ color: "#8B263E" }}>₹{(order.totalPaise / 100).toFixed(2)}</strong><br />
                    <strong>Payment Note:</strong> Order {order.orderNumber}
                  </p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <a
                    href={upiUri}
                    style={{
                      background: "#8B263E",
                      color: "#FFFFFF",
                      padding: "0.6rem 1.25rem",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: 600,
                      display: "inline-block",
                      fontSize: "0.9rem",
                    }}
                  >
                    Open in UPI App
                  </a>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #E2E8F0", margin: "1.5rem 0" }} />

                <h4 style={{ color: "#1B2A4A", margin: "0 0 0.5rem" }}>Submit Transaction Reference (UTR)</h4>
                <p style={{ color: "#718096", fontSize: "0.85rem", margin: 0 }}>
                  After completing the UPI transfer, enter the 12-digit UPI reference / UTR number from your payment app receipt below to notify us.
                </p>

                <UtrForm orderNumber={order.orderNumber} />
              </div>
            )}
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
