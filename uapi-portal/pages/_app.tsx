import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { CacheProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";

import createEmotionCache from "~/utils/createEmotionCache";

import { useAppDispatch, useAppSelector } from "~/state/hooks";
import { persistor, store } from "~/state/store";

import theme from "~/styles/theme";

import { MyAppProps } from "~/modules/_core/interfaces/app.interface";

import { closeSnack } from "~/core/state/coreSlice";
import { AuthGuard } from "~/core/utils/authGuard";

import "~/styles/fonts.css";
import "~/styles/styles.min.css";
import "~/styles/globals.css";

const WrapperComp = (props: MyAppProps) => {
  const dispatch = useAppDispatch();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [queryClient] = useState(() => new QueryClient());
  const customTheme = theme({ theme: "ORGANIZATION_INFO" });
  const core = useAppSelector((state) => state.core);
  const { isSnackOpen, message, messageType } = core;
  const handleClose = () => {
    dispatch(closeSnack());
  };
  useEffect(() => {
    window.addEventListener("beforeunload", handleClose);
    return () => {
      window.removeEventListener("beforeunload", handleClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={customTheme}>
        <Snackbar
          open={isSnackOpen}
          autoHideDuration={5000}
          onClose={handleClose}
          disableWindowBlurListener
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert
            onClose={handleClose}
            severity={messageType}
            sx={{
              width: "100%",
              fontFamily: "SegoeUI",
              fontSize: "16px",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
        <QueryClientProvider client={queryClient}>
          {Component.requireAuth ? (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

const clientSideEmotionCache = createEmotionCache();

// eslint-disable-next-line react/no-multi-comp
const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WrapperComp {...props} />
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
