// src/data/student/studentProfileData.ts

export type LanguageLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper-intermediate"
  | "advanced"
  | "proficiency";

export type ScheduleSlot = "morning" | "afternoon" | "evening" | "weekend";

export interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  timezone: string;
  bio: string;
  nativeLanguage: string;
  currentLevel: LanguageLevel;
  targetLevel: LanguageLevel;
  learningGoals: string[];
  preferredSchedule: ScheduleSlot[];
  verified: boolean;
  isActive: boolean;
}

export const languageLevels: { value: LanguageLevel; label: string }[] = [
  { value: "beginner", label: "A1 – Beginner" },
  { value: "elementary", label: "A2 – Elementary" },
  { value: "intermediate", label: "B1 – Intermediate" },
  { value: "upper-intermediate", label: "B2 – Upper Intermediate" },
  { value: "advanced", label: "C1 – Advanced" },
  { value: "proficiency", label: "C2 – Proficiency" },
];

export const countryOptions = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "São Tomé and Príncipe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// src/modules/dashboard/data/timezoneOptions.ts

export interface TimezoneOption {
  value: string; // IANA identifier (what gets stored)
  label: string; // What the user sees in the dropdown
  offset: string; // For sorting/grouping
}

export const timezoneOptions: TimezoneOption[] = [
  // UTC-12:00
  { value: "Etc/GMT+12", label: "(UTC-12:00) Baker Island", offset: "-12:00" },

  // UTC-11:00
  {
    value: "Pacific/Pago_Pago",
    label: "(UTC-11:00) American Samoa",
    offset: "-11:00",
  },

  // UTC-10:00
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii", offset: "-10:00" },

  // UTC-09:00
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska", offset: "-09:00" },

  // UTC-08:00
  {
    value: "America/Los_Angeles",
    label: "(UTC-08:00) Pacific Time (US & Canada)",
    offset: "-08:00",
  },
  {
    value: "America/Tijuana",
    label: "(UTC-08:00) Tijuana, Baja California",
    offset: "-08:00",
  },

  // UTC-07:00
  {
    value: "America/Denver",
    label: "(UTC-07:00) Mountain Time (US & Canada)",
    offset: "-07:00",
  },
  {
    value: "America/Phoenix",
    label: "(UTC-07:00) Arizona (no DST)",
    offset: "-07:00",
  },

  // UTC-06:00
  {
    value: "America/Chicago",
    label: "(UTC-06:00) Central Time (US & Canada)",
    offset: "-06:00",
  },
  {
    value: "America/Mexico_City",
    label: "(UTC-06:00) Mexico City",
    offset: "-06:00",
  },

  // UTC-05:00
  {
    value: "America/New_York",
    label: "(UTC-05:00) Eastern Time (US & Canada)",
    offset: "-05:00",
  },
  {
    value: "America/Bogota",
    label: "(UTC-05:00) Bogotá, Lima",
    offset: "-05:00",
  },
  { value: "America/Toronto", label: "(UTC-05:00) Toronto", offset: "-05:00" },

  // UTC-04:00
  {
    value: "America/Halifax",
    label: "(UTC-04:00) Atlantic Time (Canada)",
    offset: "-04:00",
  },
  { value: "America/Caracas", label: "(UTC-04:00) Caracas", offset: "-04:00" },
  {
    value: "America/Santiago",
    label: "(UTC-04:00) Santiago",
    offset: "-04:00",
  },

  // UTC-03:00
  {
    value: "America/Sao_Paulo",
    label: "(UTC-03:00) São Paulo",
    offset: "-03:00",
  },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "(UTC-03:00) Buenos Aires",
    offset: "-03:00",
  },

  // UTC-02:00
  {
    value: "Atlantic/South_Georgia",
    label: "(UTC-02:00) South Georgia",
    offset: "-02:00",
  },

  // UTC-01:00
  { value: "Atlantic/Azores", label: "(UTC-01:00) Azores", offset: "-01:00" },
  {
    value: "Atlantic/Cape_Verde",
    label: "(UTC-01:00) Cape Verde",
    offset: "-01:00",
  },

  // UTC+00:00
  {
    value: "Europe/London",
    label: "(UTC+00:00) London, Edinburgh",
    offset: "+00:00",
  },
  { value: "Europe/Lisbon", label: "(UTC+00:00) Lisbon", offset: "+00:00" },
  {
    value: "Africa/Nigeria",
    label: "(UTC+00:00) Nigeria, Ghana",
    offset: "+00:00",
  },
  {
    value: "Africa/Casablanca",
    label: "(UTC+00:00) Casablanca",
    offset: "+00:00",
  },

  // UTC+01:00
  {
    value: "Europe/Paris",
    label: "(UTC+01:00) Paris, Berlin, Amsterdam",
    offset: "+01:00",
  },
  {
    value: "Europe/Madrid",
    label: "(UTC+01:00) Madrid, Barcelona",
    offset: "+01:00",
  },
  { value: "Europe/Rome", label: "(UTC+01:00) Rome, Milan", offset: "+01:00" },
  {
    value: "Europe/Warsaw",
    label: "(UTC+01:00) Warsaw, Prague",
    offset: "+01:00",
  },
  {
    value: "Africa/Lagos",
    label: "(UTC+01:00) Lagos, West Africa",
    offset: "+01:00",
  },
  { value: "Europe/Brussels", label: "(UTC+01:00) Brussels", offset: "+01:00" },

  // UTC+02:00
  {
    value: "Europe/Athens",
    label: "(UTC+02:00) Athens, Bucharest",
    offset: "+02:00",
  },
  {
    value: "Europe/Helsinki",
    label: "(UTC+02:00) Helsinki, Kyiv",
    offset: "+02:00",
  },
  { value: "Europe/Istanbul", label: "(UTC+02:00) Istanbul", offset: "+02:00" },
  { value: "Africa/Cairo", label: "(UTC+02:00) Cairo", offset: "+02:00" },
  {
    value: "Africa/Johannesburg",
    label: "(UTC+02:00) Johannesburg, South Africa",
    offset: "+02:00",
  },
  { value: "Asia/Jerusalem", label: "(UTC+02:00) Jerusalem", offset: "+02:00" },

  // UTC+03:00
  {
    value: "Europe/Moscow",
    label: "(UTC+03:00) Moscow, St. Petersburg",
    offset: "+03:00",
  },
  {
    value: "Asia/Riyadh",
    label: "(UTC+03:00) Riyadh, Kuwait",
    offset: "+03:00",
  },
  {
    value: "Africa/Nairobi",
    label: "(UTC+03:00) Nairobi, East Africa",
    offset: "+03:00",
  },
  { value: "Asia/Baghdad", label: "(UTC+03:00) Baghdad", offset: "+03:00" },

  // UTC+03:30
  { value: "Asia/Tehran", label: "(UTC+03:30) Tehran", offset: "+03:30" },

  // UTC+04:00
  {
    value: "Asia/Dubai",
    label: "(UTC+04:00) Dubai, Abu Dhabi",
    offset: "+04:00",
  },
  { value: "Asia/Baku", label: "(UTC+04:00) Baku", offset: "+04:00" },

  // UTC+04:30
  { value: "Asia/Kabul", label: "(UTC+04:30) Kabul", offset: "+04:30" },

  // UTC+05:00
  {
    value: "Asia/Karachi",
    label: "(UTC+05:00) Karachi, Islamabad",
    offset: "+05:00",
  },
  { value: "Asia/Tashkent", label: "(UTC+05:00) Tashkent", offset: "+05:00" },

  // UTC+05:30
  {
    value: "Asia/Kolkata",
    label: "(UTC+05:30) Mumbai, New Delhi, Kolkata",
    offset: "+05:30",
  },
  { value: "Asia/Colombo", label: "(UTC+05:30) Sri Lanka", offset: "+05:30" },

  // UTC+05:45
  { value: "Asia/Kathmandu", label: "(UTC+05:45) Kathmandu", offset: "+05:45" },

  // UTC+06:00
  { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka", offset: "+06:00" },
  { value: "Asia/Almaty", label: "(UTC+06:00) Almaty", offset: "+06:00" },

  // UTC+06:30
  { value: "Asia/Yangon", label: "(UTC+06:30) Yangon", offset: "+06:30" },

  // UTC+07:00
  {
    value: "Asia/Bangkok",
    label: "(UTC+07:00) Bangkok, Jakarta",
    offset: "+07:00",
  },
  {
    value: "Asia/Ho_Chi_Minh",
    label: "(UTC+07:00) Ho Chi Minh City",
    offset: "+07:00",
  },

  // UTC+08:00
  {
    value: "Asia/Shanghai",
    label: "(UTC+08:00) Beijing, Shanghai",
    offset: "+08:00",
  },
  { value: "Asia/Hong_Kong", label: "(UTC+08:00) Hong Kong", offset: "+08:00" },
  {
    value: "Asia/Singapore",
    label: "(UTC+08:00) Singapore, Kuala Lumpur",
    offset: "+08:00",
  },
  { value: "Asia/Taipei", label: "(UTC+08:00) Taipei", offset: "+08:00" },
  { value: "Australia/Perth", label: "(UTC+08:00) Perth", offset: "+08:00" },

  // UTC+09:00
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo, Osaka", offset: "+09:00" },
  { value: "Asia/Seoul", label: "(UTC+09:00) Seoul", offset: "+09:00" },

  // UTC+09:30
  { value: "Australia/Darwin", label: "(UTC+09:30) Darwin", offset: "+09:30" },
  {
    value: "Australia/Adelaide",
    label: "(UTC+09:30) Adelaide",
    offset: "+09:30",
  },

  // UTC+10:00
  {
    value: "Australia/Sydney",
    label: "(UTC+10:00) Sydney, Melbourne",
    offset: "+10:00",
  },
  {
    value: "Australia/Brisbane",
    label: "(UTC+10:00) Brisbane (no DST)",
    offset: "+10:00",
  },
  { value: "Pacific/Guam", label: "(UTC+10:00) Guam", offset: "+10:00" },

  // UTC+11:00
  {
    value: "Pacific/Noumea",
    label: "(UTC+11:00) New Caledonia",
    offset: "+11:00",
  },

  // UTC+12:00
  {
    value: "Pacific/Auckland",
    label: "(UTC+12:00) Auckland, Wellington",
    offset: "+12:00",
  },
  { value: "Pacific/Fiji", label: "(UTC+12:00) Fiji", offset: "+12:00" },

  // UTC+13:00
  { value: "Pacific/Tongatapu", label: "(UTC+13:00) Tonga", offset: "+13:00" },
];

export const nativeLanguageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
  "Turkish",
  "Dutch",
  "Other",
];

export const goalOptions = [
  "Conversational fluency",
  "Business English",
  "Exam preparation (IELTS/TOEFL)",
  "Academic writing",
  "Travel communication",
  "Accent reduction",
  "Grammar improvement",
  "Vocabulary expansion",
];

export const scheduleOptions: { value: ScheduleSlot; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "weekend", label: "Weekend" },
];
