"use client";

import { useLenis } from "@studio-freight/react-lenis";

type AnchorLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function AnchorLink({
  href,
  onClick,
  children,
  ...props
}: AnchorLinkProps) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href?.startsWith("#")) {
      if (lenis) {
        e.preventDefault();
        lenis.scrollTo(href, { offset: 0 });
      }
    }
    onClick?.(e);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
