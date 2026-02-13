import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Contact Us</h1>
          <p className="text-stone-600">Get in touch with us for any inquiries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Your message..."></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-stone-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1">Email</h3>
                    <p className="text-stone-600">support@saraswathconnect.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📞</div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1">Phone</h3>
                    <p className="text-stone-600">+91 98625 42210</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1">Address</h3>
                    <p className="text-stone-600">
                      Temple Trust Office,
                      <br />
                      Karnataka, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1">Working Hours</h3>
                    <p className="text-stone-600">
                      Monday - Sunday
                      <br />
                      6:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-teal-600 to-teal-800 rounded-lg shadow-md p-8 text-white">
              <h3 className="text-xl font-bold mb-3">Need Immediate Assistance?</h3>
              <p className="mb-4">Call our 24/7 helpline</p>
              <a
                href="tel:+919862542210"
                className="inline-block bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-stone-50 transition">
                Call Now
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
