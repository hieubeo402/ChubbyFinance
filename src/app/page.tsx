import Link from 'next/link'
import { Wallet, Shield, PieChart, TrendingUp, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-zinc-950 to-black text-white overflow-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/10">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              ChubbyFinance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98]"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-indigo-300 font-semibold mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Nền tảng quản lý tài chính thế hệ mới
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto bg-gradient-to-b from-white via-slate-100 to-zinc-500 bg-clip-text text-transparent">
          Kiểm soát tài chính <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Thông minh & Tối giản.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Theo dõi thu chi mỗi ngày, quản lý các khoản nợ/cho vay tự động, lập kế hoạch ngân sách hàng tháng và theo dõi trực quan bằng biểu đồ phân tích thông minh.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            Bắt đầu trải nghiệm miễn phí
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto btn-glass font-semibold py-4 px-8 rounded-2xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
          >
            Đăng nhập tài khoản
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {/* Card 1 */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-6 rounded-3xl hover:border-zinc-700/80 transition-colors">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Giao dịch thu chi</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Thêm nhanh các giao dịch thu nhập, lương thưởng và chi phí sinh hoạt hàng ngày chỉ với vài cú click chuột.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-6 rounded-3xl hover:border-zinc-700/80 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Quản lý Nợ & Cho vay</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Theo dõi tiến trình thu hồi hoặc hoàn trả các khoản nợ kèm biểu đồ tròn phần trăm đã thanh toán tự động.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 p-6 rounded-3xl hover:border-zinc-700/80 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Hạn mức & Cảnh báo</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tự động cảnh báo khi chi tiêu chạm ngưỡng 85% hạn mức ngân sách tháng để điều chỉnh hành vi kịp thời.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-slate-500 mt-20">
        &copy; 2026 ChubbyFinance. Thiết kế và phát triển bởi HieuChubby. Bảo lưu mọi quyền.
      </footer>
    </main>
  )
}
