// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { APP_NAME } from '@/constants/appConstants';

const LINKS = {
  Product:  [{ l: 'Features', p: '/#features' }, { l: 'Pricing', p: '/pricing' }, { l: 'How It Works', p: '/#how-it-works' }],
  Company:  [{ l: 'About', p: '/about' }, { l: 'Contact', p: '/contact' }, { l: 'Blog', p: '#' }],
  Legal:    [{ l: 'Privacy Policy', p: '#' }, { l: 'Terms of Service', p: '#' }],
};

export default function Footer() {
  return (
    <footer className="border-t border-app" style={{ background: 'rgb(var(--bg-surface))' }}>
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
              <span className="gradient-text font-bold text-xl">{APP_NAME}</span>
            </div>
            <p className="text-app-secondary text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered mock interview platform helping developers crack their dream jobs with intelligent feedback and analysis.
            </p>
            <div className="flex items-center gap-4">
              {[{ icon: FaGithub, href: '#' }, { icon: FaLinkedin, href: '#' }, { icon: FaTwitter, href: '#' }].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-lg bg-muted-app flex items-center justify-center text-app-secondary hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-app-primary mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {items.map(({ l, p }) => (
                  <li key={l}>
                    <Link to={p} className="text-sm text-app-secondary hover:text-indigo-500 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mt-12" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-app-muted">© 2026 {APP_NAME}. Built with ❤️ for developers.</p>
          <div className="flex items-center gap-4 text-xs text-app-muted">
            <span className="flex items-center gap-1"><HiOutlineMail size={12} /> support@interviewai.dev</span>
            <span className="flex items-center gap-1"><HiOutlineLocationMarker size={12} /> Pune, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
