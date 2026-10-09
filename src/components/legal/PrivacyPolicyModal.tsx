import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-neutral-100 font-display">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-xs text-neutral-300 space-y-4 leading-relaxed">
          <p className="text-neutral-400">
            Last Updated: September 30, 2026. At Arcade100, accessible from our web application, the privacy of our visitors is one of our primary priorities. This Privacy Policy document outlines the types of information collected and recorded by Arcade100 and how we utilize it.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">1. Information We Collect & Log Files</h3>
          <p>
            Arcade100 follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and click counts. These are not linked to any personally identifiable information.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">2. Cookies and Web Storage</h3>
          <p>
            Like any other modern web application, Arcade100 uses &apos;cookies&apos; and HTML5 LocalStorage to store information including visitors&apos; preferences, high scores, and the pages on the website that the visitor accessed or visited. This information is used to optimize user experience and track in-game progress.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">3. Google DoubleClick DART Cookie & Google AdSense</h3>
          <p>
            Google is one of our third-party advertising vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" className="text-amber-400 underline">https://policies.google.com/technologies/ads</a>.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">4. Third-Party Advertising Partners</h3>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on Arcade100, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize advertising content.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">5. GDPR Data Protection Rights</h3>
          <p>
            Under the General Data Protection Regulation (GDPR), every user is entitled to the right to access, the right to rectification, the right to erasure, the right to restrict processing, and the right to data portability. To exercise any of these rights, please contact us via our Contact Us channel.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">6. CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to request disclosure of categories and specific pieces of personal data collected, request deletion of personal data, and request that a business not sell their personal data. We do not sell any personal data.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">7. Children&apos;s Information (COPPA)</h3>
          <p>
            Arcade100 does not knowingly collect any Personal Identifiable Information from children under the age of 13. All arcade games are designed for safe, non-violent, family-friendly casual browser gaming.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">8. Privacy Contact & Data Protection Officer</h3>
          <p>
            If you have questions, requests to exercise GDPR/CCPA data rights, or need clarification regarding this Privacy Policy, please contact our support team at:
          </p>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-200 mt-2">
            Email: <a href="mailto:gk2774477@gmail.com" className="text-amber-400 underline font-mono">gk2774477@gmail.com</a>
          </div>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">9. Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold rounded-lg text-xs cursor-pointer"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};
