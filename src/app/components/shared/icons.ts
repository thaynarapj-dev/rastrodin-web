import {
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  Car,
  Coffee,
  Coins,
  CreditCard,
  Dog,
  Droplets,
  Dumbbell,
  FileText,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  Hammer,
  Heart,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  Leaf,
  Lightbulb,
  MapPin,
  Music,
  Package,
  Paintbrush,
  Plane,
  Phone,
  QrCode,
  Receipt,
  Scissors,
  Shirt,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Store,
  Tag,
  Theater,
  Truck,
  Tv,
  Utensils,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PaymentMethodTypeEnum } from '@/app/interfaces/PaymentMethods';

export const categoryIcons: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: 'tag', label: 'Tag', icon: Tag },
  { id: 'utensils', label: 'Alimentação', icon: Utensils },
  { id: 'coffee', label: 'Café', icon: Coffee },
  { id: 'car', label: 'Transporte', icon: Car },
  { id: 'bus', label: 'Ônibus', icon: Bus },
  { id: 'fuel', label: 'Combustível', icon: Fuel },
  { id: 'truck', label: 'Entrega', icon: Truck },
  { id: 'home', label: 'Moradia', icon: Home },
  { id: 'building', label: 'Condomínio', icon: Building2 },
  { id: 'lightbulb', label: 'Energia', icon: Lightbulb },
  { id: 'droplets', label: 'Água', icon: Droplets },
  { id: 'zap', label: 'Internet', icon: Zap },
  { id: 'film', label: 'Lazer', icon: Film },
  { id: 'music', label: 'Música', icon: Music },
  { id: 'theater', label: 'Eventos', icon: Theater },
  { id: 'tv', label: 'Streaming', icon: Tv },
  { id: 'briefcase', label: 'Trabalho', icon: Briefcase },
  { id: 'banknote', label: 'Receita', icon: Banknote },
  { id: 'coins', label: 'Moedas', icon: Coins },
  { id: 'credit-card', label: 'Cartão', icon: CreditCard },
  { id: 'receipt', label: 'Conta', icon: Receipt },
  { id: 'shopping-bag', label: 'Compras', icon: ShoppingBag },
  { id: 'shopping-cart', label: 'Mercado', icon: ShoppingCart },
  { id: 'store', label: 'Loja', icon: Store },
  { id: 'heart-pulse', label: 'Saúde', icon: HeartPulse },
  { id: 'heart', label: 'Bem-estar', icon: Heart },
  { id: 'graduation-cap', label: 'Educação', icon: GraduationCap },
  { id: 'book-open', label: 'Livros', icon: BookOpen },
  { id: 'plane', label: 'Viagem', icon: Plane },
  { id: 'map-pin', label: 'Passeio', icon: MapPin },
  { id: 'smartphone', label: 'Celular', icon: Smartphone },
  { id: 'phone', label: 'Telefone', icon: Phone },
  { id: 'laptop', label: 'Tecnologia', icon: Laptop },
  { id: 'shirt', label: 'Roupas', icon: Shirt },
  { id: 'gift', label: 'Presentes', icon: Gift },
  { id: 'dumbbell', label: 'Academia', icon: Dumbbell },
  { id: 'gamepad', label: 'Jogos', icon: Gamepad2 },
  { id: 'wrench', label: 'Serviços', icon: Wrench },
  { id: 'hammer', label: 'Manutenção', icon: Hammer },
  { id: 'paintbrush', label: 'Casa e decoração', icon: Paintbrush },
  { id: 'scissors', label: 'Beleza', icon: Scissors },
  { id: 'shield', label: 'Seguros', icon: Shield },
  { id: 'file-text', label: 'Documentos', icon: FileText },
  { id: 'package', label: 'Assinaturas', icon: Package },
  { id: 'leaf', label: 'Natureza', icon: Leaf },
  { id: 'dog', label: 'Pet', icon: Dog },
];

const categoryIconMap = categoryIcons.reduce<Record<string, LucideIcon>>(
  (iconMap, categoryIcon) => {
    iconMap[categoryIcon.id] = categoryIcon.icon;
    return iconMap;
  },
  {},
);

export function getCategoryIcon(icon: string | null | undefined) {
  if (!icon) return Tag;

  return categoryIconMap[icon] ?? Tag;
}

export const paymentMethodTypes = [
  { value: PaymentMethodTypeEnum.PIX, label: 'Pix', icon: QrCode },
  { value: PaymentMethodTypeEnum.CREDIT, label: 'Crédito', icon: CreditCard },
  { value: PaymentMethodTypeEnum.DEBIT, label: 'Débito', icon: CreditCard },
  { value: PaymentMethodTypeEnum.CASH, label: 'Dinheiro', icon: Banknote },
  { value: PaymentMethodTypeEnum.TRANSFER, label: 'Transferência', icon: Landmark },
  { value: PaymentMethodTypeEnum.OTHER, label: 'Outros', icon: Wallet },
] as const;

function getPaymentMethodType(type: PaymentMethodTypeEnum | string | null | undefined) {
  return paymentMethodTypes.find((paymentMethodType) => paymentMethodType.value === type);
}

export function translatePaymentMethodType(type: PaymentMethodTypeEnum | string | null | undefined) {
  return getPaymentMethodType(type)?.label ?? 'Outros';
}

export function getPaymentMethodIcon(type: PaymentMethodTypeEnum | string | null | undefined) {
  return getPaymentMethodType(type)?.icon ?? Wallet;
}
