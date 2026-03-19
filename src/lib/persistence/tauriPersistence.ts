import { invoke } from "@tauri-apps/api/core";
import type {
  LoadProjectBundleResult,
  SaveProjectBundleRequest,
  SaveProjectBundleResult,
} from "./types";

const TAURI_RUNTIME_MISSING_ERROR =
  "Project persistence requires the Tauri desktop runtime. Use `npm run tauri:dev` to enable file dialogs and disk I/O.";

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

export const pickProjectFolder = async (): Promise<string | null> => {
  assertTauriRuntime();
  return invoke<string | null>("pick_project_folder");
};

export const pickProjectManifest = async (): Promise<string | null> => {
  assertTauriRuntime();
  return invoke<string | null>("pick_project_manifest");
};

export const saveProjectBundle = async (
  request: SaveProjectBundleRequest,
): Promise<SaveProjectBundleResult> => {
  assertTauriRuntime();
  return invoke<SaveProjectBundleResult>("save_project_bundle", { request });
};

export const loadProjectBundle = async (
  selectedPath: string,
): Promise<LoadProjectBundleResult> => {
  assertTauriRuntime();
  return invoke<LoadProjectBundleResult>("load_project_bundle", {
    request: {
      selectedPath,
    },
  });
};
