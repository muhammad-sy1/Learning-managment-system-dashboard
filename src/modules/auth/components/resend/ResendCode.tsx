"use client";

import useForgotPassword from "../../hooks/useForgotPassword";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import Timer from "./Timer";
import { useFormContext } from "react-hook-form";
import { verifyCodeSchema } from "../../schemas/verifyCodeSchema";
import useTimer from "../../store/timerStore";
import { FORGOT_PASSWORD_DURATION } from "../..";
import { useTranslations } from "next-intl";

interface IResendCodeProps {
  type: "reset" | "registration";
}

function ResendCode({ type = "reset" }: IResendCodeProps) {
  const form = useFormContext<verifyCodeSchema>();
  const tAuth = useTranslations("Auth.verifyCode");

  const running = useTimer((state) => state.running);
  const startTimer = useTimer((state) => state.start);

  const { mutate, isPending } = useForgotPassword();
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
              { email: form.watch("email"), type },
              {
                onSuccess: (data) => {
                  startTimer(
                    data?.can_resend_after ?? FORGOT_PASSWORD_DURATION
                  );
                },
              }
            );
          }}
        >
          {isPending ? <Spinner /> : tAuth("resendCode")}
        </Button>
      )}
    </div>
  );
}

export default ResendCode;
