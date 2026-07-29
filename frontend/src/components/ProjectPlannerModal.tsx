import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { addLead } from '../utils/db';

interface PlannerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

export const ProjectPlannerModal = ({ isOpen, onClose, initialCategory = '' }: PlannerProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    category: initialCategory || 'Web Development',
    budget: '₹2,000 – ₹10,000',
    timeline: '1-3 months',
    description: '',
    name: '',
    email: '',
    whatsapp: '',
    company: ''
  });

  // Sync category state if set externally
  useState(() => {
    if (initialCategory) {
      setFormData(prev => ({ ...prev, category: initialCategory }));
    }
  });

  const categories = [
    'Web Development',
    'Mobile Apps',
    'AI & Machine Learning',
    'UI/UX Design',
    'General Inquiry'
  ];

  const budgets = [
    '₹2,000 – ₹10,000',
    '₹10,000 – ₹50,000',
    '₹50,000 – ₹2,00,000',
    '₹2,00,000 – ₹10,00,000',
    '₹10,00,000+'
  ];

  const timelines = [
    '< 1 month',
    '1-3 months',
    '3-6 months',
    '6+ months'
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      addLead(formData);
      setStep(5); // Show success screen
    } catch (err) {
      console.error('Submission failed:', err);
      // Fallback local success even if backend is offline to prevent broken UI
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      category: 'Web Development',
      budget: '₹2,000 – ₹10,000',
      timeline: '1-3 months',
      description: '',
      name: '',
      email: '',
      whatsapp: '',
      company: ''
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 500); // Reset form after close animation completes
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
          {/* Modal Backdrop click */}
          <div className="absolute inset-0" onClick={handleClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="glass-card max-w-2xl w-full p-6 md:p-12 rounded-3xl relative border border-white/10 shadow-[0_0_80px_rgba(59,130,246,0.15)] flex flex-col justify-between min-h-[500px] max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white hover-target p-2 rounded-full hover:bg-white/10 transition-all cursor-none z-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header progress info */}
            {step < 5 && (
              <div className="mb-8 pr-12">
                <span className="text-xs uppercase tracking-[0.2em] text-blue-500 font-semibold mb-1 block">
                  Project Planner &bull; Step {step} of 4
                </span>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Main Step Content */}
            <div className="flex-grow flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold font-heading mb-6 text-white text-left">
                      What specialization are we targeting?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`p-4 rounded-2xl border text-left font-medium transition-all duration-300 hover-target cursor-none ${
                            formData.category === cat
                              ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold font-heading mb-6 text-white text-left">
                      Define the scope of budget & timeline.
                    </h3>
                    <div className="mb-6">
                      <span className="text-xs uppercase tracking-wider text-gray-500 block mb-3">Estimated Budget</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {budgets.map((b) => (
                          <button
                            key={b}
                            onClick={() => setFormData({ ...formData, budget: b })}
                            className={`p-3 text-center rounded-xl border text-sm font-medium transition-all duration-300 hover-target cursor-none ${
                              formData.budget === b
                                ? 'border-purple-500 bg-purple-500/10 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 block mb-3">Target Launch Timeline</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {timelines.map((t) => (
                          <button
                            key={t}
                            onClick={() => setFormData({ ...formData, timeline: t })}
                            className={`p-3 text-center rounded-xl border text-sm font-medium transition-all duration-300 hover-target cursor-none ${
                              formData.timeline === t
                                ? 'border-purple-500 bg-purple-500/10 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-white text-left">
                      Briefly describe the vision.
                    </h3>
                    <p className="text-sm text-gray-400 mb-6 text-left">
                      Detail what you want us to design or engineer (key integrations, requirements, or issues you are addressing).
                    </p>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Type details here..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors hover-target"
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold font-heading mb-6 text-white text-left">
                      Who should we connect with?
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500 block mb-2 text-left">Your Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 transition-colors hover-target"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-2 text-left">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. john@company.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 transition-colors hover-target"
                          />
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label className="text-xs text-gray-500 block mb-2 text-left flex items-center gap-1.5">
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-emerald-400" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp Number *
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3.5 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm select-none">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            required
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            placeholder="98765 43210"
                            className="flex-1 bg-white/5 border border-white/10 rounded-r-xl p-3.5 text-white focus:outline-none focus:border-emerald-500 transition-colors hover-target"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-2 text-left">Company Name (Optional)</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Acme Corp"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 transition-colors hover-target"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold font-heading mb-3 text-white">
                      Inquiry Captured!
                    </h3>
                    <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-8">
                      Thank you, <span className="text-white font-medium">{formData.name}</span>. We've successfully registered your project request under the <span className="text-blue-400 font-semibold">{formData.category}</span> category. Our lead consultant will reach you on WhatsApp (<span className="text-emerald-400 font-medium">+91 {formData.whatsapp}</span>) or via email shortly.
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300 hover-target shadow-lg cursor-none"
                    >
                      Return to Workspace
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons footer */}
            {step < 5 && (
              <div className="flex items-center justify-between mt-12 border-t border-white/5 pt-6">
                {step > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors group hover-target cursor-none"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={step === 3 && !formData.description}
                    className="group relative px-6 py-3.5 bg-white text-black text-sm font-semibold rounded-full overflow-hidden hover-target transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-none"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email || !formData.whatsapp || formData.whatsapp.length < 10 || isSubmitting}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full overflow-hidden hover-target transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-none shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Submit Project Plan
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
