import { Logo } from "./navbar";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-card px-8 pt-8 pb-16">
      <div className="flex flex-col items-start gap-1">
        <Logo />
        <span className="text-muted-foreground">Sevimli kitoblarni topish endi yanada oson</span>
        <span className="text-muted-foreground text-xs">❤️ bilan yaratildi</span>
      </div>
    </footer>
  );
} 