import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { QuickMenu } from "@/components/site/QuickMenu";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <QuickMenu />
    </div>
  );
}
