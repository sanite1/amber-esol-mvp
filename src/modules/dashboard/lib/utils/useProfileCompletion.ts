import { useMemo } from "react";
import { useFetchUserById } from "../api/authOnboarding";
import { getDecodedJwt } from "../auth";
import { UserData } from "../types/authOnboarding";

interface CompletionItem {
  label: string;
  done: boolean;
}

interface ProfileCompletion {
  percentage: number;
  completed: number;
  total: number;
  items: CompletionItem[];
  isLoading: boolean;
}

const getStudentItems = (user: UserData): CompletionItem[] => [
  {
    label: "Profile picture",
    done: !!user.profilePicture,
  },
  {
    label: "Address",
    done: !!user.address?.country,
  },
  {
    label: "Phone number",
    done: !!user.phoneNumber,
  },
  {
    label: "Learning preferences",
    done: !!user.learningPreferences?.currentLevel,
  },
  {
    label: "Bio",
    done: !!user.bio,
  },
];

const getTutorItems = (user: UserData): CompletionItem[] => [
  {
    label: "Profile picture",
    done: !!user.profilePicture,
  },
  {
    label: "Date of birth",
    done: !!user.dateOfBirth,
  },
  {
    label: "Address",
    done: !!user.address?.country,
  },
  {
    label: "Bio",
    done: !!user.bio && user.bio.length >= 50,
  },
  {
    label: "Languages",
    done: !!user.languages && user.languages.length > 0,
  },
  {
    label: "Hourly rate",
    done: !!user.hourlyRate && user.hourlyRate > 0,
  },
  {
    label: "Certifications",
    done: !!user.certifications && user.certifications.length > 0,
  },
  {
    label: "Education",
    done: !!user.education && user.education.length > 0,
  },
  {
    label: "Specializations",
    done: !!user.specializations && user.specializations.length > 0,
  },
  {
    label: "Teaching preferences",
    done: !!user.teachingPreferences?.lessonTypes?.length,
  },
];

const getAdminItems = (user: UserData): CompletionItem[] => [
  {
    label: "Profile picture",
    done: !!user.profilePicture,
  },
  {
    label: "Phone number",
    done: !!user.phoneNumber,
  },
];

export const useProfileCompletion = (): ProfileCompletion => {
  const decoded = getDecodedJwt();
  const { data: userDetails, isLoading } = useFetchUserById(decoded?.id || "");

  const completion = useMemo(() => {
    if (!userDetails) {
      return {
        percentage: 0,
        completed: 0,
        total: 0,
        items: [] as CompletionItem[],
      };
    }

    let items: CompletionItem[];

    switch (userDetails.role) {
      case "tutor":
        items = getTutorItems(userDetails);
        break;
      case "admin":
        items = getAdminItems(userDetails);
        break;
      default:
        items = getStudentItems(userDetails);
    }

    const completed = items.filter((item) => item.done).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { percentage, completed, total, items };
  }, [userDetails]);

  return { ...completion, isLoading };
};
