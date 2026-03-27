declare module 'feMain/api' {
  export const api: {
    basicToolPointConsumption: (toolName: string, numOfPoints?: number) => Promise<{ success: boolean; message?: string; error?: string }>;
  };
}
