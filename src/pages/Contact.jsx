import { useState } from "react";
import emailjs from "@emailjs/browser";


export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    setLoading(true);

emailjs.send(
  "service_e0q1m9r",
  "template_nxm4prh",
  {
    name: form.name,
    email: form.email,
    phone: form.phone,
    subject: form.subject,
    message: form.message,
  },
  import.meta.env.VITE_EMAILJS_PUBLIC
)
      .then(
        () => {
          alert("Message sent successfully!");
          setForm({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.error(error);
          alert("Failed to send message");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <h1>
          {/* <span className="contact-tag">
            CONTACT <span style={{ color: "rgba(210, 254, 135, 1)" }}>US</span>
          </span> */}
        </h1>
        <h1>
          We're Here to <span>Help You</span>
        </h1>
        <p style={{color:"white"}}>
          Have questions about our services? Need assistance with your account?
          Our dedicated team is available 24/7 to help you.
        </p>
      </section>

      {/* INFO CARDS */}
      <section className="contact-info">
        <div className="info-card">
          <h3>📞 Phone Support</h3>
          <p style={{color:"white"}}>1800-VAJRA-BANK (Toll Free)</p>
          <p style={{color:"white"}}>+91 22 4567 8900</p>
        </div>

        <div className="info-card">
          <h3>✉️ Email Us</h3>
          <p style={{color:"white"}}>support@vajrabank.com</p>
          <p style={{color:"white"}}>corporate@vajrabank.com</p>
        </div>

        <div className="info-card">
          <h3>📍 Head Office</h3>
          <p style={{color:"white"}}>KPHB colony, BKC</p>
          <p style={{color:"white"}}>Hyderabad, Telangana 500001</p>
        </div>

        <div className="info-card">
          <h3 style={{color:"white"}}>⏰ Working Hours</h3>
          <p style={{color:"white"}}>Mon - Sat: 9:00 AM - 6:00 PM</p>
          <p style={{color:"white"}}>24/7 Phone Banking</p>
        </div>
      </section>

      {/* FORM + SUPPORT */}
      <section className="contact-main">
        {/* FORM */}
        <div className="contact-form">
          <h2>Send us a Message</h2>
          <p>Fill out the form below and we'll get back to you.</p>

          <form onSubmit={sendMessage}>
            <div className="form-grid">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                <option>Account Issue</option>
                <option>Loan Query</option>
                <option>Card Support</option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder="How can we help you?"
              value={form.message}
              onChange={handleChange}
              required
            />

            <button className="send-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message ➜"}
            </button>
          </form>
        </div>

        {/* QUICK SUPPORT */}
        <div className="quick-support">
          <div className="support-card dark">
            <h3 style={{color:"white"}}>🎧 24/7 Phone Banking</h3>
            <p style={{color:"white"}}>
              Get instant assistance for account queries, transactions, and more.
            </p>
            <strong>1800-VAJRA-BANK</strong>
          </div>

<div className="support-card">
  <h3 style={{color:"white"}}>💬 Live Chat Support</h3>
  <p style={{color:"white"}}>Chat with our support team in real time.</p>

  <a
    href="https://wa.me/916300608164?text=Hi%20VajraBank%20Support,%20I%20need%20assistance"
    target="_blank"
    rel="noreferrer"
    className="chat-btn"
  >
    Start Chat ➜
  </a>
</div>


          <div className="support-card">
            <h3 style={{color:"white"}}>🏦 Visit a Branch</h3>
            <p style={{color:"white"}}>Find your nearest VajraBank branch.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
