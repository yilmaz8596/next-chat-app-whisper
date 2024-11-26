import Image from "next/image";
import logo from "@/public/logo.svg";

type LoadingLogoProps = {
  size?: number;
};

export default function LoadingLogo({ size = 100 }: LoadingLogoProps) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Image
        src={logo}
        alt="Logo"
        width={size}
        height={size}
        className="animate-pulse duration-800"
      />
    </div>
  );
}
