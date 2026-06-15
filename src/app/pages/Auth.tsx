import { FormEvent, useState } from 'react';
import { CircleDollarSign, Lock, LogIn, Mail, User, UserPlus } from 'lucide-react';
import { AuthSession, signIn, signUp } from '../service/auth';

interface AuthProps {
  onAuthenticated: (session: AuthSession) => void;
  initialError?: string | null;
  initialMessage?: string | null;
}

type AuthMode = 'sign-in' | 'sign-up';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

export function Auth({ onAuthenticated, initialError = null, initialMessage = null }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(initialMessage);
  const [error, setError] = useState<string | null>(initialError);

  const isSignUp = mode === 'sign-up';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const session = await signUp({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        if (!session) {
          setMessage('Conta criada. Verifique seu e-mail para confirmar o cadastro.');
          setFormData(initialForm);
          return;
        }

        onAuthenticated(session);
        return;
      }

      const session = await signIn({
        email: formData.email.trim(),
        password: formData.password,
      });
      onAuthenticated(session);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Não foi possível autenticar.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-[1fr_420px]">
          <section className="flex min-h-[520px] flex-col justify-between bg-primary p-8 text-primary-foreground">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <CircleDollarSign className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl">RastroDin</h1>
                  <p className="text-sm text-primary-foreground/75">Financeiro compartilhado</p>
                </div>
              </div>

              <div className="max-w-md">
                <h2 className="mb-3 text-3xl">Organize as contas da casa com clareza.</h2>
                <p className="text-primary-foreground/75">
                  Cadastre transações, acompanhe categorias e prepare o caminho para compartilhar a rotina financeira com quem divide os planos com você.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-primary-foreground/80 sm:grid-cols-3 md:grid-cols-1">
              <div className="rounded-lg bg-white/10 p-3">Categorias personalizadas</div>
              <div className="rounded-lg bg-white/10 p-3">Formas de pagamento</div>
              <div className="rounded-lg bg-white/10 p-3">Resumo rápido</div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl text-foreground">
                {isSignUp ? 'Criar conta' : 'Entrar'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignUp
                  ? 'Comece criando seu acesso ao RastroDin.'
                  : 'Acesse sua área financeira.'}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => switchMode('sign-in')}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  !isSignUp
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => switchMode('sign-up')}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  isSignUp
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Criar conta
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-red-50 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-lg border border-primary/20 bg-green-50 px-4 py-3 text-sm text-primary">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="mb-2 block text-sm text-card-foreground">Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-input-background py-3 pl-12 pr-4 text-foreground"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-card-foreground">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background py-3 pl-12 pr-4 text-foreground"
                    placeholder="voce@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-card-foreground">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({ ...formData, password: event.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-input-background py-3 pl-12 pr-4 text-foreground"
                    placeholder="Sua senha"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                {isSubmitting
                  ? 'Aguarde...'
                  : isSignUp
                    ? 'Criar conta'
                    : 'Entrar'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
