import Image from 'next/image';

export default function Logo({ w, h }: { w: number; h: number }) {
  return (
    <Image
      src={'/assets/logo.png'}
      alt={'Librairie Logo'}
      width={w}
      height={h}
      priority={true}
    />
  );
}
