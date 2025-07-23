export default function OrderIcon({ className }) {
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Light green circle background */}
        <circle cx="30" cy="30" r="30" fill="#D1F08E" fillOpacity="0.7" />
        
        {/* Document/list */}
        <rect x="17" y="15" width="26" height="30" rx="2" fill="white" stroke="#308203" strokeWidth="1.5" />
        
        {/* Green lines */}
        <line x1="22" y1="22" x2="38" y2="22" stroke="#308203" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="27" x2="38" y2="27" stroke="#308203" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="32" x2="38" y2="32" stroke="#308203" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="37" x2="38" y2="37" stroke="#308203" strokeWidth="2" strokeLinecap="round" />
        
        {/* Orange pencil */}
        <g transform="translate(35, 35) rotate(-45)">
          <rect x="0" y="0" width="4" height="12" fill="#FF8736" />
          <path d="M0 0L4 0L2 -4L0 0Z" fill="#FF8736" />
          <rect x="0" y="12" width="4" height="2" fill="#C96C2A" />
        </g>
      </svg>
    );
  }
  