import Link from 'next/link'
import LogoImg from '@/public/optimized-images/logo.svg'

export default function Logo() {
  return (
    <Link className="inline-flex" href="/" aria-label="Corvos Tecnologia ">
      <img className="max-w-none" src={LogoImg.src} width={50} height={50} alt="Corvos Tecnologia " />
    </Link>
  )
}