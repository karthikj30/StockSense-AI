export interface CourseResource {
  title: string;
  description: string;
  url: string;
  type: string;
  level: string;
  language: string;
  recommended?: boolean;
  icon: string;
}

export interface YoutubeResource {
  title: string;
  description: string;
  url: string;
  language: string;
  subscribers?: string;
  icon: string;
}

export interface BookResource {
  title: string;
  author: string;
  description: string;
  level: string;
  available: string;
  isbn?: string;
  freeUrl?: string;
}

export interface ToolResource {
  title: string;
  description: string;
  url: string;
  type: string;
}

export interface Resources {
  courses: CourseResource[];
  youtube: YoutubeResource[];
  books: BookResource[];
  tools: ToolResource[];
}

export const RESOURCES: Resources = {
  courses: [
    {
      title: "Zerodha Varsity — Complete Free Course",
      description:
        "The absolute best free resource for Indian stock market learning. Written by professionals at Zerodha. Covers everything from zero to advanced.",
      url: "https://zerodha.com/varsity/",
      type: "Free Course",
      level: "Beginner to Advanced",
      language: "English + Hindi",
      recommended: true,
      icon: "🏆",
    },
    {
      title: "SEBI Investor Education Portal",
      description:
        "Official government resource by Securities and Exchange Board of India. Learn about investor rights, scam awareness, and market regulations.",
      url: "https://investor.sebi.gov.in/",
      type: "Government Portal",
      level: "Beginner",
      language: "English",
      icon: "🏛️",
    },
    {
      title: "NSE India — Investor Education",
      description:
        "Free learning modules from the National Stock Exchange of India. Covers NCFM certification prep and market knowledge.",
      url: "https://www.nseindia.com/education",
      type: "Free Course",
      level: "All Levels",
      language: "English",
      icon: "📈",
    },
    {
      title: "NISM (National Institute of Securities Markets)",
      description:
        "SEBI's official educational institute. Offers certification courses for serious learners who want to understand markets deeply.",
      url: "https://www.nism.ac.in/",
      type: "Certification",
      level: "Intermediate",
      language: "English",
      icon: "🎓",
    },
    {
      title: "BSE Institute Ltd",
      description:
        "The educational arm of Bombay Stock Exchange. Offers courses, webinars, and certifications on Indian capital markets.",
      url: "https://www.bsebti.com/",
      type: "Course + Certification",
      level: "All Levels",
      language: "English",
      icon: "📚",
    },
    {
      title: "Investopedia — Stock Market Basics",
      description:
        "World's largest financial education site. Great for understanding global concepts with clear examples.",
      url: "https://www.investopedia.com/investing-4427685",
      type: "Free Articles",
      level: "Beginner",
      language: "English",
      icon: "🌐",
    },
    {
      title: "MoneyControl Education",
      description:
        "Indian financial news and education. Great for market news, explainers, and keeping up with Indian economy.",
      url: "https://www.moneycontrol.com/stocks/marketinfo/advances_declines/",
      type: "News + Education",
      level: "Beginner",
      language: "English",
      icon: "📰",
    },
  ],
  youtube: [
    {
      title: "CA Rachana Ranade",
      description:
        "Best Hindi + English stock market educator in India. Explains complex topics simply. Over 4M subscribers. Start here if you prefer video learning.",
      url: "https://www.youtube.com/@CArachanaranade",
      language: "Hindi/English",
      subscribers: "4M+",
      icon: "▶️",
    },
    {
      title: "Zerodha (Official)",
      description:
        "Varsity video lectures from India's largest broker. Well-structured, free, and covers everything.",
      url: "https://www.youtube.com/@zerodha",
      language: "English",
      icon: "▶️",
    },
    {
      title: "Pranjal Kamra (Finology)",
      description:
        "Long-term investing, fundamental analysis, and value investing explained beautifully. Great for wealth building mindset.",
      url: "https://www.youtube.com/@PranjalKamra",
      language: "Hindi/English",
      subscribers: "3M+",
      icon: "▶️",
    },
    {
      title: "Akshat Shrivastava",
      description:
        "Personal finance and stock market investing for Indians. Practical, real-world advice.",
      url: "https://www.youtube.com/@AkshatShrivastava",
      language: "Hindi/English",
      icon: "▶️",
    },
  ],
  books: [
    {
      title: "The Intelligent Investor",
      author: "Benjamin Graham",
      description:
        "The bible of value investing. Warren Buffett calls this the best book ever written on investing. A must-read.",
      level: "Intermediate",
      available: "Amazon India | Flipkart | Local bookstores",
      isbn: "978-0062312686",
    },
    {
      title: "One Up on Wall Street",
      author: "Peter Lynch",
      description:
        "How to use everyday knowledge to beat Wall Street pros. Perfect for beginners learning to pick stocks.",
      level: "Beginner",
      available: "Amazon India | Flipkart",
    },
    {
      title: "Common Stocks and Uncommon Profits",
      author: "Philip Fisher",
      description:
        "One of the greatest books on growth investing. Focus on qualitative analysis and understanding businesses.",
      level: "Intermediate",
      available: "Amazon India",
    },
    {
      title: "Bulls, Bears and Other Beasts",
      author: "Santosh Nair",
      description:
        "The story of Indian stock markets told through a fictional trader. Specifically about NSE/BSE and Indian market history. Perfect for Indian readers.",
      level: "Beginner",
      available: "Amazon India | Flipkart | Pan Macmillan India",
    },
    {
      title: "How to Avoid Loss and Earn Consistently in the Stock Market",
      author: "Prasenjit Paul",
      description:
        "Indian author, Indian context. Simple and practical approach to long-term investing in Indian markets. Highly recommended for beginners.",
      level: "Beginner",
      available: "Amazon India | Flipkart",
    },
    {
      title: "Reminiscences of a Stock Operator",
      author: "Edwin Lefèvre",
      description:
        "Based on the life of legendary trader Jesse Livermore. Learn trading psychology and the human side of markets.",
      level: "Intermediate",
      available: "Amazon India | Free on Project Gutenberg (public domain)",
      freeUrl: "https://www.gutenberg.org/ebooks/41266",
    },
  ],
  tools: [
    {
      title: "Screener.in",
      description:
        "Best free stock screener for Indian stocks. Filter stocks by fundamentals, ratios, and custom criteria.",
      url: "https://www.screener.in/",
      type: "Tool",
    },
    {
      title: "TradingView — Indian Markets",
      description:
        "Advanced charting for NSE/BSE. Set up price alerts and watch technical patterns.",
      url: "https://in.tradingview.com/",
      type: "Charting Tool",
    },
    {
      title: "Tickertape",
      description:
        "Modern stock research platform for Indian investors. Clean interface, good fundamental data.",
      url: "https://www.tickertape.in/",
      type: "Research Tool",
    },
    {
      title: "NSE India Official",
      description:
        "Official source for NSE data, announcements, corporate actions, and market statistics.",
      url: "https://www.nseindia.com/",
      type: "Official Data",
    },
    {
      title: "BSE India Official",
      description:
        "Official Bombay Stock Exchange. Company filings, announcements, and market data.",
      url: "https://www.bseindia.com/",
      type: "Official Data",
    },
  ],
};
