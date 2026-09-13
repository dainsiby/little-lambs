export const metadata = {
  title: 'Shipping Policy — Little Lambs Store',
  description: 'Delivery timelines, shipping charges, and tracking policy for Little Lambs Store.',
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 text-[#2C1810]">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#EFEBE4]">
        <h1 className="text-3xl font-serif font-bold text-[#4A2E2B] mb-6">Shipping & Delivery Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 13, 2026</p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700 font-sans">
          <div className="bg-[#FFF9E6] border-l-4 border-[#D97706] p-4 rounded-r text-sm text-[#92400E]">
            <strong>Note for Store Owner:</strong> Confirm your courier partners and estimated delivery days (<span className="font-semibold">[Business Owner Action Required]</span>).
          </div>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">1. Shipping Destinations</h2>
            <p>
              We currently ship physical book orders across India using reputed courier and postal services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">2. Processing & Dispatch Timelines</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Orders are processed after UPI payment verification.</li>
              <li>Standard Dispatch: 1 to 2 business days after payment confirmation.</li>
              <li>Estimated Delivery Time: 4 to 7 business days depending on location.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">3. Logistics Partners & Tracking</h2>
            <div className="bg-[#F8F6F0] p-4 rounded-lg border border-[#EFEBE4]">
              <p><strong>Primary Logistics Partners:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: India Post / India Speed Post / ST Courier / Delhivery]</span></p>
              <p><strong>Tracking Details:</strong> Tracking link and AWB numbers are emailed automatically once dispatch is logged by our admin team.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">4. Shipping Rates</h2>
            <p>
              Shipping fees are calculated server-side based on weight and destination state, displayed clearly before order placement.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
