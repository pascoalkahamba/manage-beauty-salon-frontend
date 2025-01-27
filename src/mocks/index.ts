// types.ts
export interface Employee {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  availability: string[];
  rating: number;
  totalReviews: number;
}

export interface ServiceImage {
  url: string;
  alt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: "hair" | "makeup" | "nails" | "skin" | "spa";
  images: ServiceImage[];
  employees: Employee[];
  features: string[];
  minimumNotice: number; // in hours
  cancellationPolicy: string;
  popularityScore: number;
  isAvailable: boolean;
  tags: string[];
}

// mocks.ts
export const mockEmployees: Employee[] = [
  {
    id: "emp1",
    name: "Ana Silva",
    avatar: "/avatars/ana-silva.jpg",
    specialties: ["corte", "coloração", "penteados"],
    availability: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    rating: 4.8,
    totalReviews: 127,
  },
  {
    id: "emp2",
    name: "Maria Santos",
    avatar: "/avatars/maria-santos.jpg",
    specialties: ["maquiagem", "design de sobrancelhas"],
    availability: ["09:00", "10:00", "13:00", "14:00", "15:00", "16:00"],
    rating: 4.9,
    totalReviews: 89,
  },
  {
    id: "emp3",
    name: "João Costa",
    avatar: "/avatars/joao-costa.jpg",
    specialties: ["corte masculino", "barba"],
    availability: ["11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    rating: 4.7,
    totalReviews: 156,
  },
];

export const mockServices: Service[] = [
  {
    id: "srv1",
    name: "Corte de Cabelo Feminino",
    description:
      "Corte personalizado incluindo lavagem, hidratação e finalização. Nossa equipe especializada irá criar o look perfeito para você, considerando o formato do seu rosto e estilo pessoal.",
    duration: 60,
    price: 120.0,
    category: "hair",
    images: [
      {
        url: "/images/haircutWoman.jpg",
        alt: "Corte feminino moderno",
      },
      {
        url: "/images/haircutMan.jpg",
        alt: "Resultado final corte feminino",
      },
    ],
    employees: [mockEmployees[0], mockEmployees[1]],
    features: [
      "Consulta de estilo",
      "Lavagem com produtos premium",
      "Hidratação",
      "Finalização",
    ],
    minimumNotice: 2,
    cancellationPolicy: "Cancelamento gratuito até 24h antes",
    popularityScore: 95,
    isAvailable: true,
    tags: ["cabelo", "corte", "feminino", "hidratação"],
  },
  {
    id: "srv2",
    name: "Maquiagem Social",
    description:
      "Maquiagem completa para eventos sociais, incluindo preparação da pele, olhos, contorno e lábios. Utilizamos produtos de alta qualidade para garantir maior durabilidade.",
    duration: 90,
    price: 150.0,
    category: "makeup",
    images: [
      {
        url: "/services/makeup-1.jpg",
        alt: "Maquiagem social",
      },
      {
        url: "/services/makeup-2.jpg",
        alt: "Processo de maquiagem",
      },
    ],
    employees: [mockEmployees[1]],
    features: [
      "Preparação da pele",
      "Produtos hipoalergênicos",
      "Cílios postiços (opcional)",
      "Técnicas de longa duração",
    ],
    minimumNotice: 4,
    cancellationPolicy: "Cancelamento gratuito até 48h antes",
    popularityScore: 88,
    isAvailable: true,
    tags: ["maquiagem", "social", "eventos", "noiva"],
  },
  {
    id: "srv3",
    name: "Coloração Completa",
    description:
      "Serviço completo de coloração, incluindo avaliação prévia do cabelo, aplicação da cor, tratamento pós-coloração e finalização.",
    duration: 180,
    price: 250.0,
    category: "hair",
    images: [
      {
        url: "/services/coloracao-1.jpg",
        alt: "Processo de coloração",
      },
      {
        url: "/services/coloracao-2.jpg",
        alt: "Resultado final coloração",
      },
    ],
    employees: [mockEmployees[0]],
    features: [
      "Avaliação da saúde do cabelo",
      "Produtos importados",
      "Tratamento pós-coloração",
      "Finalização personalizada",
    ],
    minimumNotice: 24,
    cancellationPolicy: "Cancelamento gratuito até 48h antes",
    popularityScore: 92,
    isAvailable: true,
    tags: ["coloração", "tintura", "mechas", "transformação"],
  },
];

// Exemplo de uso dos mocks em um componente
export const getAvailableServices = () => {
  return mockServices.filter((service) => service.isAvailable);
};

export const getServiceById = (id: string) => {
  return mockServices.find((service) => service.id === id);
};

export const getEmployeesByService = (serviceId: string) => {
  const service = getServiceById(serviceId);
  return service ? service.employees : [];
};
