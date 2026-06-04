import {
  ArrowLeft,
  CircleDollarSign,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  getPaymentMethodIcon,
  paymentMethodTypes,
  translatePaymentMethodType,
} from '../components/shared/icons';
import {
  PaymentMethod,
  PaymentMethodTypeEnum,
} from '../interfaces/PaymentMethods';
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  type PaymentMethodPayload,
} from '../service';

interface PaymentMethodsSettingsProps {
  isMobile?: boolean;
  onBack: () => void;
}

const initialForm: PaymentMethodPayload = {
  name: '',
  type: PaymentMethodTypeEnum.PIX,
  description: '',
  active: true,
};

export function PaymentMethodsSettings({
  isMobile = false,
  onBack,
}: PaymentMethodsSettingsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState<PaymentMethodPayload>(initialForm);
  const [editingPaymentMethodId, setEditingPaymentMethodId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPaymentMethodId, setDeletingPaymentMethodId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        setIsLoading(true);
        setError(null);
        const apiPaymentMethods = await getPaymentMethods();
        setPaymentMethods(apiPaymentMethods);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Não foi possível carregar as formas de pagamento.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPaymentMethods();
  }, []);

  const activePaymentMethodsCount = useMemo(
    () => paymentMethods.filter((paymentMethod) => paymentMethod.active).length,
    [paymentMethods],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError('Informe o nome da forma de pagamento.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const paymentMethodPayload = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
      };
      const savedPaymentMethod = editingPaymentMethodId
        ? await updatePaymentMethod(editingPaymentMethodId, paymentMethodPayload)
        : await createPaymentMethod(paymentMethodPayload);

      if (!savedPaymentMethod) {
        throw new Error('A API não retornou a forma de pagamento salva.');
      }

      setPaymentMethods((currentPaymentMethods) =>
        editingPaymentMethodId
          ? currentPaymentMethods.map((paymentMethod) =>
              paymentMethod.id === editingPaymentMethodId ? savedPaymentMethod : paymentMethod,
            )
          : [...currentPaymentMethods, savedPaymentMethod],
      );
      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Não foi possível salvar a forma de pagamento.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethodId(paymentMethod.id);
    setFormData({
      name: paymentMethod.name,
      type: paymentMethod.type,
      description: paymentMethod.description ?? '',
      active: paymentMethod.active,
    });
    setError(null);
  };

  const handleDeletePaymentMethod = async (paymentMethod: PaymentMethod) => {
    const confirmed = window.confirm(`Excluir a forma de pagamento "${paymentMethod.name}"?`);

    if (!confirmed) return;

    try {
      setDeletingPaymentMethodId(paymentMethod.id);
      setError(null);
      await deletePaymentMethod(paymentMethod.id);
      setPaymentMethods((currentPaymentMethods) =>
        currentPaymentMethods.filter(
          (currentPaymentMethod) => currentPaymentMethod.id !== paymentMethod.id,
        ),
      );

      if (editingPaymentMethodId === paymentMethod.id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Não foi possível excluir a forma de pagamento.',
      );
    } finally {
      setDeletingPaymentMethodId(null);
    }
  };

  const resetForm = () => {
    setEditingPaymentMethodId(null);
    setFormData(initialForm);
    setError(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className={`${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <button
              onClick={onBack}
              className="mb-2 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Configurações / Personalização
            </button>
            <h1 className="text-2xl text-foreground">Formas de pagamento</h1>
          </div>

          <button
            onClick={resetForm}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            Nova forma
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-red-50 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_360px]'}`}>
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-foreground">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                  {paymentMethods.length} formas
                </h2>
                <span className="text-sm text-muted-foreground">
                  {activePaymentMethodsCount} ativas
                </span>
              </div>
            </div>

            <div className="p-4">
              {isLoading ? (
                <div className="rounded-lg bg-background p-8 text-center text-muted-foreground">
                  Carregando formas de pagamento...
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="rounded-lg bg-background p-8 text-center text-muted-foreground">
                  Nenhuma forma de pagamento cadastrada
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentMethods.map((paymentMethod) => {
                    const Icon = getPaymentMethodIcon(paymentMethod.type);

                    return (
                      <div
                        key={paymentMethod.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-background p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-foreground">{paymentMethod.name}</p>
                            <p className="truncate text-sm text-muted-foreground">
                              {translatePaymentMethodType(paymentMethod.type)}
                              {paymentMethod.description ? ` • ${paymentMethod.description}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-1 text-xs ${
                              paymentMethod.active
                                ? 'bg-secondary text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {paymentMethod.active ? 'Ativo' : 'Inativo'}
                          </span>
                          <button
                            onClick={() => handleEditPaymentMethod(paymentMethod)}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                            aria-label={`Editar ${paymentMethod.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePaymentMethod(paymentMethod)}
                            disabled={deletingPaymentMethodId === paymentMethod.id}
                            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive disabled:opacity-50"
                            aria-label={`Excluir ${paymentMethod.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5">
              <h2 className="text-foreground">
                {editingPaymentMethodId ? 'Editar forma' : 'Nova forma'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Defina como ela aparece nas transações
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-card-foreground">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-3 text-foreground"
                  placeholder="Ex: Cartão Nubank"
                />
              </div>

              <div>
                <label className="mb-2 block text-card-foreground">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethodTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: value })}
                      className={`flex h-16 items-center gap-3 rounded-lg border px-3 text-left transition-colors ${
                        formData.type === value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:text-primary'
                      }`}
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-card-foreground">Descrição</label>
                <textarea
                  value={formData.description ?? ''}
                  onChange={(event) =>
                    setFormData({ ...formData, description: event.target.value })
                  }
                  className="min-h-24 w-full resize-none rounded-lg border border-border bg-input-background px-4 py-3 text-foreground"
                  placeholder="Ex: Final 1234, uso pessoal"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-background p-3">
                <span className="text-foreground">Ativo</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`h-6 w-12 rounded-full transition-colors ${
                    formData.active ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                      formData.active ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted py-3 text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? 'Salvando...' : editingPaymentMethodId ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
