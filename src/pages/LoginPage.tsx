import { useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { CheckboxField, FormAlert, PasswordField } from "@/components/ui/FormControls";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDom";
import { useForm } from "@/hooks/useForm";
import { useI18n } from "@/i18n";
import { safeRedirect } from "@/lib/navigation";
import { compose, email, required } from "@/lib/validation";

const rules = { email: compose(required, email), password: required };

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");
  const { signIn, errorMessage } = useAuth();
  const form = useForm({ rules, initial: { email: "", password: "" } });
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useDocumentTitle(t.meta.login);

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const values = form.validate(e.currentTarget);
    if (!values) return;
    setPending(true);
    try {
      await signIn(values.email, values.password, remember);
      void navigate(safeRedirect(redirect), { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  };

  const keepRedirect = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  return (
    <AuthLayout
      title={t.auth.loginTitle}
      body={t.auth.loginBody}
      footer={
        <>
          {t.auth.noAccount}{" "}
          <Link to={`/signup${keepRedirect}`} className="link-underline text-ink">
            {t.auth.signupLink}
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        {redirect?.startsWith("/checkout") && (
          <FormAlert tone="info">{t.auth.checkoutRequired}</FormAlert>
        )}
        {error && <FormAlert>{error}</FormAlert>}
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
          autoComplete="current-password"
          aside={
            <Link to="/forgot-password" className="link-underline text-[0.8125rem] text-ink-soft">
              {t.auth.forgotLink}
            </Link>
          }
        />
        <CheckboxField
          checked={remember}
          onChange={(e) => {
            setRemember(e.target.checked);
          }}
        >
          {t.auth.remember}
        </CheckboxField>
        <Button type="submit" size="lg" block disabled={pending}>
          {pending ? t.auth.signingIn : t.auth.signIn}
        </Button>
      </form>
    </AuthLayout>
  );
}
