import Link from 'next/link'
import { Wallet, Shield, PieChart, TrendingUp, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-slate-800 overflow-hidden relative selection:bg-[#5D3FD3]/10 selection:text-[#5D3FD3]">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#5D3FD3]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-[#36D7B7]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#5D3FD3] rounded-xl flex items-center justify-center shadow-md shadow-[#5D3FD3]/10">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              ChubbyFinance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-[#5D3FD3] hover:text-[#4A2EBF] transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold bg-[#5D3FD3] hover:bg-[#4A2EBF] text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#5D3FD3]/10 hover:shadow-[#5D3FD3]/20 active:scale-[0.96]"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#5D3FD3]/8 border border-[#5D3FD3]/15 text-xs text-[#5D3FD3] font-bold mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#36D7B7] animate-pulse" />
          Nền tảng quản lý tài chính thế hệ mới
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
          Kiểm soát tài chính <br />
          <span className="text-[#5D3FD3]">
            Thông minh & Tối giản.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-655 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Theo dõi thu chi mỗi ngày, quản lý các khoản nợ/cho vay tự động, lập kế hoạch ngân sách hàng tháng và theo dõi trực quan bằng biểu đồ phân tích thông minh.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#5D3FD3] hover:bg-[#4A2EBF] text-white font-extrabold py-4 px-8 rounded-2xl shadow-xl shadow-[#5D3FD3]/15 active:scale-[0.96] transition-all cursor-pointer text-sm"
          >
            Bắt đầu trải nghiệm miễn phí
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border-2 border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#5D3FD3]/5 font-extrabold py-4 px-8 rounded-2xl active:scale-[0.96] transition-all cursor-pointer flex items-center justify-center text-sm"
          >
            Đăng nhập tài khoản
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {/* Card 1 */}
          <div className="bg-[#F4F4F5] border border-zinc-200/60 p-6 rounded-3xl hover:border-zinc-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-[#5D3FD3]/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#5D3FD3]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Giao dịch thu chi</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Thêm nhanh các giao dịch thu nhập, lương thưởng và chi phí sinh hoạt hàng ngày chỉ với vài cú click chuột.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F4F4F5] border border-zinc-200/60 p-6 rounded-3xl hover:border-zinc-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-[#5D3FD3]/10 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#5D3FD3]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Quản lý Nợ & Cho vay</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Theo dõi tiến trình thu hồi hoặc hoàn trả các khoản nợ kèm biểu đồ tròn phần trăm đã thanh toán tự động.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F4F4F5] border border-zinc-200/60 p-6 rounded-3xl hover:border-zinc-300 transition-all shadow-sm">
            <div className="w-12 h-12 bg-[#5D3FD3]/10 rounded-2xl flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-[#5D3FD3]" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Hạn mức & Cảnh báo</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Tự động cảnh báo khi chi tiêu chạm ngưỡng 85% hạn mức ngân sách tháng để điều chỉnh hành vi kịp thời.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-500 mt-20 font-medium">
        &copy; 2026 ChubbyFinance. Thiết kế và phát triển bởi HieuChubby. Bảo lưu mọi quyền.
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
