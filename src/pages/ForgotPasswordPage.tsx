import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { FormAlert, PasswordField } from "@/components/ui/FormControls";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDom";
import { useForm, type Rule } from "@/hooks/useForm";
import { useI18n } from "@/i18n";
import { requestPasswordReset, resetPassword } from "@/lib/auth";
import { compose, email, password, required, resetCode } from "@/lib/validation";

type ResetField = "code" | "password" | "confirm";

const resetRules: Record<ResetField, Rule<ResetField>> = {
  code: compose(required, resetCode),
  password: compose(required, password),
  confirm: (v, all) => required(v) ?? (v === all.password ? null : "passwordMatch"),
};

const digits = (v: string) => v.replace(/\D/g, "").slice(0, 6);

type Step =
  | { name: "request" }
  | { name: "reset"; email: string; demoCode: string | null }
  | { name: "done" };

function RequestStep({ onSent }: { onSent: (email: string, demoCode: string | null) => void }) {
  const { t } = useI18n();
  const { errorMessage } = useAuth();
  const form = useForm({ rules: { email: compose(required, email) }, initial: { email: "" } });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.validate(e.currentTarget);
    if (!values) return;
    setPending(true);
    setError(null);
    try {
      onSent(values.email, await requestPasswordReset(values.email));
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      {error && <FormAlert>{error}</FormAlert>}
      <TextField
        label={t.auth.fields.email}
        {...form.field("email")}
        type="email"
        autoComplete="email"
        inputMode="email"
        dir="ltr"
      />
      <Button type="submit" size="lg" block disabled={pending}>
        {pending ? t.auth.sending : t.auth.sendCode}
      </Button>
    </form>
  );
}

function ResetStep({
  email: address,
  demoCode,
  onDone,
  onRestart,
}: {
  email: string;
  demoCode: string | null;
  onDone: () => void;
  onRestart: () => void;
}) {
  const { t } = useI18n();
  const { errorMessage } = useAuth();
  const form = useForm({
    rules: resetRules,
    initial: { code: "", password: "", confirm: "" },
    format: { code: digits },
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = form.validate(e.currentTarget);
    if (!values) return;
    setPending(true);
    setError(null);
    try {
      await resetPassword(address, values.code, values.password);
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <FormAlert tone="success">{t.auth.codeSent}</FormAlert>
      {demoCode && (
        <div className="border border-dashed border-sand bg-bone/60 p-5">
          <p className="label mb-2 text-stone">{t.auth.demoInboxTitle}</p>
          <p className="text-sm leading-relaxed">{t.auth.demoInboxBody(demoCode)}</p>
        </div>
      )}
      {error && <FormAlert>{error}</FormAlert>}
      <TextField
        label={t.auth.fields.code}
        {...form.field("code")}
        autoComplete="one-time-code"
        inputMode="numeric"
        placeholder="000000"
        dir="ltr"
        className="tracking-[0.4em]"
      />
      <PasswordField
        label={t.auth.fields.newPassword}
        {...form.field("password")}
        autoComplete="new-password"
        hint={t.auth.passwordHint}
        meter
      />
      <PasswordField
        label={t.auth.fields.confirmPassword}
        {...form.field("confirm")}
        autoComplete="new-password"
      />
      <Button type="submit" size="lg" block disabled={pending}>
        {pending ? t.auth.resetting : t.auth.resetPassword}
      </Button>
      <button
        type="button"
        onClick={onRestart}
        className="link-underline self-start text-sm text-ink-soft"
      >
        {t.auth.useDifferentEmail}
      </button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>({ name: "request" });
  useDocumentTitle(t.meta.forgot);

  const backToLogin = (
    <Link to="/login" className="link-underline text-ink">
      {t.auth.backToLogin}
    </Link>
  );

  if (step.name === "done") {
    return (
      <AuthLayout title={t.auth.resetDoneTitle} body={t.auth.resetDoneBody}>
        <ButtonLink to="/login" size="lg" block>
          {t.auth.signIn}
        </ButtonLink>
      </AuthLayout>
    );
  }

  if (step.name === "reset") {
    return (
      <AuthLayout
        title={t.auth.resetTitle}
        body={t.auth.resetBody(step.email)}
        footer={backToLogin}
      >
        <ResetStep
          email={step.email}
          demoCode={step.demoCode}
          onDone={() => {
            setStep({ name: "done" });
          }}
          onRestart={() => {
            setStep({ name: "request" });
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t.auth.forgotTitle} body={t.auth.forgotBody} footer={backToLogin}>
      <RequestStep
        onSent={(address, demoCode) => {
          setStep({ name: "reset", email: address, demoCode });
        }}
      />
    </AuthLayout>
  );
}
