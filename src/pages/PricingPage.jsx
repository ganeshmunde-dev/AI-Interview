// src/pages/PricingPage.jsx
import { motion } from 'framer-motion';
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { PLANS } from '@/constants/appConstants';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial="hidden" animate="show" variants={fadeUp}
          className="text-center mb-16">
          <span className="badge badge-primary mb-4">Pricing</span>
          <h1 className="text-4xl md:text-5xl font-bold text-app-primary mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-app-secondary max-w-xl mx-auto text-lg">
            Start for free, upgrade when you need more. No hidden fees.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl p-8 flex flex-col
                ${plan.popular
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-500/30'
                  : 'glass-card'}`}>

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${plan.popular ? 'text-white' : 'text-app-primary'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-black ${plan.popular ? 'text-white' : 'gradient-text'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm mb-1 ${plan.popular ? 'text-white/70' : 'text-app-muted'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm
                    ${plan.popular ? 'text-white/90' : 'text-app-secondary'}`}>
                    <HiOutlineCheck className={plan.popular ? 'text-white' : 'text-indigo-500'} size={16} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/register"
                className={`w-full py-3 rounded-xl font-semibold text-center transition-all block
                  ${plan.popular
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'btn-outline'}`}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-20 text-center">
          <p className="text-app-secondary mb-2">Have questions about pricing?</p>
          <Link to="/contact" className="text-indigo-500 hover:text-indigo-400 font-semibold">
            Contact our team →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
