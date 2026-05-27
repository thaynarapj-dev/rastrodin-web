import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';

interface ProfileProps {
  isMobile?: boolean;
}

export function Profile({ isMobile = false }: ProfileProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <h1 className="text-2xl text-foreground mb-6">Perfil</h1>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-accent-foreground" />
                </button>
              </div>
              <div>
                <h2 className="text-xl text-foreground mb-1">Usuário Demo</h2>
                <p className="text-muted-foreground">Administrador</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">usuario@rastrodin.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="text-foreground">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="text-foreground">São Paulo, SP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-6">
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <p className="text-sm text-muted-foreground mb-1">Transações</p>
            <p className="text-2xl text-foreground">156</p>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-sm p-4">
            <p className="text-sm text-muted-foreground mb-1">Categorias</p>
            <p className="text-2xl text-foreground">7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
