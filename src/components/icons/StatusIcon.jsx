export default function StatusIcon({ className }) {
    return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Light green circle background */}
      <circle cx="30" cy="30" r="30" fill="#D1F08E" fillOpacity="0.7" />

      {/* Clock icon for status/waiting */}
      <circle cx="30" cy="30" r="15" fill="white" stroke="#308203" strokeWidth="1.5" />

      {/* Clock hands */}
      <line x1="30" y1="30" x2="30" y2="22" stroke="#308203" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="30" x2="36" y2="33" stroke="#308203" strokeWidth="1.5" strokeLinecap="round" />

      {/* Yellow checkmark */}
      <circle cx="42" cy="42" r="8" fill="#FFCE31" />
      <path d="M38 42L41 45L46 40" stroke="#308203" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

