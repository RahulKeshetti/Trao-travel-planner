import { Link } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <span className="eyebrow">Boarding pass · issued by an AI travel agent</span>
        <h1>
          Tell us where.
          <br />
          We'll plan the days.
        </h1>
        <p className="landing-sub">
          Trao turns a destination, a budget and a few interests into a full
          day-by-day itinerary, an estimated cost breakdown, and a shortlist of
          hotels — then lets you reshuffle it until it actually fits your trip.
        </p>
        <div className="landing-cta">
          <Link to="/register" className="btn btn-accent">
            Plan my first trip
          </Link>
          <Link to="/login" className="btn btn-ghost">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="landing-stub" aria-hidden="true">
        <div className="stub-card">
          <div className="stub-row">
            <span className="eyebrow">Destination</span>
            <span className="stub-value">Tokyo, Japan</span>
          </div>
          <div className="stub-row">
            <span className="eyebrow">Duration</span>
            <span className="stub-value">5 days</span>
          </div>
          <div className="stub-perforation" />
          <div className="stub-row">
            <span className="eyebrow">Day 01</span>
            <span className="stub-value">Senso-ji Temple · Asakusa street food</span>
          </div>
          <div className="stub-row">
            <span className="eyebrow">Day 02</span>
            <span className="stub-value">Tokyo Skytree · Akihabara shopping</span>
          </div>
        </div>
      </section>
    </main>
  )
}
