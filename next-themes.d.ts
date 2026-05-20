declare module 'next-themes' {
  export const useTheme: () => { theme: string; setTheme: (t: string) => void };
  export const ThemeProvider: React.ComponentType<any>;
}