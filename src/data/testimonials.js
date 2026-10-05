// src/data/testimonials.js
// Mock testimonials for landing page

export const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Software Engineer @ Infosys',
    avatar: null,
    rating: 5,
    text: 'InterviewAI helped me crack my dream job at Infosys! The AI feedback was incredibly detailed and helped me identify gaps I never knew I had. Highly recommend!',
    company: 'Infosys',
  },
  {
    id: 2,
    name: 'Karan Mehta',
    role: 'Java Developer @ TCS',
    avatar: null,
    rating: 5,
    text: 'I practiced 30+ mock interviews here before my TCS interview. The Spring Boot questions were spot on. The results analysis is truly premium quality.',
    company: 'TCS',
  },
  {
    id: 3,
    name: 'Sneha Patil',
    role: 'Full Stack Dev @ Wipro',
    avatar: null,
    rating: 4,
    text: 'The HR interview module is amazing. It taught me how to structure my answers using STAR method. Got placed in Wipro within 2 weeks of regular practice!',
    company: 'Wipro',
  },
  {
    id: 4,
    name: 'Arjun Nair',
    role: 'React Developer @ Accenture',
    avatar: null,
    rating: 5,
    text: 'Beautiful interface, smooth experience. The skill-wise score breakdown gave me exactly what I needed to focus on. Best interview prep tool I have used.',
    company: 'Accenture',
  },
  {
    id: 5,
    name: 'Divya Reddy',
    role: 'Backend Engineer @ HCL',
    avatar: null,
    rating: 5,
    text: 'Went from 55% average score to 88% in just 3 weeks. The AI recommendations were like having a personal mentor. Worth every rupee!',
    company: 'HCL',
  },
  {
    id: 6,
    name: 'Rohit Gupta',
    role: 'Java Dev @ Cognizant',
    avatar: null,
    rating: 4,
    text: 'The question variety is excellent. Hard mode Java questions are truly challenging and very relevant to what is asked in actual interviews. Great platform!',
    company: 'Cognizant',
  },
];

// Landing page statistics
export const landingStats = [
  { label: 'Mock Interviews Conducted', value: '50,000+', icon: '🎯' },
  { label: 'Users Placed Successfully',  value: '8,200+',  icon: '🏆' },
  { label: 'Companies Covered',          value: '120+',    icon: '🏢' },
  { label: 'Questions in Bank',          value: '2,500+',  icon: '📚' },
];

// FAQ data
export const faqs = [
  {
    id: 1,
    question: 'Is InterviewAI free to use?',
    answer: 'Yes! Our Free plan gives you 5 mock interviews per month with basic AI feedback. Upgrade to Pro for unlimited interviews and advanced features.',
  },
  {
    id: 2,
    question: 'What roles does InterviewAI support?',
    answer: 'We currently support Java Developer, Java Full Stack, Spring Boot, React Developer, Frontend, Backend, and HR interviews. More roles are being added regularly.',
  },
  {
    id: 3,
    question: 'How is my answer evaluated?',
    answer: 'In Phase 1, we use keyword-based scoring. In the upcoming Phase 3, Google Gemini AI will provide in-depth semantic evaluation and personalized feedback.',
  },
  {
    id: 4,
    question: 'Can I download my interview report?',
    answer: 'Yes, Pro users can download a detailed PDF report of their interview including skill scores, strengths, weaknesses and recommendations.',
  },
  {
    id: 5,
    question: 'Will there be voice and camera support?',
    answer: 'Voice recognition and camera integration are planned for Phase 4. This will enable a more realistic interview simulation experience.',
  },
  {
    id: 6,
    question: 'How do I connect this to Spring Boot later?',
    answer: 'The React frontend is built API-ready with Axios. Simply update the VITE_API_BASE_URL environment variable to point to your Spring Boot backend.',
  },
];
