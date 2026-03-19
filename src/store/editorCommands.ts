import type { EditorToolId, LayerKind, MapId, SidebarPanelId } from "../types";
import { useEditorStore } from "./editorStore";

export const editorCommands = {
  activateTool(toolId: EditorToolId) {
    useEditorStore.getState().setActiveTool(toolId);
  },
  selectMap(mapId: MapId) {
    useEditorStore.getState().setActiveMap(mapId);
  },
  selectLayer(layerId: string | null) {
    useEditorStore.getState().setSelectedLayer(layerId);
  },
  togglePanel(panelId: SidebarPanelId) {
    useEditorStore.getState().togglePanel(panelId);
  },
  addLayer(kind: LayerKind) {
    return useEditorStore.getState().addLayer(kind);
  },
  newProject() {
    void useEditorStore.getState().newProject();
  },
  openProject() {
    void useEditorStore.getState().openProject();
  },
  saveProject() {
    void useEditorStore.getState().saveProject();
  },
  saveProjectAs() {
    void useEditorStore.getState().saveProjectAs();
  },
  removeSelectedLayer() {
    const state = useEditorStore.getState();

    if (!state.session.selectedLayerId) {
      state.setStatusHint("No layer selected to remove.");
      return;
    }

    state.removeLayer(state.session.selectedLayerId);
  },
  markDirty() {
    useEditorStore.getState().markDirty(true);
  },
  resetWorkspaceView() {
    useEditorStore.getState().resetView();
  },
  zoomToFit() {
    useEditorStore.getState().zoomToFit();
  },
  toggleGrid() {
    useEditorStore.getState().toggleGrid();
  },
  toggleChunkOverlay() {
    useEditorStore.getState().toggleChunkOverlay();
  },
};
