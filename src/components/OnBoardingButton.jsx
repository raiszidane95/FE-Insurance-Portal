
export default function OnboardingButton({
  className,
  onClick,
  text,
}) {
  return (
    <div>
      <button className={className} onClick={onClick}>
        {text || "Text"}
      </button>
    </div>
  )
}