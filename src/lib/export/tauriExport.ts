import { invoke } from "@tauri-apps/api/core";

const TAURI_RUNTIME_MISSING_ERROR =
  "Export requires the Tauri desktop runtime. Use `npm run tauri:dev` to enable file dialogs and disk I/O.";

const isTauriRuntime = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return "__TAURI_INTERNALS__" in window;
};

const assertTauriRuntime = () => {
  if (!isTauriRuntime()) {
    throw new Error(TAURI_RUNTIME_MISSING_ERROR);
  }
};

interface PickExportFileFilter {
  name: string;
  extensions: string[];
}

interface PickExportFileRequest {
  title: string;
  defaultFileName: string;
  filters: PickExportFileFilter[];
}

export const pickExportFile = async (request: PickExportFileRequest): Promise<string | null> => {
  assertTauriRuntime();
  return invoke<string | null>("pick_export_file", {
    request,
  });
};

export const writeExportTextFile = async (path: string, contents: string): Promise<void> => {
  assertTauriRuntime();
  await invoke("write_export_text_file", {
    request: {
      path,
      contents,
    },
  });
};

export const writeExportBinaryFile = async (path: string, base64Contents: string): Promise<void> => {
  assertTauriRuntime();
  await invoke("write_export_binary_file", {
    request: {
      path,
      base64Contents,
    },
  });
};

