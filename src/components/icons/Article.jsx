const Article = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={33}
    fill="none"
    {...props}
  >
    <path
      strokeMiterlimit={10}
      strokeWidth={1.25}
      d="M25.5 26.625h-18c-1.7 0-3-1.3-3-3v-17h18v7"
    />
    <path
      strokeMiterlimit={10}
      strokeWidth={1.25}
      d="M25.5 26.625c-1.7 0-3-1.3-3-3v-10h6v10c0 1.7-1.3 3-3 3ZM18.5 10.625h-10v3h10v-3ZM7.5 16.625h5M14.5 16.625h5M7.5 19.625h5M14.5 19.625h5M7.5 22.625h5M14.5 22.625h5"
    />
  </svg>
)
export default Article
