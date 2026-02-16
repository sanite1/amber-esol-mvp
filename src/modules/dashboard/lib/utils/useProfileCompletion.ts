// lib/hooks/useProfileCompletion.ts
import { useMemo } from "react";
import { useFetchUserDetails } from "../api/authOnboarding";
import { getDecodedJwt } from "../auth";

export const useProfileCompletion = () => {
  const user = getDecodedJwt();
  const { data: userDetails, isLoading } = useFetchUserDetails(user?.id);

  const completion = useMemo(() => {
    if (!userDetails?.verification) {
      return {
        percentage: 0,
        completed: 0,
        total: 4,
        items: {
          email: false,
          address: false,
          ssn: false,
          document: false,
        },
      };
    }

    const verification = userDetails.verification;

    const items = {
      email: userDetails?.dateOfBirth ?? false,
      // address: verification.addressVerified ?? false,
      ssn: verification.ssnVerificationStatus !== "not_started" ?? false,
      // document: verification.documentVerified ?? false,
    };

    const completed = Object.values(items).filter(Boolean).length;
    const total = Object.keys(items).length;
    const percentage = Math.round((completed / total) * 100);

    return { percentage, completed, total, items };
  }, [userDetails]);

  return { ...completion, isLoading };
};
