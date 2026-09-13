export const metadata = {
  title: 'Terms of Service — Little Lambs Store',
  description: 'Terms and conditions for purchasing from Little Lambs Children Bookshop.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 text-[#2C1810]">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#EFEBE4]">
        <h1 className="text-3xl font-serif font-bold text-[#4A2E2B] mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 13, 2026</p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700 font-sans">
          <div className="bg-[#FFF9E6] border-l-4 border-[#D97706] p-4 rounded-r text-sm text-[#92400E]">
            <strong>Note for Store Owner:</strong> Review and verify jurisdiction, legal entity details, and terms (<span className="font-semibold">[Business Owner Action Required]</span>).
          </div>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">1. Overview</h2>
            <p>
              Welcome to Little Lambs Store. By creating an account or completing a purchase, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">2. Pricing & Payments</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>All book prices are stated in Indian Rupees (INR ₹) inclusive of applicable taxes.</li>
              <li>Payments are processed via manual UPI QR transfers. Orders remain pending until your UTR/Reference number is submitted and verified by our admin team.</li>
              <li>Stock is reserved upon checkout for 24 hours. Unverified orders automatically expire after this window.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">3. Business Identity</h2>
            <div className="bg-[#F8F6F0] p-4 rounded-lg border border-[#EFEBE4]">
              <p><strong>Legal Entity:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: Enter Business Entity]</span></p>
              <p><strong>Jurisdiction:</strong> Courts of <span className="text-[#8C2D19]">[Business Owner Action Required: Enter City / State]</span>, India.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">4. Intellectual Property</h2>
            <p>
              All original illustrations, logos, book descriptions, and website branding belong to Little Lambs / Atma Books / Pavanatma Publishers and are protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">5. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
