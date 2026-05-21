import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Fills the flex main column beside the sidebar — grows when the sidebar collapses.
 * No max-width or mx-auto; padding only via --page-padding-x.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col px-[var(--page-padding-x)]",
        className,
      )}
      data-page-container
    >
      {children}
    </div>
  );
}
