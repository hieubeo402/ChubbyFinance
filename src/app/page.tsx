import Link from 'next/link'
import { PiggyBank, Shield, PieChart, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF6F8] text-slate-800 overflow-hidden relative selection:bg-[#ec4899]/10 selection:text-[#ec4899]">
      {/* Decorative liquid glowing blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-pink-500/8 blur-[130px] pointer-events-none select-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/5 blur-[130px] pointer-events-none select-none" />

      {/* Navigation Header */}
      <header className="border-b border-rose-100/50 bg-white/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-rose-100/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#ec4899] to-[#f43f5e] rounded-xl flex items-center justify-center shadow-md shadow-[#ec4899]/20 hover:scale-105 transition-transform duration-300">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-0.5">
              ChubbyFinance <span>🐷</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-[#ec4899] hover:text-[#be185d] transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold bg-[#ec4899] hover:bg-[#be185d] text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#ec4899]/10 hover:shadow-[#ec4899]/20 active:scale-[0.96]"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#ec4899]/8 border border-[#ec4899]/15 text-xs text-[#ec4899] font-bold mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-rose-450 animate-pulse" />
          Nền tảng quản lý tài chính Heo Đất thế hệ mới
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
          Kiểm soát tài chính <br />
          <span className="text-gradient">
            Thông minh & Tối giản.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-semibold">
          Theo dõi thu chi mỗi ngày, nuôi heo đất tiết kiệm, tự động hóa các khoản nợ/cho vay và trực quan hóa tài chính bằng các biểu đồ xinh xắn.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ec4899] hover:bg-[#be185d] text-white font-extrabold py-4 px-8 rounded-2xl shadow-xl shadow-[#ec4899]/15 active:scale-[0.96] transition-all cursor-pointer text-sm"
          >
            Bắt đầu trải nghiệm miễn phí
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border-2 border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/5 font-extrabold py-4 px-8 rounded-2xl active:scale-[0.96] transition-all cursor-pointer flex items-center justify-center text-sm"
          >
            Đăng nhập tài khoản
          </Link>
        </div>

        {/* Feature Grid with Premium Liquid Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {/* Card 1 */}
          <div className="glass-card border border-white/40 p-6 rounded-3xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 bg-[#ec4899]/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#ec4899]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Giao dịch thu chi</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Thêm nhanh các giao dịch thu nhập, lương thưởng và chi phí sinh hoạt hàng ngày chỉ với vài cú click chuột.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card border border-white/40 p-6 rounded-3xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 bg-[#ec4899]/10 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#ec4899]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Quản lý Nợ & Cho vay</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Theo dõi tiến trình thu hồi hoặc hoàn trả các khoản nợ kèm biểu đồ tròn phần trăm đã thanh toán tự động.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card border border-white/40 p-6 rounded-3xl hover:scale-[1.02] hover:border-pink-200 transition-all duration-300 shadow-sm">
            <div className="w-12 h-12 bg-[#ec4899]/10 rounded-2xl flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-[#ec4899]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Hạn mức & Cảnh báo</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Tự động cảnh báo khi chi tiêu chạm ngưỡng 85% hạn mức ngân sách tháng để điều chỉnh hành vi kịp thời.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-100/50 py-8 text-center text-xs text-slate-500 mt-20 font-medium">
        &copy; 2026 ChubbyFinance 🐷. Thiết kế và phát triển bởi HieuChubby với phong cách Liquid Glass. Bảo lưu mọi quyền.
      </footer>
    </main>
  )
}

// Inline helper for arrow icon to avoid importing ArrowRight
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}
