export type Project = {
  id: number;
  title: string;
  event: string;
  team: string;
  members: number;
  location: string;
  date: string;
  tags: string[];
  description: string;
  impact: string;
  emoji: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "AquaTrack – Community Water Monitor",
    event: "Navathon: Clean Water Solutions",
    team: "Team HydroHack",
    members: 4,
    location: "Phnom Penh, Cambodia",
    date: "Apr 2025",
    tags: ["IoT", "Water Quality", "React Native"],
    description:
      "A mobile app that monitors water quality in rural villages using low-cost IoT sensors and sends real-time alerts to community leaders.",
    impact: "12 villages · 3,400 people",
    emoji: "💧",
  },
  {
    id: 2,
    title: "EduBridge – Offline Learning Platform",
    event: "Navathon: Education Access Hack",
    team: "Team Spark",
    members: 5,
    location: "Siem Reap, Cambodia",
    date: "May 2025",
    tags: ["PWA", "Offline-first", "Education"],
    description:
      "A progressive web app delivering curriculum content to students in areas with no internet, syncing when connectivity is available.",
    impact: "6 schools · 1,200 students",
    emoji: "📚",
  },
  {
    id: 3,
    title: "SafeAlert – Child Protection Network",
    event: "Navathon: Child Safety Tech",
    team: "Team Shield",
    members: 3,
    location: "Online",
    date: "May 2025",
    tags: ["Safety", "SMS", "Community"],
    description:
      "An SMS-based alert system allowing community members to report and escalate child safety concerns to local authorities instantly.",
    impact: "8 districts covered",
    emoji: "🛡️",
  },
  {
    id: 4,
    title: "HealthMap – Rural Clinic Locator",
    event: "Navathon: Healthcare Access",
    team: "Team Pulse",
    members: 4,
    location: "Battambang, Cambodia",
    date: "Mar 2025",
    tags: ["Maps", "Healthcare", "Next.js"],
    description:
      "An offline-capable map showing nearest health clinics, their operating hours, and available services for rural communities.",
    impact: "22 clinics mapped",
    emoji: "🏥",
  },
  {
    id: 5,
    title: "FarmAssist – AI Crop Advisory",
    event: "Navathon: Food Security Hack",
    team: "Team Harvest",
    members: 6,
    location: "Online",
    date: "Feb 2025",
    tags: ["AI/ML", "Agriculture", "Python"],
    description:
      "Uses satellite imagery and AI to give smallholder farmers personalized crop advice via a simple SMS chatbot interface.",
    impact: "500+ farmers onboarded",
    emoji: "🌾",
  },
  {
    id: 6,
    title: "VoiceFor – Community Reporting Tool",
    event: "Navathon: Civic Tech Sprint",
    team: "Team Echo",
    members: 3,
    location: "Phnom Penh, Cambodia",
    date: "Jan 2025",       
    tags: ["Voice UI", "Khmer NLP", "Civic"],
    description:
      "A voice-enabled platform allowing illiterate community members to report local issues in Khmer to local government officials.",
    impact: "340 reports filed",
    emoji: "🎙️",
  },
];

export function getProjectById(id: number) {
  return projects.find((project) => project.id === id);
}
