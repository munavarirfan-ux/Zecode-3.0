import {
  createEducationEntry,
  profileUid,
  type CandidateEditProfile,
} from "./candidateProfile";

export type ParsedResumePatch = Partial<
  Pick<
    CandidateEditProfile,
    | "firstName"
    | "middleName"
    | "lastName"
    | "email"
    | "mobile"
    | "skills"
    | "education"
    | "employers"
    | "socialLinks"
  >
>;

/** Simulated CV parse — prefills profile fields for demo */
export async function parseResumeFile(_fileName: string): Promise<ParsedResumePatch> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return {
    firstName: "Alex",
    middleName: "Jordan",
    lastName: "Morgan",
    email: "alex.morgan@email.com",
    mobile: "+49 170 555 0192",
    skills: ["Figma", "Design systems", "User research", "Prototyping"],
    education: [
      createEducationEntry("10th", {
        required: true,
        seed: { details: "Delhi Public School · 2010 · 90%" },
      }),
      createEducationEntry("12th", {
        required: true,
        seed: { details: "Delhi Public School · 2012 · 92%" },
      }),
      createEducationEntry("Bachelors", {
        required: true,
        seed: {
          details: "National Institute of Design, Ahmedabad, IN\n2016 · 8.6 CGPA",
        },
      }),
      createEducationEntry("Master's", {
        required: false,
        isHighest: true,
        seed: {
          details: "UdK Berlin, Berlin, DE\n2018 · Grade 1.4",
        },
      }),
    ],
    employers: [
      {
        id: profileUid(),
        designation: "",
        company: "",
        fromDate: "",
        toDate: "",
        current: true,
        summary:
          "Senior Product Designer — Northwind Systems (Mar 2021 – Present)\nLed design system adoption across 3 product squads; shipped recruiter workflows used by 40+ teams.",
      },
      {
        id: profileUid(),
        designation: "",
        company: "",
        fromDate: "",
        toDate: "",
        current: false,
        summary:
          "Product Designer — Studio Lattice (Jun 2018 – Feb 2021)\nOwned end-to-end flows for B2B analytics dashboards.",
      },
    ],
    socialLinks: [
      { id: profileUid(), label: "LinkedIn", url: "https://linkedin.com/in/alex-morgan" },
      { id: profileUid(), label: "Portfolio", url: "https://alexmorgan.design" },
      { id: profileUid(), label: "GitHub", url: "https://github.com/alexmorgan" },
    ],
  };
}

export function mergeParsedResume(
  profile: CandidateEditProfile,
  patch: ParsedResumePatch,
): CandidateEditProfile {
  return {
    ...profile,
    ...patch,
    education: patch.education ?? profile.education,
    employers: patch.employers ?? profile.employers,
    socialLinks: patch.socialLinks ?? profile.socialLinks,
    skills: patch.skills ?? profile.skills,
  };
}
