import Navigation from "@/components/Navigation";

export default function Privacy() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/70 text-lg mb-8">Last updated: December 2024</p>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-white/70 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Name and contact information when you book a call or fill out forms</li>
                <li>Email address when you subscribe to our newsletter</li>
                <li>Business information relevant to our coaching services</li>
                <li>Payment information when you purchase services</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-white/70 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you newsletters and marketing communications (with your consent)</li>
                <li>Process transactions and send related information</li>
                <li>Respond to your comments, questions, and requests</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="text-white/70">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-white/70">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking</h2>
              <p className="text-white/70">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
              <p className="text-white/70">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="text-white/70 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-white/70 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p className="text-white/70">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:support@keanonbiz.com" className="text-primary hover:underline">
                  support@keanonbiz.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
