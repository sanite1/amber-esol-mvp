// ─── Interfaces ─────────────────────────────────────────────────────

export interface BlogSection {
  subheading: string;
  body: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  featured?: boolean;
  content: BlogSection[];
}

// ─── Category Config ────────────────────────────────────────────────

export const categoryConfig: Record<string, { bg: string; text: string }> = {
  "Language Learning": { bg: "bg-blue-50", text: "text-blue-600" },
  "Teaching Tips": { bg: "bg-emerald-50", text: "text-emerald-600" },
  "Platform Updates": { bg: "bg-[#ff7c22]/10", text: "text-[#ff7c22]" },
  "Student Success": { bg: "bg-purple-50", text: "text-purple-600" },
  "Tutor Guides": { bg: "bg-amber-50", text: "text-amber-600" },
  "Study Abroad": { bg: "bg-rose-50", text: "text-rose-600" },
};

// ─── Blog Data ──────────────────────────────────────────────────────

export const blogData: BlogPost[] = [
  {
    id: 1,
    title: "How to Get the Most Out of Your Online Language Lessons",
    slug: "how-to-get-the-most-out-of-your-online-language-lessons",
    excerpt:
      "Online language lessons are flexible and powerful, but only if you approach them the right way. Here are proven strategies to maximise every session.",
    image: "/images/blog/online-lessons.jpg",
    category: "Language Learning",
    date: "Feb 10, 2026",
    author: "Amber Training Team",
    authorRole: "Product Team",
    readTime: "7 min read",
    featured: true,
    content: [
      {
        subheading: "Introduction",
        body: `Learning a language online has become one of the most accessible and effective ways to build fluency. Whether you're preparing for an exam, advancing your career, or simply exploring a new culture, online lessons offer unmatched flexibility. But flexibility alone doesn't guarantee results, the way you prepare, engage, and follow up after each session determines how fast you progress.

In this guide, we'll walk you through practical strategies that can help you squeeze every drop of value from your online language lessons.`,
      },
      {
        subheading: "Set Clear Goals Before Each Lesson",
        body: `One of the biggest mistakes students make is showing up to a lesson without a clear objective. Before each session, take five minutes to think about what you want to achieve. Do you want to practise speaking about a specific topic? Work on grammar? Improve your listening skills?

When your tutor knows your goal for the session, they can tailor the lesson to your needs. This turns a generic lesson into a focused, high-impact learning experience. Even writing down a single sentence like "Today I want to practise talking about my job in English" can make a huge difference.`,
      },
      {
        subheading: "Create a Distraction-Free Environment",
        body: `Your learning environment matters more than you think. A noisy room, constant phone notifications, or a cluttered desk can break your focus and reduce what you retain from a lesson.

Find a quiet spot, close unnecessary tabs on your computer, put your phone on silent, and let the people around you know you're in a lesson. Treat it with the same respect you'd give a face-to-face class. The more present you are, the more you'll absorb.`,
      },
      {
        subheading: "Speak More Than You Listen",
        body: `It's tempting to let your tutor do most of the talking, especially if you're a beginner. But real progress comes from active participation. Push yourself to speak as much as possible, even if you make mistakes.

Your tutor is there to guide and correct you, that's the whole point. Every error you make and correct is a step forward. Ask your tutor to give you more speaking time if you feel the balance isn't right. A good lesson should feel like a conversation, not a lecture.`,
      },
      {
        subheading: "Review and Practise Between Lessons",
        body: `Lessons are just one piece of the puzzle. What you do between sessions is equally important. After each lesson, spend ten to fifteen minutes reviewing what you learned. Write down new vocabulary, practise sentences, or record yourself speaking.

Many students also benefit from keeping a simple language journal where they jot down phrases, corrections, or topics they want to revisit. Consistent small efforts between lessons compound into massive progress over time.`,
      },
      {
        subheading: "Build a Relationship with Your Tutor",
        body: `The best learning happens when you feel comfortable with your tutor. Don't be afraid to share your interests, challenges, and learning style. The more your tutor knows about you, the better they can personalise your lessons.

If something isn't working, a particular teaching method, topic, or pace, communicate that. Great tutors welcome feedback because it helps them help you. Think of your tutor as a partner in your learning journey, not just an instructor.`,
      },
      {
        subheading: "Conclusion",
        body: `Online language lessons are one of the best investments you can make in your personal and professional growth. By setting clear goals, minimising distractions, speaking actively, reviewing consistently, and building a strong relationship with your tutor, you'll accelerate your progress and enjoy the journey.

Remember: it's not about how many lessons you take, it's about how much you put into each one.`,
      },
    ],
  },
  {
    id: 2,
    title: "5 Common Mistakes New English Learners Make (And How to Fix Them)",
    slug: "5-common-mistakes-new-english-learners-make",
    excerpt:
      "Starting your English learning journey? Avoid these pitfalls that hold most beginners back and learn how to overcome them.",
    image: "/images/blog/english-mistakes.jpg",
    category: "Language Learning",
    date: "Feb 03, 2026",
    author: "Amber Training Team",
    authorRole: "Product Team",
    readTime: "6 min read",
    content: [
      {
        subheading: "Introduction",
        body: `Learning English is exciting, but it can also feel overwhelming, especially in the beginning. Many learners hit the same roadblocks without realising it. The good news? Most of these mistakes are easy to fix once you're aware of them.

In this post, we'll look at five of the most common mistakes beginners make and give you simple, practical ways to overcome each one.`,
      },
      {
        subheading: "1. Focusing Too Much on Grammar Rules",
        body: `Grammar is important, but obsessing over rules at the expense of actual communication is a trap. Many beginners spend hours memorising verb tables but freeze when they need to have a real conversation.

The fix: Balance grammar study with speaking practice. Use grammar as a tool, not the goal. If you can communicate your idea, even imperfectly, that's progress. Your tutor can help you refine accuracy over time.`,
      },
      {
        subheading: "2. Translating Everything from Your Native Language",
        body: `Thinking in your native language and then translating to English word by word leads to awkward, unnatural sentences. Every language has its own structure and logic.

The fix: Start thinking in English as early as possible. Label objects around your house in English. When you learn a new word, try to understand it in context rather than as a direct translation. Over time, this builds natural fluency.`,
      },
      {
        subheading: "3. Being Afraid of Making Mistakes",
        body: `Fear of errors is the number one barrier to speaking fluency. If you wait until you can speak perfectly, you'll never speak at all.

The fix: Embrace mistakes as learning opportunities. Every correction your tutor gives you is a lesson in itself. Native speakers make errors too, what matters is communication, not perfection.`,
      },
      {
        subheading: "4. Not Practising Listening Enough",
        body: `Many learners focus on reading and writing but neglect listening skills. This creates a gap where you can understand written English but struggle to follow a conversation.

The fix: Listen to English every day. Podcasts, YouTube videos, music, and audiobooks are all excellent resources. Start with content slightly below your level and gradually increase the difficulty. Active listening, where you focus on understanding, is far more effective than background listening.`,
      },
      {
        subheading: "5. Studying in Isolation",
        body: `Language is a social skill. Studying alone with textbooks and apps has limits. Without real interaction, you miss out on the spontaneity and rhythm of natural conversation.

The fix: Find conversation partners, join language exchange groups, or book regular sessions with a tutor. Real-time interaction forces you to think on your feet and builds the confidence you need for real-world communication.`,
      },
      {
        subheading: "Conclusion",
        body: `Every language learner makes mistakes, it's part of the process. What separates successful learners from those who give up is the willingness to recognise these patterns and adjust. Focus on communication over perfection, practise consistently, and don't be afraid to ask for help.

Your English journey is a marathon, not a sprint. Enjoy the process and celebrate every small win along the way.`,
      },
    ],
  },
  {
    id: 3,
    title: "A Tutor's Guide to Building a Loyal Student Base",
    slug: "tutors-guide-to-building-loyal-student-base",
    excerpt:
      "Attracting students is one thing, keeping them is another. Here's how experienced tutors build lasting relationships and grow their teaching practice.",
    image: "/images/blog/tutor-guide.jpg",
    category: "Tutor Guides",
    date: "Jan 27, 2026",
    author: "Amber Training Team",
    authorRole: "Product Team",
    readTime: "8 min read",
    content: [
      {
        subheading: "Introduction",
        body: `As an online tutor, your income and job satisfaction depend on one thing above all else: your students. Attracting new students matters, but retaining them is what builds a sustainable teaching practice.

In this guide, we'll explore practical strategies that experienced tutors use to create loyal student bases, from first impressions to long-term relationship building.`,
      },
      {
        subheading: "Make the Trial Lesson Count",
        body: `Your trial lesson is your audition. It's the student's first experience with you, and it sets the tone for everything that follows. Don't treat it as a throwaway session.

Use the trial to understand the student's goals, assess their level, and show them a glimpse of what regular lessons will look like. End with a clear, personalised learning plan. When students see that you've invested thought into their journey from day one, they're far more likely to book again.`,
      },
      {
        subheading: "Personalise Every Lesson",
        body: `Nothing kills student motivation faster than generic, one-size-fits-all lessons. Take the time to learn about your students' interests, careers, and goals, then weave these into your teaching.

If a student works in marketing, use marketing vocabulary in your exercises. If they love travel, build lessons around real travel scenarios. Personalisation shows students that you see them as individuals, not just bookings.`,
      },
      {
        subheading: "Be Consistent and Reliable",
        body: `Students need to trust that you'll show up prepared and on time, every single lesson. Cancellations, tardiness, or poorly planned sessions erode trust quickly.

Set a routine. Prepare your materials in advance. Send a brief message before each lesson confirming the time and topic. These small professional habits build confidence and make students feel valued.`,
      },
      {
        subheading: "Ask for Feedback (and Act on It)",
        body: `Most students won't tell you what's not working unless you ask. Periodically check in with your students about pacing, topics, and teaching style. A simple question like "Is there anything you'd like me to do differently?" can uncover valuable insights.

When a student gives feedback, act on it visibly. This shows them that their opinion matters and that you're committed to their success.`,
      },
      {
        subheading: "Create a Sense of Progress",
        body: `Students who can see their improvement are students who stay. Track milestones, celebrate wins (even small ones), and periodically review how far they've come.

You might say, "Remember three months ago when you couldn't talk about your job in English? Look at you now, you just explained your entire project without hesitating." Moments like these are incredibly motivating and reinforce the value of continuing.`,
      },
      {
        subheading: "Conclusion",
        body: `Building a loyal student base isn't about tricks or marketing, it's about being a great tutor who genuinely cares about their students' progress. When you combine professionalism with personalisation and consistent quality, students don't just stay, they recommend you to others.

Your reputation is your most powerful growth engine. Invest in every student relationship, and your teaching practice will thrive.`,
      },
    ],
  },
  {
    id: 4,
    title: "Why IELTS Preparation Needs a Personal Approach",
    slug: "why-ielts-preparation-needs-a-personal-approach",
    excerpt:
      "Generic IELTS prep courses only get you so far. Discover why personalised tutoring is the key to achieving your target band score.",
    image: "/images/blog/ielts-prep.jpg",
    category: "Student Success",
    date: "Jan 20, 2026",
    author: "Amber Training Team",
    authorRole: "Product Team",
    readTime: "6 min read",
    content: [
      {
        subheading: "Introduction",
        body: `The IELTS exam is one of the most widely recognised English proficiency tests in the world, used for university admissions, immigration, and professional registration. Millions of people take it every year, and the demand for effective preparation has never been higher.

Yet many students invest in generic prep courses and study materials only to find themselves stuck at the same band score. The reason? IELTS is not a one-size-fits-all exam, and preparing for it shouldn't be either.`,
      },
      {
        subheading: "Every Student Has Different Weaknesses",
        body: `Some students struggle with writing task coherence. Others find the listening section too fast. Some have strong grammar but lack speaking confidence. A personalised approach identifies your specific weaknesses and targets them directly.

A tutor who understands your unique challenges can design practice sessions that address exactly what's holding you back, rather than wasting time on areas you've already mastered.`,
      },
      {
        subheading: "Band Score Targets Require Specific Strategies",
        body: `The strategies for moving from a 5.5 to a 6.5 are very different from those needed to go from a 6.5 to a 7.5. At higher levels, the margin for error shrinks and the nuances of language use become critical.

A personalised tutor can calibrate their approach to your exact target score, focusing on the specific criteria that examiners look for at your target band. This precision is something generic courses simply cannot offer.`,
      },
      {
        subheading: "Real-Time Feedback Accelerates Improvement",
        body: `One of the biggest advantages of working with a personal tutor is immediate, detailed feedback. In a speaking mock test, your tutor can pause and correct pronunciation, grammar, or fluency in real time. In writing, they can explain exactly why a sentence would lose marks and show you how to fix it.

This kind of targeted correction is exponentially more valuable than reading model answers or watching video explanations.`,
      },
      {
        subheading: "Accountability and Motivation",
        body: `Studying alone requires enormous discipline. It's easy to skip practice sessions, avoid difficult sections, or lose motivation when progress feels slow.

Having a tutor creates accountability. Regular scheduled sessions ensure consistent practice, and a good tutor knows how to keep you motivated through plateaus. They've seen countless students succeed, and they can reassure you that progress is happening even when it doesn't feel like it.`,
      },
      {
        subheading: "Conclusion",
        body: `If you're serious about achieving your IELTS target, personalised tutoring is the most efficient path. It saves time by focusing on what matters, provides the feedback you need to improve quickly, and keeps you accountable throughout the process.

Your IELTS score can open doors to universities, careers, and countries around the world. Invest in preparation that's designed specifically for you, and give yourself the best chance of success.`,
      },
    ],
  },
  {
    id: 5,
    title: "The Benefits of Learning a Language as an Adult",
    slug: "benefits-of-learning-a-language-as-an-adult",
    excerpt:
      "Think you're too old to learn a new language? Think again. Adults have unique advantages that can make language learning incredibly rewarding.",
    image: "/images/blog/adult-learning.jpg",
    category: "Language Learning",
    date: "Jan 14, 2026",
    author: "Amber Training Team",
    authorRole: "Product Team",
    readTime: "5 min read",
    content: [
      {
        subheading: "Introduction",
        body: `There's a persistent myth that language learning is only for the young, that if you didn't grow up bilingual, you've missed your window. This couldn't be further from the truth.

While children do have certain neurological advantages, adults bring something equally powerful to the table: motivation, life experience, and the ability to learn strategically. In this article, we'll explore why learning a language as an adult is not only possible but deeply rewarding.`,
      },
      {
        subheading: "You Already Know How to Learn",
        body: `Unlike children, who absorb language unconsciously, adults understand how learning works. You know your strengths, your preferred study methods, and how to set goals. This metacognitive ability, thinking about how you think, is a superpower.

You can identify patterns in grammar, draw connections between languages, and use context clues that children simply don't have access to. Combined with the right tutor and materials, this makes adult learners incredibly efficient.`,
      },
      {
        subheading: "Real Motivation Drives Faster Progress",
        body: `Adults learn languages for real, tangible reasons: a job opportunity, a relationship, travel, or personal growth. This kind of intrinsic motivation is far more powerful than any classroom requirement.

When you're learning English because you need it for a promotion, or because you want to communicate with your partner's family, every lesson has purpose. This purpose fuels consistency, and consistency is the single most important factor in language acquisition.`,
      },
      {
        subheading: "Cognitive Benefits Beyond Language",
        body: `Learning a new language as an adult has been shown to improve memory, enhance problem-solving skills, delay cognitive decline, and even boost creativity. It's one of the best exercises for your brain.

Studies have found that bilingual adults perform better on tasks requiring focus, multitasking, and mental flexibility. So the benefits extend far beyond just being able to order coffee in another language.`,
      },
      {
        subheading: "It's Never Been More Accessible",
        body: `Technology has removed the barriers that once made adult language learning difficult. You no longer need to attend a physical school or move abroad. With online tutoring platforms, you can have a native-speaking tutor from anywhere in the world, scheduled around your work and family commitments.

Whether it's a 30-minute session during lunch or an intensive weekend study block, the flexibility of modern learning tools means there's truly no excuse not to start.`,
      },
      {
        subheading: "Conclusion",
        body: `If you've been putting off learning a language because you think it's too late, let this be your sign to start. Adults make excellent language learners, you just need the right approach, the right support, and the willingness to begin.

Every expert was once a beginner. Your future bilingual self will thank you for starting today.`,
      },
    ],
  },
  {
    id: 6,
    title: "What's New: February 2026 Platform Updates",
    slug: "whats-new-february-2026-platform-updates",
    excerpt:
      "We've been busy shipping improvements. Here's a roundup of the latest features and enhancements to make your experience even better.",
    image: "/images/blog/platform-updates.jpg",
    category: "Platform Updates",
    date: "Feb 01, 2026",
    author: "Amber Training Team",
    authorRole: "Product Team",
    readTime: "4 min read",
    content: [
      {
        subheading: "Introduction",
        body: `We're always working to make Amber Training better for both students and tutors. This month, we've rolled out several improvements based on your feedback. Here's everything that's new.`,
      },
      {
        subheading: "Improved Booking Experience",
        body: `We've redesigned the lesson booking flow to be faster and more intuitive. You can now see a tutor's full availability at a glance, select your preferred session length, and complete your booking in just a few clicks. The new summary screen shows you exactly what you're booking before you confirm.`,
      },
      {
        subheading: "Tutor Dashboard Enhancements",
        body: `Tutors now have access to a more detailed dashboard with earnings insights, student analytics, and upcoming lesson management all in one place. The new My Students tab gives tutors a complete view of each student's progress, lesson history, and goals.`,
      },
      {
        subheading: "Better Messaging",
        body: `The messaging system has been upgraded with a cleaner interface, message search, and the ability to pin and archive conversations. File sharing is now supported, making it easy to exchange lesson materials and resources.`,
      },
      {
        subheading: "Performance and Reliability",
        body: `Behind the scenes, we've made significant improvements to page load times, especially on mobile devices. The platform is now faster and more responsive across all screen sizes.`,
      },
      {
        subheading: "What's Coming Next",
        body: `We're working on lesson recordings, an improved review system, and advanced scheduling features. Stay tuned for more updates, and as always, we'd love to hear your feedback.`,
      },
    ],
  },
];
