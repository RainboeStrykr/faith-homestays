import {
  Mail,
  Phone,
  MapPin,
  Instagram,
} from "lucide-react";
import {
  FooterBackgroundGradient,
  TextHoverEffect,
} from "../components/ui/hover-footer";

/* ── Data ────────────────────────────────────────────────────────── */

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Our Rooms", href: "#rooms" },
      { label: "Amenities", href: "#amenities" },
      { label: "Gallery", href: "#gallery" },
      { label: "Book Your Stay", href: "https://wa.me/918918803065" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Siliguri Homestay", href: "#" },
      { label: "Gateway to Himalayas", href: "#" },
      { label: "Near Bagdogra Airport", href: "#" },
      { label: "Near NJP Railway Station", href: "#" },
    ],
  },
];

const contactInfo = [
  {
    icon: <Mail size={16} className="text-[#fee600]" />,
    text: "faiththeretreat@gmail.com",
    href: "mailto:faiththeretreat@gmail.com",
  },
  {
    icon: <Phone size={16} className="text-[#fee600]" />,
    text: "+91 94340 45060",
    href: "tel:+919434045060",
  },
  {
    icon: <Phone size={16} className="text-[#fee600]" />,
    text: "+91 89188 03065",
    href: "tel:+918918803065",
  },
  {
    icon: <Instagram size={16} className="text-[#fee600]" />,
    text: "@faith.theretreat",
    href: "https://instagram.com/faith.theretreat",
  },
  {
    icon: <MapPin size={16} className="text-[#fee600]" />,
    text: "Bimal Sinha Sarani, Siliguri, WB 734001",
  },
];

const linkStyle = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.55)",
  textDecoration: "none",
  transition: "color 0.2s ease",
} as const;

/* ── Component ───────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer
      id="contact"
      aria-label="Site footer"
      className="relative h-fit overflow-hidden"
      style={{ backgroundColor: "#0F0F11" }}
    >
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-16"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        {/* ── Top grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <img
              src="/full-size-logo.jpg"
              alt="Faith The Retreat"
              style={{ width: "160px", height: "auto", display: "block", objectFit: "contain" }}
            />
            <p style={{ fontSize: "13px", lineHeight: 1.7 }}>
              A warm, cosy and hygienic homestay in Siliguri — the gateway to
              Sikkim, Bhutan and the Eastern Himalayas. Affordable yet premium,
              always feeling like home.
            </p>
          </div>

          {/* Nav link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4
                style={{
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}
              >
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      style={linkStyle}
                      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#fee600")}
                      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={linkStyle}
                      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#fee600")}
                      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span style={{ fontSize: "13px" }}>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ────────────────────────────────────────────── */}
        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* ── Copyright bar — above the FAITH wordmark ───────────── */}
        <div
          className="flex justify-center items-center py-6"
          style={{ fontSize: "12px" }}
        >
          <p style={{ color: "rgba(255,255,255,0.35)" }}>
            &copy; {new Date().getFullYear()} Faith The Retreat. A Unit of
            Commercial Data Service.
          </p>
        </div>
      </div>

      {/* ── TextHoverEffect wordmark ────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          height: "28rem",
          marginTop: "-9rem",
          marginBottom: "-6rem",
          color: "#ffffff",
        }}
      >
        <TextHoverEffect text="FAITH" className="z-10" />
      </div>

      {/* ── Animated background glow ───────────────────────────── */}
      <FooterBackgroundGradient />
    </footer>
  );
}
