import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-arlie-light border-t border-arlie-beige/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div className="space-y-4">
            <span className="font-serif text-2xl tracking-[0.05em]">ARLIE</span>
            <p className="font-sans text-sm leading-relaxed text-arlie-charcoal/60 max-w-xs">
              Modern, zarif ve minimalist takı tasarımları. Sürdürülebilir lüks,
              zamansız zarafet.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/40">
              Keşfet
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/shop", label: "Mağaza" },
                { href: "/about", label: "Hakkımızda" },
                { href: "/shop?category=rings", label: "Yüzükler" },
                { href: "/shop?category=necklaces", label: "Kolyeler" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-arlie-charcoal/60 hover:text-arlie-charcoal transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-arlie-charcoal/40">
              Bilgi
            </h4>
            <div className="flex flex-col gap-3">
              <span className="font-sans text-sm text-arlie-charcoal/60">
                Kargo &amp; İade
              </span>
              <span className="font-sans text-sm text-arlie-charcoal/60">
                Bakım Rehberi
              </span>
              <span className="font-sans text-sm text-arlie-charcoal/60">
                Sürdürülebilirlik
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-arlie-beige/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-arlie-charcoal/40">
            © {new Date().getFullYear()} Arlie. Tüm hakları saklıdır.
          </p>
          <p className="font-sans text-xs text-arlie-charcoal/40">
            Sürdürülebilir lüks, zamansız zarafet.
          </p>
        </div>
      </div>
    </footer>
  );
}
