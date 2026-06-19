let navigate: (url: string) => void;

export const setNavigate = (fn: (url: string) => void) => {
  navigate = fn;
};

export function navigateTo(path: string) {
  navigate?.(path);
}
