"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SideCart from "@/components/cart/SideCart";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

function ProfileMenuItem({ icon, label, description, href, onClick }: MenuItemProps) {
  const content = (
    <div className="flex items-center gap-4 p-4 rounded-sm border border-arlie-light hover:border-arlie-beige hover:bg-arlie-light/50 transition-all duration-300 group cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-arlie-light flex items-center justify-center flex-shrink-0 group-hover:bg-arlie-beige/50 transition-colors duration-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium">{label}</p>
        <p className="font-sans text-xs text-arlie-charcoal/40 mt-0.5">
          {description}
        </p>
      </div>
      <ChevronRight
        size={16}
        strokeWidth={1.5}
        className="text-arlie-charcoal/20 group-hover:text-arlie-charcoal/50 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
      />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <button onClick={onClick} className="w-full text-left">{content}</button>;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist">("overview");

  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">
        <div className="px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20 max-w-4xl mx-auto">
          {/* Header */}
          <AnimatedSection className="mb-10 md:mb-14">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-arlie-charcoal/40 mb-3">
              Hesabım
            </p>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight">
              Profil
            </h1>
          </AnimatedSection>

          {/* Profile Card */}
          <AnimatedSection delay={0.1} className="mb-10 md:mb-14">
            <div className="bg-arlie-beige/30 rounded-sm p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-arlie-light border border-arlie-beige flex items-center justify-center flex-shrink-0">
                <User size={28} strokeWidth={1.2} className="text-arlie-charcoal/30" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-xl md:text-2xl">Hoş Geldiniz</h2>
                <p className="font-sans text-sm text-arlie-charcoal/50 mt-1">
                  Hesabınıza giriş yaparak siparişlerinizi takip edebilir, favorilerinizi yönetebilirsiniz.
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-initial px-6 py-2.5 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300 cursor-pointer">
                  Giriş Yap
                </button>
                <button className="flex-1 sm:flex-initial px-6 py-2.5 border border-arlie-charcoal text-arlie-charcoal font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal hover:text-arlie-white transition-all duration-300 cursor-pointer">
                  Kayıt Ol
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <AnimatedSection delay={0.15} className="mb-8">
            <div className="flex gap-6 border-b border-arlie-light">
              {[
                { key: "overview", label: "Genel Bakış" },
                { key: "orders", label: "Siparişlerim" },
                { key: "wishlist", label: "Favorilerim" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`pb-3 font-sans text-xs uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer relative ${
                    activeTab === tab.key
                      ? "text-arlie-charcoal"
                      : "text-arlie-charcoal/40 hover:text-arlie-charcoal/60"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="profile-tab"
                      className="absolute bottom-0 left-0 right-0 h-px bg-arlie-charcoal"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Tab Content */}
          <AnimatedSection delay={0.2}>
            {activeTab === "overview" && (
              <div className="space-y-3">
                <ProfileMenuItem
                  icon={<Package size={18} strokeWidth={1.5} className="text-arlie-charcoal/50" />}
                  label="Siparişlerim"
                  description="Sipariş geçmişi ve kargo takibi"
                  href="#"
                />
                <ProfileMenuItem
                  icon={<Heart size={18} strokeWidth={1.5} className="text-arlie-charcoal/50" />}
                  label="Favorilerim"
                  description="Beğendiğiniz ürünleri kaydedin"
                  href="#"
                />
                <ProfileMenuItem
                  icon={<MapPin size={18} strokeWidth={1.5} className="text-arlie-charcoal/50" />}
                  label="Adreslerim"
                  description="Teslimat adreslerini yönetin"
                  href="#"
                />
                <ProfileMenuItem
                  icon={<ShoppingBag size={18} strokeWidth={1.5} className="text-arlie-charcoal/50" />}
                  label="Sepetim"
                  description="Sepetinizdeki ürünleri görüntüleyin"
                  href="#"
                />
                <ProfileMenuItem
                  icon={<Settings size={18} strokeWidth={1.5} className="text-arlie-charcoal/50" />}
                  label="Ayarlar"
                  description="Hesap ayarları ve bildirimler"
                  href="#"
                />
                <ProfileMenuItem
                  icon={<LogOut size={18} strokeWidth={1.5} className="text-arlie-charcoal/50" />}
                  label="Çıkış Yap"
                  description="Hesabınızdan güvenli çıkış"
                  onClick={() => {}}
                />
              </div>
            )}

            {activeTab === "orders" && (
              <div className="text-center py-16">
                <Package size={40} strokeWidth={1} className="text-arlie-charcoal/15 mx-auto mb-4" />
                <p className="font-sans text-arlie-charcoal/50 mb-2">
                  Henüz siparişiniz bulunmuyor
                </p>
                <p className="font-sans text-xs text-arlie-charcoal/30 mb-6">
                  Koleksiyonumuzu keşfederek ilk siparişinizi oluşturun
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300"
                >
                  Mağazaya Git
                </Link>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="text-center py-16">
                <Heart size={40} strokeWidth={1} className="text-arlie-charcoal/15 mx-auto mb-4" />
                <p className="font-sans text-arlie-charcoal/50 mb-2">
                  Favori listeniz boş
                </p>
                <p className="font-sans text-xs text-arlie-charcoal/30 mb-6">
                  Beğendiğiniz ürünleri kalp ikonuna tıklayarak kaydedin
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-3 bg-arlie-charcoal text-arlie-white font-sans text-xs uppercase tracking-[0.15em] font-medium hover:bg-arlie-charcoal/90 transition-colors duration-300"
                >
                  Keşfetmeye Başla
                </Link>
              </div>
            )}
          </AnimatedSection>
        </div>
      </main>
      <Footer />
      <SideCart />
    </>
  );
}
