import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { CheckboxField, FormAlert, PasswordField } from "@/components/ui/FormControls";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDom";
import { useForm, type Rule } from "@/hooks/useForm";
import { useI18n } from "@/i18n";
import { safeRedirect } from "@/lib/navigation";
import { compose, email, password, required } from "@/lib/validation";

type Field = "firstName" | "lastName" | "email" | "password" | "confirm" | "terms";

const rules: Record<Field, Rule<Field>> = {
  firstName: required,
  lastName: required,
  email: compose(required, email),
  password: compose(required, password),
  confirm: (v, all) => required(v) ?? (v === all.password ? null : "passwordMatch"),
  terms: (v) => (v === "yes" ? null : "terms"),
};

const initial: Record<Field, string> = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
  terms: "",
};

export default function SignupPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const { signUp, errorMessage } = useAuth();
  const form = useForm({ rules, initial });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useDocumentTitle(t.meta.signup);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const values = form.validate(e.currentTarget);
    if (!values) return;
    setPending(true);
    try {
      await signUp({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      void navigate(safeRedirect(redirect), { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  };

  const terms = form.field("terms");
  const keepRedirect = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  return (
    <AuthLayout
      title={t.auth.signupTitle}
      body={t.auth.signupBody}
      footer={
        <>
          {t.auth.haveAccount}{" "}
          <Link to={`/login${keepRedirect}`} className="link-underline text-ink">
            {t.auth.loginLink}
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        {error && <FormAlert>{error}</FormAlert>}
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label={t.auth.fields.firstName}
            {...form.field("firstName")}
            autoComplete="given-name"
          />
          <TextField
            label={t.auth.fields.lastName}
            {...form.field("lastName")}
            autoComplete="family-name"
          />
        </div>
        <TextField
          label={t.auth.fields.email}
          {...form.field("email")}
          type="email"
          autoComplete="email"
          inputMode="email"
          dir="ltr"
        />
        <PasswordField
          label={t.auth.fields.password}
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
        <CheckboxField
          name={terms.name}
          checked={terms.value === "yes"}
          error={terms.error}
          onChange={(e) => {
            form.setValue("terms", e.target.checked ? "yes" : "");
          }}
        >
          {t.auth.terms}
        </CheckboxField>
        <Button type="submit" size="lg" block disabled={pending}>
          {pending ? t.auth.creatingAccount : t.auth.createAccount}
        </Button>
      </form>
    </AuthLayout>
  );
}
