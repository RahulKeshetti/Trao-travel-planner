export default function BudgetSummary({ budget }) {
  if (!budget) return null

  return (
    <aside className="card receipt">
      <div className="receipt-perf" />
      <h3 className="receipt-title">Estimated Budget</h3>
      <ul className="receipt-lines">
        {budget.breakdown.map((line) => (
          <li key={line.label} className="receipt-line">
            <span>{line.label}</span>
            <span className="receipt-dots" aria-hidden="true" />
            <span>${line.amount}</span>
          </li>
        ))}
      </ul>
      <div className="receipt-total">
        <span>Total</span>
        <span>${budget.total}</span>
      </div>
      <div className="receipt-perf" />
      <p className="receipt-footnote">Estimate only — actual prices vary by season and availability.</p>
    </aside>
  )
}
