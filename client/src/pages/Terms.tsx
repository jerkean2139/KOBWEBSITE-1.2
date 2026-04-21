import Navigation from "@/components/Navigation";

export default function Terms() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/70 text-lg mb-8">Last updated: December 2024</p>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/70">
                By accessing and using the Kean on Biz website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Services Description</h2>
              <p className="text-white/70">
                Kean on Biz provides business coaching, consulting, and automation services. Our services include but are not limited to one-on-one coaching sessions, digital marketing solutions, and technology ecosystem implementation.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
              <p className="text-white/70">
                You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of any account information and for all activities under your account.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
              <p className="text-white/70">
                All content, including text, graphics, logos, and software, is the property of Kean on Biz and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
              <p className="text-white/70">
                Kean on Biz shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the services.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Modifications</h2>
              <p className="text-white/70">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
              <p className="text-white/70">
                For questions about these Terms, please contact us at{" "}
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
