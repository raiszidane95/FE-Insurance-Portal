const StackedCards = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={168}
    height={161}
    fill="none"
    {...props}
  >
    <rect
      width={130}
      height={100}
      y={117.82}
      fill="url(#a)"
      rx={10}
      transform="rotate(-65 0 117.82)"
    />
    <rect
      width={120}
      height={80}
      x={26}
      y={92.853}
      fill="url(#b)"
      rx={10}
      transform="rotate(-45 26 92.853)"
    />
    <defs>
      <linearGradient
        id="a"
        x1={0}
        x2={140.84}
        y1={217.82}
        y2={156.072}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.245} stopColor="#D1F08E" />
        <stop offset={0.85} stopColor="#71B845" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={26}
        x2={149.413}
        y1={172.853}
        y2={110.421}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.245} stopColor="#D1F08E" />
        <stop offset={0.85} stopColor="#71B845" />
      </linearGradient>
    </defs>
  </svg>
)
export default StackedCards
