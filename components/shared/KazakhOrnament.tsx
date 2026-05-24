interface KazakhOrnamentProps {
  className?: string
}

export default function KazakhOrnament({ className = '' }: KazakhOrnamentProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 12H46" stroke="currentColor" strokeWidth="2" />
      <path d="M194 12H240" stroke="currentColor" strokeWidth="2" />
      <path
        d="M63 12C63 5.925 67.925 1 74 1H86V7H75C72.239 7 70 9.239 70 12C70 14.761 72.239 17 75 17H88V23H74C67.925 23 63 18.075 63 12Z"
        fill="currentColor"
      />
      <path
        d="M177 12C177 18.075 172.075 23 166 23H154V17H165C167.761 17 170 14.761 170 12C170 9.239 167.761 7 165 7H152V1H166C172.075 1 177 5.925 177 12Z"
        fill="currentColor"
      />
      <path d="M92 4H113L104 12L113 20H92L101 12L92 4Z" fill="currentColor" />
      <path d="M127 4H148L139 12L148 20H127L136 12L127 4Z" fill="currentColor" />
      <path d="M118 2H122V22H118V2Z" fill="currentColor" />
    </svg>
  )
}
