// High Road Capital LLC - Centralized Business Configuration
// Update these values to change content across the entire site

export const COMPANY = {
  name: 'High Road Capital LLC',
  shortName: 'High Road Capital',
  location: 'North Charleston, SC',
  state: 'South Carolina',
  email: 'info@highroadcapitalllc.com',
  supportEmail: 'support@highroadcapitalllc.com',
  phone: '',

  // Leadership
  leader: 'Jason Hall',
  leaderTitle: 'Co-Founder & COO',

  // Partner
  truckPartner: 'TLG Peterbilt of Charleston',
}

export const PROGRAM = {
  // Ownership model
  ownershipModel: 'performance-based' as const,

  // Trucks
  truckModels: '2020-2021 Peterbilt 579',
  truckType: 'sleeper trucks',
  truckYears: '2020 and 2021',
  truckModel: 'Peterbilt 579',

  // Profit Split
  profitSplit: 50, // Driver gets 50%, HRC gets 50%

  // Proving Ground (First 4 weeks)
  provingGroundWeeks: 4,
  provingGroundMinimum: 750, // Minimum HRC must earn per week during proving ground

  // Ongoing Performance Requirements
  ongoingMinimum: 1000, // Minimum average HRC must earn per week after proving ground

  // Ownership Timeline (based on HRC weekly earnings)
  ownershipTimeline: [
    { hrcWeeklyEarnings: 1000, yearsToOwnership: 3 },
    { hrcWeeklyEarnings: 1250, yearsToOwnership: 2.5 },
    { hrcWeeklyEarnings: 1500, yearsToOwnership: 2 },
    { hrcWeeklyEarnings: 1750, yearsToOwnership: 1.5 },
    { hrcWeeklyEarnings: 2000, yearsToOwnership: 1 },
  ],

  // Carrier Flexibility Rules
  carrierMinDays: 30, // Minimum days with each carrier
  maxCarrierChangesPerYear: 3,
  carrierTransitionReserve: 750, // Reserve when switching carriers

  // Requirements
  cdlRequired: true,
  cdlClass: 'Class A',
  cdlClassShort: 'CDL-A',
  medicalCardRequired: true,
  minExperienceMonths: 12,
  minAge: 23,
  creditCheckRequired: false,
  downPaymentRequired: false,
  cleanMVR: true,

  // What's Included
  included: [
    'Full maintenance and repairs',
    'Carrier-provided insurance and fuel cards',
    'ELD and dash camera',
    'IRP and IFTA filings',
    'Occupational accident coverage',
    'Compliance and back-office support',
  ],
}

// Key program benefits for marketing
export const BENEFITS = {
  highlights: [
    'No credit checks',
    'No down payments',
    'No buyout tricks',
    'No balloon payments',
  ],
  included: [
    `${PROGRAM.truckYears} ${PROGRAM.truckModel} sleeper`,
    'Full maintenance and repairs',
    'Carrier-provided insurance and fuel cards',
    'ELD and dash camera',
    'IRP and IFTA filings',
    'Occupational accident coverage',
    'Compliance and back-office support',
  ],
  ownership: [
    'Ownership earned through performance',
    `${PROGRAM.profitSplit}/${PROGRAM.profitSplit} profit split after Proving Ground`,
    `Own in as little as 1 year (at $2,000/week to HRC)`,
    'Walk-away option with no debt traps',
  ],
}

// How the program works - simplified steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Apply & Get Approved',
    description: 'Simple application with no credit check. We review your CDL, experience, and driving record.',
    details: 'Get a response within 24 hours.',
  },
  {
    step: 2,
    title: 'Choose Your Carrier',
    description: 'Select from our approved carrier partners. Carriers provide freight, fuel cards, insurance, ELD, and compliance.',
    details: 'You choose any approved carrier - we provide the truck.',
  },
  {
    step: 3,
    title: 'Complete Proving Ground',
    description: `Drive your first ${PROGRAM.provingGroundWeeks} weeks to demonstrate consistent performance.`,
    details: `Truck must generate at least $${PROGRAM.provingGroundMinimum}/week for HRC. Earnings above this go to you.`,
  },
  {
    step: 4,
    title: 'Earn Your Truck',
    description: `After Proving Ground, net revenue is split ${PROGRAM.profitSplit}/${PROGRAM.profitSplit}. Your share builds ownership.`,
    details: 'The more profit you generate, the faster you own. High performers own in 1-2 years.',
  },
]

