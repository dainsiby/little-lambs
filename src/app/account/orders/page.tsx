import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getCustomerOrders } from "@/lib/orders/orderService";
import { PageHero } from "@/components/layout/PageHero";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default async function CustomerOrderHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const orders = await getCustomerOrders(session.user.id);

  return (
    <main id="main-content" className="site-canvas inner-canvas">
      <div className="landing-hero inner-hero-container">
        <PageHero
          title="My Orders"
          subtitle="View and track your Little Lambs purchase history."
          badge="Order History"
        />

        <article className="account-container" style={{ maxWidth: "900px", margin: "0 auto 3rem", padding: "0 1rem" }}>
          <div className="account-card" style={{ background: "#FFFFFF", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#1B2A4A", margin: 0 }}>Order History</h2>
              <Link href="/account" style={{ color: "#8B263E", textDecoration: "none", fontWeight: 600 }}>
                &larr; Back to Account Profile
              </Link>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#718096" }}>
                <p>You haven&apos;t placed any orders yet.</p>
                <Link href="/books" className="primary-cta" style={{ display: "inline-block", marginTop: "1rem", textDecoration: "none" }}>
                  Explore Books
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      padding: "1.25rem",
                      background: "#FFFDF9",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                        <strong style={{ color: "#1B2A4A", fontSize: "1.1rem" }}>{order.orderNumber}</strong>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
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
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            background: "#E2E8F0",
                            color: "#2D3748",
                          }}
                        >
                          Fulfilment: {order.fulfilmentStatus.replace("_", " ")}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#718096", fontSize: "0.85rem" }}>
                        Placed on {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <strong style={{ fontSize: "1.15rem", color: "#8B263E" }}>
                        ₹{(order.totalPaise / 100).toFixed(2)}
                      </strong>

                      <Link
                        href={`/account/orders/${order.orderNumber}`}
                        style={{
                          background: "#8B263E",
                          color: "#FFFFFF",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        View Order Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        <Footer />
      </div>
    </main>
  );
}
