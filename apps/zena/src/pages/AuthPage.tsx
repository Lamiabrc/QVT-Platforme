import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
    });
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/choose-sphere" },
    });

    if (error) {
      setStatus("Impossible d'envoyer le lien. Verifiez l'adresse.");
      return;
    }

    setStatus("Lien envoye. Verifiez votre email.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
  };

  return (
    <section className="max-w-xl space-y-6">
      <h1 className="text-3xl font-semibold">Connexion ZENA</h1>
      <p className="text-sm text-muted-foreground">
        Un lien magique est envoye par email pour acceder a ZENA.
      </p>

      <form onSubmit={handleLogin} className="space-y-3">
        <label className="block text-sm">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          placeholder="prenom@exemple.com"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Envoyer le lien
        </button>
      </form>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}

      {userEmail ? (
        <div className="rounded-xl border border-border p-4 text-sm">
          Connecte en tant que {userEmail}.
          <button
            onClick={handleLogout}
            className="ml-3 text-primary underline"
          >
            Se deconnecter
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default AuthPage;
