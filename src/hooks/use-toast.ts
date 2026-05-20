// Stubbed toast hook – no actual toast functionality
export const useToast = () => ({
  toast: (msg: string) => console.log('Toast:', msg),
  dismiss: () => {},
});