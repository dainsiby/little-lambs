export const metadata = {
  title: 'Refund & Cancellation Policy — Little Lambs Store',
  description: 'Refund, return, and cancellation terms for Little Lambs Children Bookshop.',
};

export default function RefundCancellationPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 text-[#2C1810]">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#EFEBE4]">
        <h1 className="text-3xl font-serif font-bold text-[#4A2E2B] mb-6">Refund & Cancellation Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 13, 2026</p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700 font-sans">
          <div className="bg-[#FFF9E6] border-l-4 border-[#D97706] p-4 rounded-r text-sm text-[#92400E]">
            <strong>Note for Store Owner:</strong> Please verify return windows and refund processing timeline (<span className="font-semibold">[Business Owner Action Required]</span>).
          </div>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">1. Order Cancellations</h2>
            <p>
              Orders can be cancelled before payment verification or dispatch. Once an order has been marked as shipped, cancellations are no longer accepted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">2. Damaged or Defective Items</h2>
            <p>
              If your books arrive damaged, misprinted, or defective, please contact us within <span className="text-[#8C2D19]">[Business Owner Action Required: 7 days]</span> of delivery with photos/videos of the package and items.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">3. Refund Processing</h2>
            <div className="bg-[#F8F6F0] p-4 rounded-lg border border-[#EFEBE4]">
              <p><strong>Refund Method:</strong> Approved refunds are credited directly back to the original UPI bank account used for payment.</p>
              <p><strong>Timeline:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: 5 to 7 business days]</span> following inspection and approval.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">4. Customer Support</h2>
            <p>
              For refund inquiries, reach out to our team at <span className="text-[#8C2D19]">[Business Owner Action Required: support@littlelambsstore.in]</span> with your Order Number.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
