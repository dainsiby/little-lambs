import Metadata from 'next';

export const metadata = {
  title: 'Privacy Policy — Little Lambs Store',
  description: 'Privacy policy for Little Lambs Catholic Children Store.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8 text-[#2C1810]">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#EFEBE4]">
        <h1 className="text-3xl font-serif font-bold text-[#4A2E2B] mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: September 13, 2026</p>

        <div className="space-y-6 text-base leading-relaxed text-gray-700 font-sans">
          <div className="bg-[#FFF9E6] border-l-4 border-[#D97706] p-4 rounded-r text-sm text-[#92400E]">
            <strong>Note for Store Owner:</strong> Please review and update all marked bracketed fields 
            (<span className="font-semibold">[Business Owner Action Required]</span>) with your registered legal entity details before launching live transactions.
          </div>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">1. Information We Collect</h2>
            <p>
              When you create an account, place an order, or interact with Little Lambs Store, we collect information necessary to fulfill your purchases and provide customer service:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Full Name and Email Address</li>
              <li>Delivery Address and Contact Phone Number</li>
              <li>Order History and Payment Verification Records (e.g. UPI Reference / UTR numbers)</li>
              <li>Account credentials (encrypted password hashes)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">2. Legal Entity & Business Information</h2>
            <div className="bg-[#F8F6F0] p-4 rounded-lg border border-[#EFEBE4]">
              <p><strong>Registered Business Name:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: Enter Registered Entity Name]</span></p>
              <p><strong>GSTIN / Business Registration:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: Enter GSTIN / Registration Number]</span></p>
              <p><strong>Registered Address:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: Enter Complete Business Address]</span></p>
              <p><strong>Official Contact Email:</strong> <span className="text-[#8C2D19]">[Business Owner Action Required: Enter Support Email]</span></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">3. How We Use Your Data</h2>
            <p>
              We process your personal information strictly for legitimate business purposes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Processing, packing, and delivering your book orders.</li>
              <li>Verifying manual UPI payment transactions against order totals.</li>
              <li>Sending transactional email updates regarding your order status.</li>
              <li>Preventing fraudulent orders and maintaining server security.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">4. Data Storage & Security</h2>
            <p>
              We employ industry-standard encryption, password hashing (Argon2id/Bcrypt), role-based database permissions, and HTTPS encryption. We never store plain-text passwords or financial PINs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">5. Data Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties. We share data only with logistics partners required to deliver your parcel and cloud infrastructure providers hosting our application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-[#4A2E2B] mb-3">6. Contact Us</h2>
            <p>
              For privacy inquiries or data removal requests, please contact our Data Officer at <span className="text-[#8C2D19]">[Business Owner Action Required: support@littlelambsstore.in]</span>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
