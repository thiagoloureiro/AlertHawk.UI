import { closeSnackbar, enqueueSnackbar } from "notistack";

export const showSnackbar = (
  text: string,
  variant: "success" | "warning" | "error"
) => {
  const key: any = enqueueSnackbar(text, {
    SnackbarProps: {
      onClick: () => closeSnackbar(key),
    },
    variant,
  });
};
