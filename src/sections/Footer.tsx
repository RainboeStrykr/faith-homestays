export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #000000',
        padding: '80px clamp(20px, 4vw, 60px) 0',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Top: Office Info */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '80px',
        }}
      >
        <OfficeColumn
          city="Siliguri"
          cityEn="WEST BENGAL"
          address="Bimal Sinha Sarani, Siliguri, West Bengal 734001, India"
          coords="26.7271° N, 88.3953° E"
          timezone="UTC+5:30"
        />
        <OfficeColumn
          city="Location"
          cityEn="NEARBY"
          address="Gateway to Sikkim, Bhutan & the Seven Sisters of Eastern India. Close to Bagdogra Airport and NJP Railway Station."
          coords="Strategic location"
          timezone="Hill station access"
        />
        <OfficeColumn
          city="Contact"
          cityEn="REACH US"
          address="Available 24/7 for bookings and inquiries. Connect via phone, email or WhatsApp."
          coords="+91 94340 45060"
          timezone="+91 89188 03065"
        />
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              color: '#000000',
              marginBottom: '20px',
            }}
          >
            CONTACT
          </p>
          <p style={{ fontSize: '14px', color: '#666666', lineHeight: 2 }}>
            faiththeretreat@gmail.com
            <br />
            +91 94340 45060
            <br />
            +91 89188 03065
            <br />
            <span style={{ fontSize: '12px', color: '#999', marginTop: '8px', display: 'block' }}>
              Instagram: @faith.theretreat
            </span>
          </p>
        </div>
      </div>

      {/* Bottom: Giant Wordmark */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0.85,
          paddingBottom: '0',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(80px, 18vw, 320px)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            color: '#000000',
            whiteSpace: 'nowrap',
            transform: 'translateY(15%)',
            userSelect: 'none',
          }}
        >
          FAITH
        </span>
      </div>

      {/* Copyright bar */}
      <div
        style={{
          borderTop: '1px solid #e5e5e5',
          padding: '20px clamp(20px, 4vw, 60px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#999999',
            letterSpacing: '0.05em',
          }}
        >
          &copy; {new Date().getFullYear()} Faith The Retreat. A Unit of Commercial Data Service.
        </p>
        <p
          style={{
            fontSize: '12px',
            color: '#999999',
            letterSpacing: '0.05em',
          }}
        >
          Designed with care for every traveller.
        </p>
      </div>
    </footer>
  )
}

function OfficeColumn({
  city,
  cityEn,
  address,
  coords,
  timezone,
}: {
  city: string
  cityEn: string
  address: string
  coords: string
  timezone: string
}) {
  return (
    <div>
      <p
        style={{
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: '#000000',
          marginBottom: '20px',
        }}
      >
        {cityEn}
      </p>
      <p style={{ fontSize: '16px', fontWeight: 500, color: '#000000', marginBottom: '8px' }}>
        {city}
      </p>
      <p
        style={{
          fontSize: '14px',
          color: '#666666',
          lineHeight: 1.6,
          marginBottom: '12px',
          maxWidth: '260px',
        }}
      >
        {address}
      </p>
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.05em',
          color: '#666666',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {coords}
        <br />
        {timezone}
      </p>
    </div>
  )
}
