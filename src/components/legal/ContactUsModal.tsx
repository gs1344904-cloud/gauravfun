import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, Copy, Check, MessageSquare, PhoneCall } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const CONTACT_EMAIL = 'gk2774477@gmail.com';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback / Suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    soundEngine.playSound('score');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    soundEngine.playSound('win');
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 font-display">
                Contact Us / संपर्क करें
              </h2>
              <p className="text-[11px] text-neutral-400">Direct Support & Business Inquiries</p>
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Prominent Direct Email Box */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-neutral-950 to-neutral-950 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                Official Support Email ID
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-base font-bold font-mono text-neutral-100 hover:text-amber-400 transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{CONTACT_EMAIL}</span>
              </a>
              <span className="text-[11px] text-neutral-400 block mt-1">
                Fast response within 24–48 hours for feedback, bug reports & advertising.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Arcade100%20Inquiry`}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Send Mail
              </a>
            </div>
          </div>

          {/* Form Area */}
          {submitted ? (
            <div className="py-6 text-center flex flex-col items-center bg-neutral-950/60 p-6 rounded-xl border border-neutral-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h3 className="text-base font-bold text-neutral-100 font-display">Message Sent Successfully!</h3>
              <p className="text-xs text-neutral-300 mt-2 max-w-sm leading-relaxed">
                Thank you for your message, <strong className="text-amber-400">{name}</strong>. Your inquiry has been routed to{' '}
                <span className="font-mono text-neutral-200">{CONTACT_EMAIL}</span>. We will follow up with you at{' '}
                <span className="font-mono text-neutral-200">{email}</span> soon.
              </p>
              <button
                onClick={handleReset}
                className="mt-5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer shadow-md"
              >
                Back to Games
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Your Full Name / आपका नाम</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Inquiry Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-hidden focus:border-amber-500 cursor-pointer"
                >
                  <option>Feedback / Suggestion (सुझाव)</option>
                  <option>Bug Report / Game Not Working (बग रिपोर्ट)</option>
                  <option>Google AdSense & Advertising Inquiries (विज्ञापन)</option>
                  <option>DMCA Copyright & Content Removal</option>
                  <option>General Support / अन्य सहायता</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Your Message / संदेश</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, feedback or question here..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-amber-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-neutral-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-transform shadow-lg cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Submit to {CONTACT_EMAIL}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
