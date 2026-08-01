"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import useResendVerification from "../../hooks/useResendVerification";
import Timer from "./Timer";
import useTimer from "../../store/timerStore";
import { FORGOT_PASSWORD_DURATION } from "../..";

interface IResendVerificationProps {
  email: string;
}

function ResendVerification({ email }: IResendVerificationProps) {
  const tAuth = useTranslations("Auth.verifyEmail");

  const running = useTimer((state) => state.running);
  const startTimer = useTimer((state) => state.start);

  const { mutate, isPending } = useResendVerification();

  return (
    <div>
      {running ? (
        <Timer />
      ) : (
        <Button
          disabled={isPending}
          variant={"link"}
          className="text-primary hover:underline cursor-pointer"
          onClick={() => {
            mutate(
              { email },
              {
                onSuccess: () => {
                  startTimer(FORGOT_PASSWORD_DURATION);
                },
              },
            );
          }}
        >
          {isPending ? <Spinner /> : tAuth("resendEmail")}
        </Button>
      )}
    </div>
  );
}

export default ResendVerification;
