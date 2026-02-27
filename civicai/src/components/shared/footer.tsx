import { Globe } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full bg-[#1e293b] text-slate-300 mt-auto border-t-4 border-[#0A3251]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-700 pb-8">
                    <div className="md:col-span-2">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                            <Globe className="w-5 h-5 mr-2" />
                            SewaSetu
                        </h3>
                        <p className="text-sm leading-relaxed max-w-md">
                            A national AI-driven initiative for transparent, escalated, and resolved civic infrastructure faults under standard operating procedures defined by the Ministry of Electronics & IT.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-amber-400 transition-colors">Digital India</a></li>
                            <li><a href="#" className="hover:text-amber-400 transition-colors">National Portal of India</a></li>
                            <li><a href="#" className="hover:text-amber-400 transition-colors">MyGov</a></li>
                            <li><a href="#" className="hover:text-amber-400 transition-colors">SLA Guidelines</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Policies</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-amber-400 transition-colors">Website Policies</a></li>
                            <li><a href="#" className="hover:text-amber-400 transition-colors">Help</a></li>
                            <li><a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-amber-400 transition-colors">Feedback</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
                    <p className="mb-4 md:mb-0 text-center md:text-left">
                        Website belongs to Ministry of Electronics & Information Technology, <br className="hidden md:block" />
                        Government of India
                    </p>
                    <div className="text-center md:text-right">
                        <p className="font-medium text-slate-300">Site is designed, developed and hosted by</p>
                        <p className="text-amber-400 font-bold tracking-wide mt-1">National Informatics Centre (NIC)</p>
                        <p className="mt-2 text-[10px]">Last Updated: 12-Nov-2026</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
