export type Locale = "en" | "km";

export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",

    "hero.badge": "Save the Children Cambodia",
    "hero.title.line1": "Welcome to NavaHub",
    "hero.whatIs": "What is NavaHub?",
    "hero.eventsAnnouncement": "Events Announcement",
    "hero.eventsPrevious": "Previous",
    "hero.eventsNext": "Next",
    "hero.eventsGoTo": "Go to event",
    "hero.subtitle":
      "NavaHub is a Save the Children Cambodia initiative connecting youth, partners, and local communities to co-create practical digital solutions for child protection, education, health, and opportunity.",
    "hero.search.placeholder": "Search Cambodia programs, Navathons, workshops...",
    "hero.cta.findPrograms": "Find Programs",
    "hero.scroll": "Scroll to explore",
    "hero.stat.programs": "Programs in Cambodia",
    "hero.stat.participants": "Youth Participants",
    "hero.stat.communities": "Communities Supported",
    "hero.stat.provinces": "Cambodia Provinces",

    "projects.heading": "Cambodia Community Projects",
    "projects.subtitle": "Programs focused on children, families, and local communities across Cambodia.",
    "projects.hero.badge": "Cambodia community-built solutions",
    "projects.hero.titleBefore": "Cambodia",
    "projects.hero.titleAccent": "Projects",
    "projects.hero.intro":
      "Real solutions built by local teams in Cambodia to solve genuine community and child-focused challenges.",
    "projects.card.members": "{team} · {n} members",
    "projects.viewProject": "View project",

    "project.detail.backLink": "Back to Cambodia projects",
    "project.detail.memberCount": "{n} members",
    "project.detail.locationOnline": "across Cambodia, supported by local partners",
    "project.detail.locationIn": "in {location}",
    "project.detail.tagsFallback": "community-led innovation",
    "project.detail.communityNeeds": "community needs",

    "events.heading": "Upcoming Events in Cambodia",
    "events.subtitle": "Join local programs supporting children and youth across Cambodia.",
    "events.calendar": "Cambodia calendar",
    "events.join": "Join",

    "footer.explore": "Explore",
    "footer.about": "About",
    "footer.resources": "Resources",
    "footer.legal": "Legal",
    "footer.description":
      "NavaHub Cambodia supports youth-led innovation for children and families across Cambodia, powered by Save the Children.",
    "footer.copy": "© 2025 NavaHub Cambodia · Save the Children Cambodia. All rights reserved.",
    "footer.tagline": "Built for children, youth, and communities in Cambodia.",
  },
  km: {
    "nav.home": "ទំព័រដើម",
    "nav.projects": "គម្រោង",
    "nav.about": "អំពីយើង",
    "nav.contact": "ទំនាក់ទំនង",

    "hero.badge": "អង្គការ Save the Children កម្ពុជា",
    "hero.title.line1": "សូមស្វាគមន៍មកកាន់ NavaHub",
    "hero.whatIs": "តើ NavaHub ជាអ្វី?",
    "hero.eventsAnnouncement": "ការប្រកាសព្រឹត្តិការណ៍",
    "hero.eventsPrevious": "មុន",
    "hero.eventsNext": "បន្ទាប់",
    "hero.eventsGoTo": "ទៅកាន់ព្រឹត្តិការណ៍",
    "hero.subtitle":
      "NavaHub ជាគម្រោងរបស់ Save the Children កម្ពុជា ដែលភ្ជាប់យុវជន ដៃគូ និងសហគមន៍មូលដ្ឋាន ដើម្បីរួមគ្នាបង្កើតដំណោះស្រាយឌីជីថលជាក់ស្តែង សម្រាប់ការការពារកុមារ ការអប់រំ សុខភាព និងឱកាស។",
    "hero.search.placeholder": "ស្វែងរកកម្មវិធីនៅកម្ពុជា Navathon និងវគ្គបណ្តុះបណ្តាល...",
    "hero.cta.findPrograms": "ស្វែងរកកម្មវិធី",
    "hero.scroll": "រមូរចុះក្រោម",
    "hero.stat.programs": "កម្មវិធីនៅកម្ពុជា",
    "hero.stat.participants": "យុវជនចូលរួម",
    "hero.stat.communities": "សហគមន៍ទទួលបានការគាំទ្រ",
    "hero.stat.provinces": "រាជធានី/ខេត្ត",

    "projects.heading": "គម្រោងសហគមន៍នៅកម្ពុជា",
    "projects.subtitle": "កម្មវិធីផ្តោតលើកុមារ គ្រួសារ និងសហគមន៍មូលដ្ឋាននៅកម្ពុជា។",
    "projects.hero.badge": "ដំណោះស្រាយសហគមន៍នៅកម្ពុជា",
    "projects.hero.titleBefore": "កម្ពុជា",
    "projects.hero.titleAccent": "គម្រោង",
    "projects.hero.intro":
      "ដំណោះស្រាយពិតប្រាកដ ដែលក្រុកក្រុមមូលដ្ឋានបានបង្កើតនៅកម្ពុជា ដើម្បីដោះស្រាយបញ្ហាសហគមន៍ និងកុមារជាក់ស្តែង។",
    "projects.card.members": "{team} · សមាជិក {n} នាក់",
    "projects.viewProject": "មើលគម្រោង",

    "project.detail.backLink": "ត្រឡប់ទៅគម្រោងកម្ពុជា",
    "project.detail.memberCount": "សមាជិក {n} នាក់",
    "project.detail.locationOnline": "ទូទាំងកម្ពុជា ដោយមានដៃគូក្នុងស្រុកគាំទ្រ",
    "project.detail.locationIn": "នៅ {location}",
    "project.detail.tagsFallback": "នវានុវត្តន៍ដឹកនាំដោយសហគមន៍",
    "project.detail.communityNeeds": "តម្រូវការសហគមន៍",

    "events.heading": "ព្រឹត្តិការណ៍នាពេលខាងមុខនៅកម្ពុជា",
    "events.subtitle": "ចូលរួមកម្មវិធីមូលដ្ឋាន ដើម្បីគាំទ្រកុមារ និងយុវជនទូទាំងកម្ពុជា។",
    "events.calendar": "ប្រតិទិនកម្ពុជា",
    "events.join": "ចូលរួម",

    "footer.explore": "ស្វែងរក",
    "footer.about": "អំពីយើង",
    "footer.resources": "ធនធាន",
    "footer.legal": "គោលការណ៍",
    "footer.description":
      "NavaHub Cambodia គាំទ្រនវានុវត្តន៍ដឹកនាំដោយយុវជន សម្រាប់កុមារ និងគ្រួសារនៅទូទាំងកម្ពុជា ក្រោមការគាំទ្រពី Save the Children។",
    "footer.copy": "© 2025 NavaHub Cambodia · Save the Children Cambodia។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
    "footer.tagline": "បង្កើតសម្រាប់កុមារ យុវជន និងសហគមន៍នៅកម្ពុជា។",
  },
};
