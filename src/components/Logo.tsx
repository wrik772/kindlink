"use client";

import Image from "next/image";
import { useState } from "react";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

export default function Logo({ width = 80, height = 20, className }: LogoProps) {
  const [src, setSrc] = useState("/logo.png");
  const [failedOnce, setFailedOnce] = useState(false);

  return (
    failedOnce ? (
      <span className={className} style={{ fontWeight: 700 }}>
        KindLink
      </span>
    ) : (
      <Image
        src={src}
        alt="KindLink logo"
        width={width}
        height={height}
        className={className}
        onError={() => {
          if (src === "/logo.png") {
            setSrc("/logo.svg");
          } else {
            setFailedOnce(true);
          }
        }}
        priority
      />
    )
  );
}


