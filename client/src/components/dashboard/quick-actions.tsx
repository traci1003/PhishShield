import { Link } from "wouter";
import { Search, History } from "lucide-react";

export default function QuickActions() {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        <Link href="/scan">
          <a className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary-50 p-3 mb-2">
              <span className="material-icons text-primary-600">search</span>
            </div>
            <h3 className="font-medium text-gray-900">Scan Message</h3>
            <p className="text-xs text-gray-500 text-center mt-1">Check texts, emails or links</p>
          </a>
        </Link>

        <Link href="/history">
          <a className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary-50 p-3 mb-2">
              <span className="material-icons text-primary-600">history</span>
            </div>
            <h3 className="font-medium text-gray-900">View History</h3>
            <p className="text-xs text-gray-500 text-center mt-1">See previous detections</p>
          </a>
        </Link>
      </div>
    </section>
  );
}
