import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Package, Ruler, Shirt, CreditCard, 
  ChevronDown, ChevronUp, ChevronRight, MessageSquare, 
  Mail, Phone, MessageCircle, ShieldCheck, Headphones, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const popularTopics = [
  { id: 'orders', title: 'Orders & Delivery', desc: 'Track orders, delivery status and shipping info', icon: ShoppingBag },
  { id: 'returns', title: 'Returns & Refunds', desc: 'Return items, refund status and policies', icon: Package },
  { id: 'measurements', title: 'Measurements', desc: 'How to add, edit or use measurements', icon: Ruler },
  { id: 'size', title: 'Size & Fit', desc: 'Find your size, fit guide and recommendations', icon: Shirt },
  { id: 'payments', title: 'Payments', desc: 'Payment methods, failed payments and refunds', icon: CreditCard },
];

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can easily track your order in the 'My Orders' section of your account. Click on the 'Track Order' button next to your purchase to see real-time updates."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a hassle-free 7-day return policy for unused items with original tags. You can initiate a return directly from the 'My Orders' tab."
  },
  {
    question: "How do personalized size recommendations work?",
    answer: "Once you save your body measurements in the 'Measurements' tab, our AI engine compares them with garment dimensions to recommend the best size specifically for your body type."
  },
  {
    question: "How do I update my measurements?",
    answer: "Go to the 'Measurements' tab in your account. You can add a new profile or edit an existing one by clicking the edit icon."
  },
  {
    question: "Which payment methods are accepted?",
    answer: "We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and select digital wallets."
  }
];

export default function HelpSupportTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
    }
  };

  const handleAction = (action) => {
    toast.success(`Opening ${action}...`);
  };

  return (
    <div className="w-full flex flex-col gap-8 -mt-4 pb-12">
      
      {/* Top Section: Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1 w-full">
          <h2 className="text-[28px] font-bold text-gray-900 dark:text-[#F5F0E8] mb-2 font-serif">Help & Support</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">Find answers, get support and resolve issues.</p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help topics, orders, or common issues..."
              className="w-full pl-11 pr-24 py-3.5 bg-[#F8F9FA] border border-gray-100 hover:border-purple-200 focus:border-[#3A10E5] rounded-2xl text-sm font-medium transition-colors outline-none"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-[#151515] transition-colors duration-500 border border-purple-100 text-[#3A10E5] hover:bg-purple-50 px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Decorative Illustration (Headset) */}
        <div className="hidden lg:flex w-32 h-32 bg-purple-50 rounded-full shrink-0 items-center justify-center relative">
          <div className="absolute w-24 h-24 bg-white/50 dark:bg-[#151515]/50 transition-colors duration-500 rounded-full animate-ping opacity-20"></div>
          <Headphones size={48} className="text-[#3A10E5]" />
          <MessageSquare size={20} className="absolute top-4 right-4 text-purple-300" />
          <MessageSquare size={16} className="absolute bottom-6 left-6 text-purple-300" />
        </div>
      </div>

      {/* Popular Help Topics (Horizontal Scroll) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8]">Popular Help Topics</h3>
          <button className="text-xs font-bold text-[#3A10E5] hover:underline flex items-center gap-1">
            View all articles <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {popularTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div 
                key={i}
                onClick={() => handleAction(topic.title)}
                className="min-w-[240px] md:min-w-[260px] bg-white dark:bg-[#151515] transition-colors duration-500 border border-gray-100 hover:border-purple-200 rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-sm snap-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#3A10E5] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">{topic.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed min-h-[32px]">{topic.desc}</p>
                </div>
                <div className="flex justify-end mt-auto">
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#3A10E5] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: FAQs & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        {/* FAQs */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8]">Frequently Asked Questions</h3>
          <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-50 last:border-b-0">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className={`text-sm font-semibold pr-4 ${openFaq === i ? 'text-[#3A10E5]' : 'text-gray-900 dark:text-[#F5F0E8]'}`}>
                    {faq.question}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-[#3A10E5] shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-1">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="text-xs font-bold text-[#3A10E5] hover:underline flex items-center gap-1 w-fit mt-2">
            View all FAQs <ChevronRight size={14} />
          </button>
        </div>

        {/* Need More Help? */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8] invisible hidden lg:block">Need More Help?</h3>
          <div className="bg-white dark:bg-[#151515] transition-colors duration-500 rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-[#F5F0E8] mb-1 lg:-mt-2">Need More Help?</h3>
            <p className="text-xs text-gray-500 mb-6">Can't find what you're looking for? Our support team is ready to assist you.</p>
            
            <div className="flex flex-col gap-2 flex-1">
              {[
                { icon: MessageSquare, title: 'Chat with Us', desc: 'Chat live with our support team', text: 'Available 9AM - 9PM' },
                { icon: Mail, title: 'Email Support', desc: "We'll get back to you within 24 hours", text: 'support@vionfashion.com' },
                { icon: Phone, title: 'Call Us', desc: 'Speak with our support team', text: '+91 98765 43210' },
                { icon: MessageCircle, title: 'WhatsApp Support', desc: 'Send us a message', text: '+91 98765 43210' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={i}
                    onClick={() => handleAction(item.title)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-xl transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#3A10E5] flex items-center justify-center shrink-0">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#F5F0E8]">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-gray-600 hidden sm:block">{item.text}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-[#3A10E5]" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Banner */}
      <div className="bg-[#F8F6FF] rounded-2xl p-6 border border-purple-100 flex items-center justify-between relative overflow-hidden mt-2">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-purple-200 text-[#3A10E5] flex items-center justify-center shrink-0 mt-1">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-[#F5F0E8] mb-1">Your satisfaction is our priority</h3>
            <p className="text-xs text-gray-600 font-medium">We're committed to providing you with the best shopping experience.<br/>Let us know how we can help!</p>
          </div>
        </div>
        
        {/* Decorative elements on right */}
        <div className="hidden sm:flex absolute -right-6 -bottom-6 w-32 h-32 bg-purple-100 rounded-full items-center justify-center opacity-50">
          <ShieldCheck size={48} className="text-[#3A10E5] absolute top-6 left-6" />
        </div>
        <Sparkles size={24} className="absolute right-32 top-6 text-purple-300 hidden md:block" />
      </div>

    </div>
  );
}
