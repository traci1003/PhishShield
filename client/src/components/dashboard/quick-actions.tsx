import { Link } from "wouter";
import { Search, History, Shield, User } from "lucide-react";

export default function QuickActions() {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col items-center justify-center border-pulse">
          <Link href="/scan" className="flex flex-col items-center justify-center w-full">
            <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-3 mb-3 shadow-inner group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Search className="h-6 w-6 text-indigo-600 group-hover:text-white relative z-10 transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900">Scan Message</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Check texts, emails or links</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col items-center justify-center">
          <Link href="/history" className="flex flex-col items-center justify-center w-full">
            <div className="rounded-full bg-gradient-to-br from-purple-100 to-pink-100 p-3 mb-3 shadow-inner group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <History className="h-6 w-6 text-purple-600 group-hover:text-white relative z-10 transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900">View History</h3>
            <p className="text-xs text-gray-500 text-center mt-1">See previous detections</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col items-center justify-center mt-2">
          <Link href="/settings" className="flex flex-col items-center justify-center w-full">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-3 mb-3 shadow-inner group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Shield className="h-6 w-6 text-blue-600 group-hover:text-white relative z-10 transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900">Protection</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Manage security features</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col items-center justify-center mt-2">
          <Link href="/account" className="flex flex-col items-center justify-center w-full">
            <div className="rounded-full bg-gradient-to-br from-fuchsia-100 to-rose-100 p-3 mb-3 shadow-inner group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <User className="h-6 w-6 text-fuchsia-600 group-hover:text-white relative z-10 transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-gray-900">My Account</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Manage your subscription</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
