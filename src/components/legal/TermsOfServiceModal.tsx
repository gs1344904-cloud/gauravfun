import React from 'react';
import { X, Scale, Shield, Mail } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const CONTACT_EMAIL = 'gk2774477@gmail.com';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 font-display">
                Terms and Conditions / नियम और शर्तें
              </h2>
              <p className="text-[11px] text-neutral-400">User Agreement & Free Game License</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-xs text-neutral-300 space-y-4 leading-relaxed flex-1">
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-neutral-400">
            <span>Effective Date: September 30, 2026</span>
            <span>Support: <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 underline font-mono">{CONTACT_EMAIL}</a></span>
          </div>

          <p className="text-neutral-300">
            Welcome to Arcade100. By accessing or playing any of our 100 browser-based casual and arcade games, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue using the service.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">1. Free Recreational Use License</h3>
          <p>
            Arcade100 grants users a non-exclusive, non-transferable, revocable license to access, view, and play our 100 free online games solely for personal, non-commercial entertainment purposes. You may not distribute, duplicate, sell, or exploit any game source code, images, or audio elements for commercial profit without prior written consent.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">2. User Conduct & Fair Play Rules</h3>
          <p>
            To maintain fair play and an enjoyable gaming environment for all players across mobile and desktop devices, users agree:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400">
            <li>Not to employ automated bots, autoclickers, script injectors, or memory-editing software to manipulate scores.</li>
            <li>Not to launch denial of service attacks, scrape site assets, or inject malicious payloads.</li>
            <li>Not to obstruct, hide, or artificially simulate clicks on third-party advertisements.</li>
          </ul>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">3. Third-Party Advertising & Google AdSense Policy</h3>
          <p>
            Arcade100 is supported by legitimate web advertising networks including Google AdSense. Users acknowledge that third-party ad vendors may serve contextual and personalized advertisements based on non-personally identifiable browsing patterns. Any automated or incentivized clicking on advertisements is strictly forbidden under our terms and publisher agreements.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">4. Intellectual Property & DMCA Copyright Notice</h3>
          <p>
            All game mechanics, original retro artwork, custom Web Audio synthesis scripts, UI designs, and trademarks displayed on Arcade100 are the intellectual property of Arcade100 and respective contributors. If you believe any game material infringes upon your copyright, please submit an official DMCA takedown notice with evidence to our designated copyright agent at <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 underline font-mono">{CONTACT_EMAIL}</a>. We respond to and process verified notices promptly.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">5. Disclaimer of Warranties</h3>
          <p>
            The games, services, and content on Arcade100 are provided on an &apos;as is&apos; and &apos;as available&apos; basis without warranties of any kind, whether express or implied. Arcade100 makes no guarantees that game execution will be 100% bug-free, continuous, or compatible with obsolete legacy browser configurations.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">6. Limitation of Liability</h3>
          <p>
            Under no circumstances shall Arcade100, its developers, operators, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to play games hosted on our website.
          </p>

          <h3 className="text-sm font-bold text-neutral-100 font-display mt-4">7. Changes to Terms & Contact Information</h3>
          <p>
            We reserve the right to revise or update these Terms and Conditions periodically. Continued use of Arcade100 following changes constitutes acceptance. For inquiries concerning these terms, contact us directly at:
          </p>
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-200">
            <strong>Arcade100 Legal & Support Administration</strong><br />
            Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 underline font-mono">{CONTACT_EMAIL}</a><br />
            Website: Arcade100 Free Online Games Portal
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">Official Terms & Conditions Agreement</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer shadow-md"
          >
            I Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};
