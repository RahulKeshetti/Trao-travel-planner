export default function HotelSuggestions({ hotels }) {
  if (!hotels || hotels.length === 0) return null

  return (
    <section className="hotel-section">
      <h3>Recommended hotels</h3>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div className="hotel-tag card" key={hotel.id}>
            <div className="hotel-tag-hole" aria-hidden="true" />
            <span className="hotel-tier">{hotel.tier}</span>
            <h4 className="hotel-name">{hotel.name}</h4>
            <div className="hotel-meta">
              <span>{hotel.priceHint}</span>
              <span>★ {hotel.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
