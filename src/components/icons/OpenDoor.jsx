const OpenDoor = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#F58787"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 2h11a3 3 0 0 1 3 3v14a1 1 0 0 1-1 1h-3"
    />
    <path
      stroke="#F58787"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m5 2 7.588 1.518A3 3 0 0 1 15 6.459V20.78a1 1 0 0 1-1.196.98l-7.196-1.438A2 2 0 0 1 5 18.36V2ZM12 12v2"
    />
  </svg>
)
export default OpenDoor