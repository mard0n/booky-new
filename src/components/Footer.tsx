import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-card px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-lg">Booky</span>
        <span className="text-muted-foreground">Some description</span>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="w-3 h-3 rounded-full border border-muted-foreground mx-0.5 inline-block bg-muted" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[100px]">English ▼</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Русский</DropdownMenuItem>
            <DropdownMenuItem>Oʻzbekcha</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </footer>
  );
} 