export type Locale = "en" | "km";

export const defaultLocale: Locale = "en";

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",

    "hero.badge": "Powerd by Save the Children Cambodia",
    "hero.title.line1": "Welcome to NavaHub",
    "hero.whatIs": "What is NavaHub?",
    "hero.eventsAnnouncement": "Events",
    "hero.eventsPrevious": "Previous",
    "hero.eventsNext": "Next",
    "hero.eventsGoTo": "Go to event",
    "hero.subtitle":
      "NavaHub is a Save the Children Cambodia initiative connecting youth, partners, and local communities to co-create practical digital solutions for child protection, education, health, and opportunity.",

    "projects.heading": "Cambodia Community Projects",
    "projects.subtitle": "Programs focused on children, families, and local communities across Cambodia.",
    "projects.hero.badge": "Cambodia community-built solutions",
    "projects.hero.titleBefore": "Cambodia",
    "projects.hero.titleAccent": "Projects",
    "projects.hero.intro":
      "Real solutions built by local teams in Cambodia to solve genuine community and child-focused challenges.",
    "projects.card.members": "{team} · {n} members",
    "projects.viewProject": "View project",

    "events.heading": "Upcoming Events in Cambodia",
    "events.subtitle": "Join local programs supporting children and youth across Cambodia.",
    "events.calendar": "Cambodia calendar",
    "events.join": "Join",

    "about.hero.badge": "Save the Children",
    "about.hero.title.before": "We make technology work",
    "about.hero.title.accent": "for children in Cambodia.",
    "about.hero.subtitle":
      "NavaHub is the digital home of Navathon Cambodia, bringing together developers, designers, and changemakers to build practical solutions for children and underserved communities.",
    "about.mission.title": "Our Mission in Cambodia",
    "about.mission.p1":
      "Navathon was born out of a simple belief: the best people to solve a community's problems are the people who live them. We partner local tech talent with Save the Children's deep community knowledge to create solutions that actually get used.",
    "about.mission.p2":
      "Every Navathon is designed around a specific community challenge - water, education, child safety, healthcare - and ends with working prototypes handed directly to the communities that need them.",
    "about.stats.events": "Events",
    "about.stats.builders": "Builders",
    "about.stats.communities": "Communities",
    "about.card.title": "Save the Children",
    "about.card.body":
      "Save the Children has been working to protect children's rights and improve their lives for over 100 years. NavaHub and Navathon are part of their commitment to innovation-led community development.",
    "about.values.heading": "What We Stand For",
    "about.values.subtitle": "The principles that guide every Navathon.",
    "about.values.communityFirst.title": "Community First",
    "about.values.communityFirst.desc":
      "Every decision we make is rooted in the real needs of the communities we serve.",
    "about.values.innovation.title": "Innovation",
    "about.values.innovation.desc":
      "We believe technology, in the right hands, can solve the hardest human problems.",
    "about.values.inclusivity.title": "Inclusivity",
    "about.values.inclusivity.desc": "Navathon is open to everyone - no experience required, just passion to help.",
    "about.values.trustSafety.title": "Trust & Safety",
    "about.values.trustSafety.desc":
      "All activities uphold Save the Children's safeguarding and child protection standards.",
    "about.values.collaboration.title": "Collaboration",
    "about.values.collaboration.desc":
      "We grow together - participants, mentors, and organizations side by side.",
    "about.values.realImpact.title": "Real Impact",
    "about.values.realImpact.desc": "We measure success by lives changed, not lines of code written.",
    "about.timeline.heading": "Our Journey",
    "about.timeline.2021": "First Navathon held in Phnom Penh with 40 participants.",
    "about.timeline.2022": "Expanded to 3 provinces. 12 community solutions launched.",
    "about.timeline.2023": "First online Navathon - 600+ participants across 10 countries.",
    "about.timeline.2024": "Launched NavaHub platform. 80+ projects submitted.",
    "about.timeline.2025": "8,000+ participants. 45+ communities impacted. Growing globally.",

    "contact.hero.badge": "Cambodia Support & Partnerships",
    "contact.hero.title.before": "Get in",
    "contact.hero.title.accent": "Touch Cambodia",
    "contact.hero.subtitle":
      "Whether you want to join, organize, sponsor, or support programs in Cambodia, we're here to help.",
    "contact.details.heading": "Cambodia Contact Details",
    "contact.follow": "Follow us",
    "contact.info.email": "Email",
    "contact.info.phone": "Phone",
    "contact.info.address": "Address",
    "contact.info.addressValue": "Phnom Penh, Cambodia",
    "contact.map.office": "Phnom Penh, Cambodia Office",
    "contact.success.title": "Message Sent!",
    "contact.success.body": "Thank you for reaching out. Our team will get back to you within 1-2 business days.",
    "contact.success.cta": "Send another message",
    "contact.form.title": "Send a Message",
    "contact.form.firstName": "First Name",
    "contact.form.lastName": "Last Name",
    "contact.form.email": "Email",
    "contact.form.subject": "Subject",
    "contact.form.subject.join": "Join a Navathon Cambodia",
    "contact.form.subject.organize": "Organize a Navathon",
    "contact.form.subject.sponsor": "Sponsor / Partner",
    "contact.form.subject.media": "Media Inquiry",
    "contact.form.subject.other": "Other",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "Tell us what's on your mind...",
    "contact.form.send": "Send Message",
    "contact.faq.heading": "Frequently Asked Questions",
    "contact.faq.q1": "What is a Navathon?",
    "contact.faq.a1":
      "A Navathon is a hackathon organized by Save the Children focused on building tech solutions for real community challenges.",
    "contact.faq.q2": "Do I need coding experience?",
    "contact.faq.a2":
      "Not at all! We welcome designers, problem-solvers, community workers, and domain experts just as much as developers.",
    "contact.faq.q3": "Are Navathons free to join?",
    "contact.faq.a3":
      "Yes - all Navathons are completely free for participants. Some in-person events may provide meals and accommodation too.",
    "contact.faq.q4": "Can I organize a Navathon?",
    "contact.faq.a4":
      "Absolutely. Fill out the contact form with 'Organize a Navathon' as your subject and our team will be in touch.",

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

    "hero.badge": "ការគាំទ្រដោយអង្គការ Save the Children កម្ពុជា",
    "hero.title.line1": "សូមស្វាគមន៍មកកាន់ NavaHub",
    "hero.whatIs": "តើ NavaHub ជាអ្វី?",
    "hero.eventsAnnouncement": "ការប្រកាសកម្មវិធី",
    "hero.eventsPrevious": "មុន",
    "hero.eventsNext": "បន្ទាប់",
    "hero.eventsGoTo": "ទៅកាន់ព្រឹត្តិការណ៍",
    "hero.subtitle":
      "NavaHub ជាគម្រោងរបស់ Save the Children កម្ពុជា ដែលភ្ជាប់យុវជន ដៃគូ និងសហគមន៍មូលដ្ឋាន ដើម្បីរួមគ្នាបង្កើតដំណោះស្រាយឌីជីថលជាក់ស្តែង សម្រាប់ការការពារកុមារ ការអប់រំ សុខភាព និងឱកាស។",

    "projects.heading": "គម្រោងសហគមន៍នៅកម្ពុជា",
    "projects.subtitle": "កម្មវិធីផ្តោតលើកុមារ គ្រួសារ និងសហគមន៍មូលដ្ឋាននៅកម្ពុជា។",
    "projects.hero.badge": "ដំណោះស្រាយសហគមន៍នៅកម្ពុជា",
    "projects.hero.titleBefore": "កម្ពុជា",
    "projects.hero.titleAccent": "គម្រោង",
    "projects.hero.intro":
      "ដំណោះស្រាយពិតប្រាកដ ដែលក្រុកក្រុមមូលដ្ឋានបានបង្កើតនៅកម្ពុជា ដើម្បីដោះស្រាយបញ្ហាសហគមន៍ និងកុមារជាក់ស្តែង។",
    "projects.card.members": "{team} · សមាជិក {n} នាក់",
    "projects.viewProject": "មើលគម្រោង",

    "events.heading": "ព្រឹត្តិការណ៍នាពេលខាងមុខនៅកម្ពុជា",
    "events.subtitle": "ចូលរួមកម្មវិធីមូលដ្ឋាន ដើម្បីគាំទ្រកុមារ និងយុវជនទូទាំងកម្ពុជា។",
    "events.calendar": "ប្រតិទិនកម្ពុជា",
    "events.join": "ចូលរួម",

    "about.hero.badge": "Save the Children",
    "about.hero.title.before": "យើងធ្វើឱ្យបច្ចេកវិទ្យា",
    "about.hero.title.accent": "មានប្រយោជន៍សម្រាប់កុមារនៅកម្ពុជា។",
    "about.hero.subtitle":
      "NavaHub គឺជាផ្ទះឌីជីថលរបស់ Navathon Cambodia ដែលរួមបញ្ចូលអ្នកអភិវឌ្ឍ អ្នករចនា និងអ្នកបង្កើតការផ្លាស់ប្តូរ ដើម្បីកសាងដំណោះស្រាយជាក់ស្តែងសម្រាប់កុមារ និងសហគមន៍ដែលខ្វះខាត។",
    "about.mission.title": "បេសកកម្មរបស់យើងនៅកម្ពុជា",
    "about.mission.p1":
      "Navathon កើតឡើងពីជំនឿដ៏សាមញ្ញមួយ៖ មនុស្សដែលអាចដោះស្រាយបញ្ហាសហគមន៍បានល្អបំផុត គឺជាមនុស្សដែលរស់នៅក្នុងបញ្ហានោះផ្ទាល់។ យើងភ្ជាប់ទេពកោសល្យបច្ចេកវិទ្យាក្នុងស្រុក ជាមួយបទពិសោធន៍សហគមន៍ដ៏ជ្រៅរបស់ Save the Children ដើម្បីបង្កើតដំណោះស្រាយដែលអាចប្រើបានពិត។",
    "about.mission.p2":
      "Navathon នីមួយៗ ត្រូវបានរៀបចំជុំវិញបញ្ហាសហគមន៍ជាក់លាក់ ដូចជា ទឹក ការអប់រំ សុវត្ថិភាពកុមារ និងសុខាភិបាល ហើយបញ្ចប់ដោយគំរូដំណោះស្រាយដែលផ្តល់ជូនសហគមន៍ដែលត្រូវការ។",
    "about.stats.events": "ព្រឹត្តិការណ៍",
    "about.stats.builders": "អ្នកបង្កើត",
    "about.stats.communities": "សហគមន៍",
    "about.card.title": "Save the Children",
    "about.card.body":
      "អង្គការ Save the Children បានធ្វើការការពារសិទ្ធិកុមារ និងលើកកម្ពស់ជីវភាពរបស់ពួកគេអស់រយៈពេលជាង 100 ឆ្នាំ។ NavaHub និង Navathon គឺជាផ្នែកមួយនៃការប្តេជ្ញាចិត្តលើនវានុវត្តន៍សម្រាប់អភិវឌ្ឍន៍សហគមន៍។",
    "about.values.heading": "អ្វីដែលយើងប្រកាន់ខ្ជាប់",
    "about.values.subtitle": "គោលការណ៍ដែលណែនាំ Navathon គ្រប់កម្មវិធី។",
    "about.values.communityFirst.title": "សហគមន៍ជាចម្បង",
    "about.values.communityFirst.desc":
      "សេចក្តីសម្រេចចិត្តរាល់យ៉ាងរបស់យើង ផ្អែកលើតម្រូវការពិតរបស់សហគមន៍ដែលយើងបម្រើ។",
    "about.values.innovation.title": "នវានុវត្តន៍",
    "about.values.innovation.desc": "យើងជឿថា បច្ចេកវិទ្យាដែលប្រើត្រឹមត្រូវ អាចដោះស្រាយបញ្ហាមនុស្សធ្ងន់ធ្ងរបាន។",
    "about.values.inclusivity.title": "ការរួមបញ្ចូល",
    "about.values.inclusivity.desc": "Navathon បើកចំហសម្រាប់មនុស្សគ្រប់គ្នា - មិនទាមទារបទពិសោធន៍ មានតែចិត្តចង់ជួយ។",
    "about.values.trustSafety.title": "ទំនុកចិត្ត និងសុវត្ថិភាព",
    "about.values.trustSafety.desc":
      "សកម្មភាពទាំងអស់គោរពតាមស្តង់ដារការពារ និងសុវត្ថិភាពកុមាររបស់ Save the Children។",
    "about.values.collaboration.title": "កិច្ចសហការ",
    "about.values.collaboration.desc": "យើងរីកចម្រើនជាមួយគ្នា - អ្នកចូលរួម មគ្គុទេសក៍ និងអង្គការធ្វើការខាងគ្នា។",
    "about.values.realImpact.title": "ផលប៉ះពាល់ពិតប្រាកដ",
    "about.values.realImpact.desc": "យើងវាស់ភាពជោគជ័យតាមជីវិតដែលបានផ្លាស់ប្តូរ មិនមែនតាមបន្ទាត់កូដ។",
    "about.timeline.heading": "ដំណើររបស់យើង",
    "about.timeline.2021": "Navathon លើកដំបូងនៅភ្នំពេញ ដោយមានអ្នកចូលរួម 40 នាក់។",
    "about.timeline.2022": "ពង្រីកទៅ 3 ខេត្ត។ ដំណោះស្រាយសហគមន៍ 12 ត្រូវបានដាក់ឱ្យប្រើ។",
    "about.timeline.2023": "Navathon អនឡាញលើកដំបូង - អ្នកចូលរួម 600+ មកពី 10 ប្រទេស។",
    "about.timeline.2024": "បើកដំណើរការវេទិកា NavaHub។ មានគម្រោង 80+ ត្រូវបានដាក់ស្នើ។",
    "about.timeline.2025": "អ្នកចូលរួម 8,000+។ សហគមន៍ 45+ ទទួលផលប៉ះពាល់។ កំពុងរីកចម្រើនជាសកល។",

    "contact.hero.badge": "ការគាំទ្រ និងភាពជាដៃគូនៅកម្ពុជា",
    "contact.hero.title.before": "ទាក់ទង",
    "contact.hero.title.accent": "យើងនៅកម្ពុជា",
    "contact.hero.subtitle":
      "មិនថាអ្នកចង់ចូលរួម រៀបចំ ឧបត្ថម្ភ ឬគាំទ្រកម្មវិធីនៅកម្ពុជា យើងត្រៀមជួយជានិច្ច។",
    "contact.details.heading": "ព័ត៌មានទំនាក់ទំនងនៅកម្ពុជា",
    "contact.follow": "តាមដានពួកយើង",
    "contact.info.email": "អ៊ីមែល",
    "contact.info.phone": "ទូរស័ព្ទ",
    "contact.info.address": "អាសយដ្ឋាន",
    "contact.info.addressValue": "ភ្នំពេញ កម្ពុជា",
    "contact.map.office": "ការិយាល័យភ្នំពេញ កម្ពុជា",
    "contact.success.title": "បានផ្ញើសាររួចរាល់!",
    "contact.success.body": "អរគុណសម្រាប់ការទាក់ទង។ ក្រុមការងារយើងនឹងឆ្លើយតបក្នុងរយៈពេល 1-2 ថ្ងៃធ្វើការ។",
    "contact.success.cta": "ផ្ញើសារថ្មីម្តងទៀត",
    "contact.form.title": "ផ្ញើសារ",
    "contact.form.firstName": "នាមខ្លួន",
    "contact.form.lastName": "នាមត្រកូល",
    "contact.form.email": "អ៊ីមែល",
    "contact.form.subject": "ប្រធានបទ",
    "contact.form.subject.join": "ចូលរួម Navathon Cambodia",
    "contact.form.subject.organize": "រៀបចំ Navathon",
    "contact.form.subject.sponsor": "ឧបត្ថម្ភ / ជាដៃគូ",
    "contact.form.subject.media": "សំណួរព័ត៌មាន",
    "contact.form.subject.other": "ផ្សេងៗ",
    "contact.form.message": "សារ",
    "contact.form.messagePlaceholder": "ប្រាប់យើងពីអ្វីដែលអ្នកចង់ចែករំលែក...",
    "contact.form.send": "ផ្ញើសារ",
    "contact.faq.heading": "សំណួរដែលគេសួរញឹកញាប់",
    "contact.faq.q1": "តើ Navathon ជាអ្វី?",
    "contact.faq.a1":
      "Navathon គឺជា hackathon ដែលរៀបចំដោយ Save the Children ដើម្បីកសាងដំណោះស្រាយបច្ចេកវិទ្យាសម្រាប់បញ្ហាសហគមន៍ពិតប្រាកដ។",
    "contact.faq.q2": "តើខ្ញុំត្រូវមានបទពិសោធន៍សរសេរកូដទេ?",
    "contact.faq.a2":
      "មិនចាំបាច់ទេ! យើងស្វាគមន៍អ្នករចនា អ្នកដោះស្រាយបញ្ហា បុគ្គលិកសហគមន៍ និងអ្នកជំនាញវិស័យ ដូចគ្នានឹងអ្នកអភិវឌ្ឍ។",
    "contact.faq.q3": "តើការចូលរួម Navathon គិតថ្លៃទេ?",
    "contact.faq.a3":
      "ឥតគិតថ្លៃទាំងស្រុងសម្រាប់អ្នកចូលរួម។ សម្រាប់កម្មវិធីមួយចំនួនដែលធ្វើផ្ទាល់ អាចមានអាហារ និងកន្លែងស្នាក់នៅផងដែរ។",
    "contact.faq.q4": "តើខ្ញុំអាចរៀបចំ Navathon មួយបានទេ?",
    "contact.faq.a4":
      "បានជាក់ជាមិនខាន។ សូមបំពេញទម្រង់ទំនាក់ទំនង ដោយជ្រើសប្រធានបទ 'រៀបចំ Navathon' ហើយក្រុមការងារយើងនឹងទាក់ទងទៅអ្នក។",

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
