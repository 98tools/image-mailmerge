interface ImportMetaEnv {
  readonly VITE_NODE_ENV?: string;
  readonly VITE_FE_MAIN_MF?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'feMain/api' {
  export const api: {
    basicToolPointConsumption: (toolName: string, numOfPoints?: number, forceBackendValidation?: boolean) => Promise<{ success: boolean; message?: string; error?: string }>;
  };
}

declare module 'feMain/credits' {
  export interface CreditsContextType {
    creditsData: {
      current: number;
      total: number;
      plan: string;
      status?: string;
      billingCycle: string;
      resetDate: string;
      daysUntilReset: number;
      nextAmount: number;
      usagePercentage: number;
    } | null;
    setCreditsData: (data: any) => void;
    decrementCredits: (amount: number) => void;
  }

  export function useCredits(): CreditsContextType;
}