// FAQ content
export const FAQ_ITEMS = [
  {
    question: 'What are the requirements to qualify?',
    answer: `To qualify you need: valid ${PROGRAM.cdlClassShort} license, current DOT medical card, ${PROGRAM.minExperienceMonths}+ months OTR experience, must be ${PROGRAM.minAge} years or older, clean MVR (no major violations), and US work authorization. No credit check required.`,
  },
  {
    question: 'How does the profit split work?',
    answer: `The carrier pays ${COMPANY.shortName} each week. Fuel, insurance, tolls, and operating costs are deducted by the carrier. After the Proving Ground period, the remaining net revenue is split ${PROGRAM.profitSplit}% to you and ${PROGRAM.profitSplit}% to ${COMPANY.shortName}.`,
  },
  {
    question: 'How long until I own the truck?',
    answer: `Ownership is earned based on how much profit the truck generates for ${COMPANY.shortName}. At $1,000/week to HRC = 3 years. At $1,500/week = 2 years. At $2,000/week = just 1 year. The better you perform, the faster you own.`,
  },
  {
    question: 'What is the Proving Ground?',
    answer: `All new drivers begin with a ${PROGRAM.provingGroundWeeks}-week Proving Ground period. During this time, the truck must generate at least $${PROGRAM.provingGroundMinimum}/week for ${COMPANY.shortName}. Any earnings above this amount are paid to you. This ensures the truck is being run consistently before the standard split begins.`,
  },
  {
    question: 'What happens after the Proving Ground?',
    answer: `After the Proving Ground, the truck must maintain an average of at least $${PROGRAM.ongoingMinimum}/week for ${COMPANY.shortName}. Once this is met, the net revenue is split ${PROGRAM.profitSplit}/${PROGRAM.profitSplit} between you and ${COMPANY.shortName}.`,
  },
  {
    question: 'Do I need to put money down?',
    answer: 'No! There are no down payments required. No credit checks. No buyout tricks. Ownership is earned through performance, not debt.',
  },
  {
    question: 'What trucks are available?',
    answer: `We currently offer ${PROGRAM.truckYears} ${PROGRAM.truckModel} sleeper trucks. Each truck includes full maintenance, repairs, ELD, dash camera, and is serviced by our partner ${COMPANY.truckPartner}.`,
  },
  {
    question: 'Can I switch carriers?',
    answer: `Yes. You may choose any approved carrier, but there are some rules to protect earnings and stability: ${PROGRAM.carrierMinDays}-day minimum with each carrier, maximum ${PROGRAM.maxCarrierChangesPerYear} carrier changes per year, and a $${PROGRAM.carrierTransitionReserve} transition reserve is held when switching.`,
  },
  {
    question: 'What if I need to exit the program?',
    answer: `Life happens. You may exit the program at any time by returning the truck in operating condition and settling any outstanding balances. There are no debt traps or forced buyouts. This is our Walk-Away Option.`,
  },
  {
    question: 'What support is included?',
    answer: `Your truck includes: full maintenance and repairs, carrier-provided insurance and fuel cards, ELD and dash camera, IRP and IFTA filings, occupational accident coverage, and compliance/back-office support. You drive - we handle the rest.`,
  },
]

// Privacy Policy
export const PRIVACY_POLICY = {
  lastUpdated: 'November 1, 2025',
  sections: [
    {
      title: 'Information We Collect',
      content: 'We collect personal and business information that you voluntarily provide when you visit our website, submit an application, or communicate with us. This may include your name, phone number, email address, mailing address, CDL and driver\'s license information, employment and driving history, safety and compliance records, and banking information used for settlements or payments. We may also collect basic website data such as IP address, browser type, pages visited, and time spent on the site.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use your information to process applications, verify identity and eligibility, conduct background and safety checks, match drivers with approved carriers, administer payments and settlements, communicate about program participation, improve our website and operations, and comply with legal and regulatory requirements. We do not sell your personal information.',
    },
    {
      title: 'How We Share Information',
      content: 'We may share your information with approved carriers, insurance providers, background and compliance companies, payment processors, and legal or regulatory authorities when necessary to operate the program or meet legal obligations. We only share information that is reasonably required for these purposes.',
    },
    {
      title: 'Cookies and Website Tracking',
      content: 'Our website may use cookies and similar technologies to improve user experience, analyze site traffic, and support marketing and advertising efforts. You may disable cookies in your browser settings, but some features of the site may not function properly.',
    },
    {
      title: 'Data Security',
      content: 'We take reasonable administrative, technical, and physical steps to protect your personal information. However, no data transmission is completely secure, and we cannot guarantee absolute protection against unauthorized access.',
    },
    {
      title: 'Your Rights',
      content: 'You may request to review, correct, or delete certain personal information we hold about you, subject to legal and business recordkeeping requirements. Requests can be made through the contact form on this website.',
    },
    {
      title: 'Third-Party Websites',
      content: `Our website may contain links to third-party websites. ${COMPANY.name} is not responsible for the privacy practices or content of those websites.`,
    },
    {
      title: 'Changes to This Privacy Policy',
      content: 'We may update this Privacy Policy at any time. Any changes will be posted on this page with a revised "Last Updated" date.',
    },
  ],
}

// Carrier Partnership Info
export const CARRIER_INFO = {
  whatWeProvide: [
    'Truck ownership and asset management',
    'Full maintenance and repair support',
    'Compliance-ready equipment',
    'Long-term driver retention through ownership incentives',
  ],
  howDriversArePlaced: `${COMPANY.shortName} recruits and accepts drivers into our Performance-Based Ownership Program. Once accepted, drivers are free to choose any approved motor carrier to operate with. If a carrier already has a driver who needs a truck, that driver can apply to ${COMPANY.shortName} and enter the program under the same standards and performance requirements as all other drivers.`,
  carrierResponsibilities: [
    'Vetting and onboarding drivers',
    'Safety and compliance',
    'Dispatch and load assignment',
    'Training and supervision',
  ],
  carrierProvides: [
    'Dispatch and freight',
    'Fuel cards',
    'Insurance',
    'ELD and camera systems',
    'IRP, IFTA, and regulatory compliance',
  ],
  whyCarriersPartner: [
    'Add trucks without purchasing equipment',
    'Onboard drivers faster',
    'Reduce capital requirements',
    'Improve driver retention',
    'Maintain a more stable fleet',
  ],
  clarifications: [
    'We do not supply drivers to any specific carrier. We supply trucks to drivers.',
    'We do not act as a driver staffing agency.',
    'We do not dispatch freight.',
    'We do not control drivers\' carrier relationships.',
    'We provide trucks. Drivers choose carriers.',
  ],
}
