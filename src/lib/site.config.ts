export const siteConfig = {
  name: "RetireRight",
  description: "Optimize self-employed retirement contributions by state & income. Calculate your optimal 401(k), Solo 401(k), and SEP contribution limits.",
  url: "https://retireright.vercel.app",
  author: "Connor Pham",
  keywords: [
    "retirement calculator",
    "401k calculator", 
    "solo 401k",
    "SEP IRA",
    "self-employed",
    "retirement planning",
    "tax planning",
    "RetireRight"
  ],
  links: {
    github: "https://github.com/CodeByConnor/retireright",
    email: "mailto:cpham2870@sdsu.edu"
  }
} as const;

export type SiteConfig = typeof siteConfig;
