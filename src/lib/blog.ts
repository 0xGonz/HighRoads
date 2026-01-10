// Blog article data and utilities

export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  category: 'guides' | 'industry' | 'tips' | 'news'
  author: string
  publishedAt: string
  readTime: number
  featured?: boolean
  image?: string
}

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'guides', label: 'Guides' },
  { id: 'industry', label: 'Industry Insights' },
  { id: 'tips', label: 'Tips & Tricks' },
  { id: 'news', label: 'News' },
]

export const blogArticles: BlogArticle[] = [
  {
    slug: 'lease-to-own-vs-traditional-leasing',
    title: 'Lease-to-Own vs Traditional Leasing',
    excerpt: 'A driver we talked to paid $180K over 6 years in traditional lease payments and owned nothing. Here\'s how lease-to-own changes that math.',
    category: 'guides',
    author: 'High Road Team',
    publishedAt: '2024-12-01',
    readTime: 7,
    featured: true,
    content: `
A driver we talked to last month had been leasing for 6 years. He'd paid over $180,000 in lease payments. What did he own at the end? Nothing. The truck went back to the leasing company, and he was looking at signing another lease.

That's the traditional leasing trap. You're essentially renting a truck. The payments might be predictable, maintenance might be included, and you can upgrade trucks regularly. But when the lease ends, you walk away with nothing.

## How Lease-to-Own Changes the Math

With lease-to-own, every payment builds equity toward ownership. When you're done, the truck is yours. No more payments, ever.

Our program works like this: you start with $0 down, pay $625/week deducted from your settlement, and in 3-4 years the title transfers to you. You're building toward something instead of just paying rent.

## Running the Numbers

Take a $100,000 truck over 5 years.

With a traditional lease, you're looking at roughly $2,500/month. Over 5 years, that's $150,000 paid out. What do you own? Nothing. You need to sign another lease.

With lease-to-own, you pay about $650/week. Over 4 years, that's around $135,000. What do you own? A truck worth $60,000 or more. No more payments after that.

Same work, same miles, same time behind the wheel. One path ends with an asset, one doesn't.

## Who Lease-to-Own Works For

This isn't for everyone. You need a CDL-A with at least 12 months of OTR experience and a clean MVR. You also need to be consistent—if you're not driving and earning, you can't make payments.

But if you've got the experience and you're tired of paying into a system where you never own anything, it's worth looking at. [Check if you qualify](/apply)—takes about 5 minutes.
    `,
  },
  {
    slug: 'how-to-become-owner-operator',
    title: 'How to Become an Owner-Operator',
    excerpt: 'Most company drivers think about ownership at some point. Here\'s what it actually takes and the three realistic paths to get there.',
    category: 'guides',
    author: 'High Road Team',
    publishedAt: '2024-11-28',
    readTime: 10,
    featured: true,
    content: `
Most company drivers think about ownership at some point. The freedom to choose your loads, set your schedule, and build something that's yours. The question is how to get there without draining your savings or wrecking your credit.

## What You Actually Need

Before anything else, you need a Class A CDL and at least 12 months of verifiable OTR experience—some programs want 2 years. You need a clean MVR, which means no DUI in the past 5 years and no more than 3 moving violations in the past 3 years. You need a current DOT medical card and authorization to work in the US.

If you're missing any of these, that's your first priority. The ownership conversation comes after.

## Three Ways to Own a Truck

The first option is paying cash. If you've got $50,000 to $150,000 saved up, you can buy a truck outright and have full control from day one. This is realistic if you've been saving for years or have family money. Most drivers don't.

The second option is bank financing. You'll need a credit score of 650 or higher and 10-20% down. Monthly payments for 3-5 years. This works if your credit is solid, but many drivers don't qualify.

The third option is lease-to-own. No money down, no credit check—your driving record matters more than your FICO score. Payments come out of your settlement, and you build equity weekly until you own the truck. Takes 3-4 years typically.

Most drivers we talk to don't have $50K saved and don't have perfect credit. That's why lease-to-own exists.

## What Makes It Work

The key is consistency. If you can drive consistently and make your weekly payments, you'll own a truck. We provide truck selection from quality inventory (2020+ models), carrier matching based on your preferences, LLC formation guidance, and fuel card access. You provide the experience, clean record, consistent driving, and $625/week payments.

## Things That Trip Up New Owner-Operators

The common mistakes are not tracking expenses (which kills you at tax time), having no emergency fund (one breakdown can sink you), skipping preventive maintenance, and not knowing your cost per mile so you can't price loads right.

If possible, build a 3-month expense cushion before you start. If that's not realistic, build it while you drive.

## Next Step

If you meet the requirements, [check your eligibility](/apply). We'll be straight with you about whether this program fits your situation.
    `,
  },
  {
    slug: 'understanding-your-mvr',
    title: 'What Carriers Look for on Your MVR',
    excerpt: 'Your Motor Vehicle Record is the first thing carriers check—before credit, before experience verification. Here\'s what matters.',
    category: 'tips',
    author: 'High Road Team',
    publishedAt: '2024-11-25',
    readTime: 5,
    content: `
Your Motor Vehicle Record is the first thing any carrier or leasing program checks. Before credit, before experience verification, they pull your MVR. Your state DMV keeps a record of traffic violations, tickets, at-fault accidents, license suspensions, DUI/DWI convictions, and points. This follows you everywhere in trucking.

## What Gets You Approved

Carriers want to see no violations in the past 3 years, no at-fault accidents, and no DUI/DWI—ever, ideally, or at least not in the past 5 years. A clean MVR means better job opportunities, higher pay, lower insurance costs, and easier approval for lease-to-own programs.

The red flags are multiple speeding tickets, reckless driving charges, recent DUI/DWI, and license suspensions. Any of these makes approval harder, though not always impossible.

## Check Your Own Record First

Before applying anywhere, know what's on your record. Contact your state DMV online—usually costs $5-15—or ask your current employer for their copy. No surprises is better than bad surprises.

## Keeping It Clean Going Forward

This is obvious, but worth saying: follow speed limits, especially in construction zones. No phone use while driving. Contest tickets that aren't justified. Take defensive driving courses if points are becoming an issue.

## If Your MVR Isn't Perfect

We look at the full picture. How long ago were the violations? What's your pattern—improving or getting worse? How much experience do you have otherwise?

Plenty of drivers with imperfect records have qualified for our program. [Apply](/apply) and we'll give you an honest assessment of where you stand.
    `,
  },
  {
    slug: 'tax-benefits-truck-ownership',
    title: 'Tax Deductions for Owner-Operators',
    excerpt: 'Company drivers get a W-2. Owner-operators run a business, which means deductions. Per diem alone can add up to $17K+ annually.',
    category: 'tips',
    author: 'High Road Team',
    publishedAt: '2024-11-20',
    readTime: 6,
    content: `
Company drivers get a W-2. Owner-operators run a business. That means deductions—legitimate business expenses you can subtract from your taxable income, potentially saving thousands each year.

**Important:** Talk to an accountant for your specific situation. This is general info, not tax advice.

## The Big Ones

Per diem is significant. The IRS allows $69/day for transportation workers when you're away from home. Drive 250 days a year and that's over $17,000 you can deduct.

Truck payments—whether lease payments or depreciation if you own outright—are deductible. Section 179 can let you accelerate depreciation in some cases. Every gallon of diesel used for business is deductible; get a fuel card to make tracking simple.

All maintenance is deductible: oil changes, tires, repairs, everything. Save every receipt. All your business insurance is deductible too—truck insurance, liability, cargo coverage. If you're self-employed, health insurance often qualifies.

The smaller stuff adds up: phone bills, GPS and ELD devices, permits and licenses, professional services like accountants and lawyers, home office if you do admin from home.

## Don't Mess Up the Basics

Keep receipts. Digital copies work. Apps like TruckLogics or Rigbooks make tracking manageable.

Use a separate business bank account. Mixing personal and business makes everything harder when tax time comes.

Pay quarterly estimated taxes. Don't get hit with penalties at year end because you didn't pay along the way.

## Get a Trucking Accountant

General accountants don't know trucking deductions. Find someone who specializes in owner-operators—they'll catch things you'd miss. The deductions they find usually pay for what you spend on their services.
    `,
  },
  {
    slug: 'what-to-look-for-lease-to-own',
    title: 'How to Spot a Bad Lease-to-Own Program',
    excerpt: 'Not every lease-to-own program wants you to actually own the truck. Some are designed to extract payments as long as possible. Here\'s how to tell the difference.',
    category: 'guides',
    author: 'High Road Team',
    publishedAt: '2024-11-15',
    readTime: 8,
    content: `
Not every lease-to-own program wants you to actually own the truck. Some are designed to extract payments as long as possible while keeping you locked in. Here's how to tell the difference.

## Red Flags That Should Stop You

If a program promises "guaranteed" income, be skeptical. No one can guarantee what you'll earn. If they're making specific income promises, they're either lying or hiding something in the fine print.

High pressure tactics are another warning sign. "Sign today or lose this deal." "Limited trucks available." If they won't let you take the contract home and think about it, walk away. Legitimate programs don't need to rush you.

Ask what percentage of your payment goes to equity. If they can't give you a clear, specific answer, that's a problem. Some programs bury fees or structure payments so most of your money goes to interest and fees rather than ownership.

Watch out for mandatory company services: required insurance at twice market rates, required fuel purchases at company stations, "maintenance escrow" you never see again. These are profit centers disguised as services.

Check the exit terms. What happens if you need to leave the program? If you lose all equity for any minor violation, the contract is designed to trap you, not help you own a truck.

Be wary of old equipment. High-mileage trucks with no maintenance history are red flags. If they won't show you the truck's service records, assume the worst.

## What Good Programs Look Like

Clear payment terms where you know exactly what you're paying and where it goes. A reasonable equity rate—80% or more of your payment should build ownership. A realistic timeline of 3-5 years; much longer means you're overpaying. Carrier options so you have choices, not forced dispatch. Maintenance records that prove the equipment is well-kept.

## Questions to Ask Before Signing

What percentage of my payment goes to equity? What happens if I leave early? Can I see the truck's full maintenance history? What are all the fees beyond the weekly payment? Can I talk to drivers who've completed the program?

If they hesitate on any of these, keep looking.

## How We Do It

We're straightforward about our terms: $625/week deducted from settlement, 3-4 year path to ownership, 2020+ model trucks, no credit check. Your MVR is what matters.

[Check eligibility](/apply) and we'll tell you if it's a fit.
    `,
  },
  {
    slug: 'building-credit-as-truck-driver',
    title: 'Building Credit While Driving OTR',
    excerpt: 'Our program doesn\'t require good credit, but credit still matters for the rest of your life. Here\'s how to build it while living on the road.',
    category: 'tips',
    author: 'High Road Team',
    publishedAt: '2024-11-10',
    readTime: 6,
    content: `
Our program doesn't require good credit. But credit still matters for the rest of your life—apartments, insurance rates, future financing options. The problem is that building credit while living on the road is harder than it sounds.

## The OTR Credit Problems

Mail piles up when you're gone for weeks. Bills sit unopened. Pay varies with good weeks and bad weeks, making budgeting unpredictable. And you're driving—dealing with financial admin from truck stops isn't easy.

## What Actually Works

The most important thing is autopay. Set every bill to autopay. Credit cards set to pay full balance or at least minimum automatically. Missed payments kill credit scores, and autopay means you never miss one while you're on the road.

Get a secured credit card. Put down $300-500 and get a card with that limit. Use it for small purchases and pay it off weekly when you fuel up. These are easy to get approved for, even with bad credit.

Ask a family member with good credit to add you as an authorized user on their card. You don't even need to use it—their payment history starts showing on your report.

Credit builder loans from banks and credit unions are another option. Small loan, money goes into savings, you make payments that get reported to credit bureaus. Get your money back at the end.

Don't close old accounts. Length of credit history matters. Even if you don't use a card, keep it open and use it once every few months to keep it active.

## Managing Money from the Road

Use mobile banking apps for everything. Set up text alerts for all transactions. Go paperless with statements. Use USPS Informed Delivery to see what's coming to your mailbox. Keep a permanent address—family or a P.O. Box.

## If You Have Bad Credit

It's fixable. Negative items fall off after 7 years. In the meantime: check your report at AnnualCreditReport.com (it's free), dispute errors (they happen), pay down highest-interest debt first, don't open new accounts unless it's strategic, and be patient.

You don't need good credit for our lease-to-own program. But building it while you drive is smart for everything else in life.
    `,
  },
]

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug)
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  if (category === 'all') return blogArticles
  return blogArticles.filter((article) => article.category === category)
}

export function getFeaturedArticles(): BlogArticle[] {
  return blogArticles.filter((article) => article.featured)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
