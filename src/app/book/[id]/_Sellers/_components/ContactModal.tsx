import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "~/components/ui/button";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { Globe, Phone, Instagram, Facebook, Send, X } from "lucide-react";

type SellerListingsWithSeller =
  inferRouterOutputs<AppRouter>["book"]["getSellerListingsByBookId"];

interface ContactModalProps {
  sellerListing: SellerListingsWithSeller[number];
}

export function ContactModal({ sellerListing }: ContactModalProps) {
  const { seller } = sellerListing;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost">Contact</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <Dialog.Title className="text-lg font-semibold">
            Contact {seller.name}
          </Dialog.Title>
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          <div className="grid gap-4 py-4">
            {seller.phoneNumber && (
              <a
                href={`tel:${seller.phoneNumber}`}
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Phone className="h-4 w-4" />
                {seller.phoneNumber}
              </a>
            )}
            {seller.websiteUrl && (
              <a
                href={seller.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Globe className="h-4 w-4" />
                {seller.websiteUrl}
              </a>
            )}
            {seller.instagram && (
              <a
                href={`https://instagram.com/${seller.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Instagram className="h-4 w-4" />
                @{seller.instagram}
              </a>
            )}
            {seller.facebook && (
              <a
                href={`https://facebook.com/${seller.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Facebook className="h-4 w-4" />
                {seller.facebook}
              </a>
            )}
            {seller.telegram && (
              <a
                href={`https://t.me/${seller.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <Send className="h-4 w-4" />
                @{seller.telegram}
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 