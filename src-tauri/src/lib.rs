use base64::engine::general_purpose::STANDARD as BASE64_STANDARD;
use base64::Engine;
use rfd::FileDialog;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::path::{Path, PathBuf};

const DEFAULT_MANIFEST_FILE_NAME: &str = "world-seed-project.json";

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SaveProjectBundleRequest {
  project_root: String,
  manifest_file_name: String,
  manifest: Value,
  maps: Vec<SaveMapEntry>,
  ensure_directories: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SaveMapEntry {
  map_id: String,
  relative_map_path: String,
  map_file: Value,
  chunks: Vec<SaveChunkEntry>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SaveChunkEntry {
  relative_chunk_path: String,
  chunk_file: Value,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveProjectBundleResult {
  project_root: String,
  manifest_path: String,
  saved_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LoadProjectBundleRequest {
  selected_path: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LoadedProjectBundleResult {
  project_root: String,
  manifest_path: String,
  manifest: Value,
  maps: Vec<LoadedMapEntry>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LoadedMapEntry {
  map_id: String,
  relative_map_path: String,
  map_file: Value,
  chunks: Vec<LoadedChunkEntry>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LoadedChunkEntry {
  layer_id: String,
  chunk_key: String,
  relative_chunk_path: String,
  chunk_file: Value,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ExportFileFilter {
  name: String,
  extensions: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PickExportFileRequest {
  title: String,
  default_file_name: String,
  filters: Vec<ExportFileFilter>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct WriteExportTextFileRequest {
  path: String,
  contents: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct WriteExportBinaryFileRequest {
  path: String,
  base64_contents: String,
}

fn normalize_relative_path(path: &str) -> String {
  path.replace('\\', "/")
}

fn to_path_string(path: &Path) -> String {
  path.to_string_lossy().to_string()
}

fn resolve_project_relative_path(project_root: &Path, relative_path: &str) -> Result<PathBuf, String> {
  let normalized = normalize_relative_path(relative_path);
  if normalized.trim().is_empty() {
    return Err("Received an empty relative path while saving/loading project files.".to_string());
  }

  if normalized.starts_with('/') || normalized.contains("..") {
    return Err(format!("Invalid project-relative path: \"{}\".", relative_path));
  }

  Ok(project_root.join(normalized))
}

fn read_json_file(path: &Path, context: &str) -> Result<Value, String> {
  let content = fs::read_to_string(path).map_err(|error| format!("{}: {}", context, error))?;
  serde_json::from_str(&content).map_err(|error| format!("{}: {}", context, error))
}

fn write_json_file(path: &Path, value: &Value, context: &str) -> Result<(), String> {
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent).map_err(|error| format!("{}: {}", context, error))?;
  }

  let encoded = serde_json::to_string_pretty(value).map_err(|error| format!("{}: {}", context, error))?;
  fs::write(path, encoded).map_err(|error| format!("{}: {}", context, error))
}

fn ensure_parent_directory(path: &Path, context: &str) -> Result<(), String> {
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent).map_err(|error| format!("{}: {}", context, error))?;
  }
  Ok(())
}

fn resolve_manifest_path(selected_path: &str) -> Result<PathBuf, String> {
  let candidate = PathBuf::from(selected_path);

  if candidate.is_file() {
    return Ok(candidate);
  }

  if candidate.is_dir() {
    let preferred = candidate.join(DEFAULT_MANIFEST_FILE_NAME);
    if preferred.is_file() {
      return Ok(preferred);
    }

    let fallback = candidate.join("project.json");
    if fallback.is_file() {
      return Ok(fallback);
    }

    return Err(format!(
      "No project manifest found in \"{}\". Expected \"{}\" or \"project.json\".",
      candidate.display(),
      DEFAULT_MANIFEST_FILE_NAME
    ));
  }

  Err(format!(
    "Selected path \"{}\" does not exist or is not readable.",
    candidate.display()
  ))
}

#[tauri::command]
fn pick_project_folder() -> Option<String> {
  FileDialog::new()
    .set_title("Choose World Seed Project Folder")
    .pick_folder()
    .map(|path| to_path_string(path.as_path()))
}

#[tauri::command]
fn pick_project_manifest() -> Option<String> {
  FileDialog::new()
    .set_title("Open World Seed Project")
    .add_filter("JSON", &["json"])
    .pick_file()
    .map(|path| to_path_string(path.as_path()))
}

#[tauri::command]
fn pick_export_file(request: PickExportFileRequest) -> Option<String> {
  let mut dialog = FileDialog::new()
    .set_title(&request.title)
    .set_file_name(&request.default_file_name);

  for filter in &request.filters {
    let extensions = filter
      .extensions
      .iter()
      .map(|extension| extension.as_str())
      .collect::<Vec<_>>();
    dialog = dialog.add_filter(&filter.name, &extensions);
  }

  dialog
    .save_file()
    .map(|path| to_path_string(path.as_path()))
}

#[tauri::command]
fn write_export_text_file(request: WriteExportTextFileRequest) -> Result<(), String> {
  let target_path = PathBuf::from(&request.path);
  ensure_parent_directory(
    &target_path,
    &format!(
      "Unable to create export directory for \"{}\"",
      target_path.display()
    ),
  )?;

  fs::write(&target_path, request.contents).map_err(|error| {
    format!(
      "Unable to write export text file \"{}\": {}",
      target_path.display(),
      error
    )
  })
}

#[tauri::command]
fn write_export_binary_file(request: WriteExportBinaryFileRequest) -> Result<(), String> {
  let target_path = PathBuf::from(&request.path);
  ensure_parent_directory(
    &target_path,
    &format!(
      "Unable to create export directory for \"{}\"",
      target_path.display()
    ),
  )?;

  let decoded = BASE64_STANDARD.decode(request.base64_contents).map_err(|error| {
    format!(
      "Unable to decode base64 payload for \"{}\": {}",
      target_path.display(),
      error
    )
  })?;

  fs::write(&target_path, decoded).map_err(|error| {
    format!(
      "Unable to write export binary file \"{}\": {}",
      target_path.display(),
      error
    )
  })
}

#[tauri::command]
fn save_project_bundle(request: SaveProjectBundleRequest) -> Result<SaveProjectBundleResult, String> {
  let project_root = PathBuf::from(&request.project_root);
  fs::create_dir_all(&project_root)
    .map_err(|error| format!("Unable to create project root \"{}\": {}", project_root.display(), error))?;

  for relative_dir in &request.ensure_directories {
    let target_dir = resolve_project_relative_path(&project_root, relative_dir)?;
    fs::create_dir_all(&target_dir)
      .map_err(|error| format!("Unable to create directory \"{}\": {}", target_dir.display(), error))?;
  }

  for map_entry in &request.maps {
    let paint_dir = project_root.join("maps").join(&map_entry.map_id).join("paint");
    if paint_dir.exists() {
      fs::remove_dir_all(&paint_dir).map_err(|error| {
        format!(
          "Unable to clean old paint chunk directory \"{}\": {}",
          paint_dir.display(),
          error
        )
      })?;
    }

    let map_path = resolve_project_relative_path(&project_root, &map_entry.relative_map_path)?;
    write_json_file(
      &map_path,
      &map_entry.map_file,
      &format!("Unable to write map file \"{}\"", map_path.display()),
    )?;

    for chunk_entry in &map_entry.chunks {
      let chunk_path = resolve_project_relative_path(&project_root, &chunk_entry.relative_chunk_path)?;
      write_json_file(
        &chunk_path,
        &chunk_entry.chunk_file,
        &format!("Unable to write chunk file \"{}\"", chunk_path.display()),
      )?;
    }
  }

  let manifest_path = resolve_project_relative_path(&project_root, &request.manifest_file_name)?;
  write_json_file(
    &manifest_path,
    &request.manifest,
    &format!("Unable to write manifest \"{}\"", manifest_path.display()),
  )?;

  let saved_at = request
    .manifest
    .get("updatedAt")
    .and_then(Value::as_str)
    .or_else(|| request.manifest.get("createdAt").and_then(Value::as_str))
    .unwrap_or_default()
    .to_string();

  Ok(SaveProjectBundleResult {
    project_root: to_path_string(project_root.as_path()),
    manifest_path: to_path_string(manifest_path.as_path()),
    saved_at,
  })
}

#[tauri::command]
fn load_project_bundle(request: LoadProjectBundleRequest) -> Result<LoadedProjectBundleResult, String> {
  let manifest_path = resolve_manifest_path(&request.selected_path)?;
  let project_root = manifest_path.parent().ok_or_else(|| {
    format!(
      "Unable to resolve project root from manifest path \"{}\".",
      manifest_path.display()
    )
  })?;

  let manifest = read_json_file(
    &manifest_path,
    &format!("Unable to read manifest \"{}\"", manifest_path.display()),
  )?;
  let map_registry = manifest
    .get("mapRegistry")
    .and_then(Value::as_array)
    .ok_or_else(|| "Manifest is missing a valid \"mapRegistry\" array.".to_string())?;

  let mut maps: Vec<LoadedMapEntry> = Vec::with_capacity(map_registry.len());
  for map_registry_entry in map_registry {
    let map_id = map_registry_entry
      .get("mapId")
      .and_then(Value::as_str)
      .ok_or_else(|| "Manifest mapRegistry entry is missing \"mapId\".".to_string())?;
    let relative_map_path = map_registry_entry
      .get("file")
      .and_then(Value::as_str)
      .ok_or_else(|| format!("Manifest map entry for \"{}\" is missing \"file\".", map_id))?;
    let map_path = resolve_project_relative_path(project_root, relative_map_path)?;
    let map_file = read_json_file(
      &map_path,
      &format!("Unable to read map file \"{}\"", map_path.display()),
    )?;

    let mut chunks: Vec<LoadedChunkEntry> = Vec::new();
    if let Some(layers) = map_file
      .get("map")
      .and_then(|map| map.get("layers"))
      .and_then(Value::as_object)
    {
      for (layer_id, layer_value) in layers {
        let kind = layer_value
          .get("kind")
          .and_then(Value::as_str)
          .unwrap_or_default();
        if kind != "paint" && kind != "mask" && kind != "dataOverlay" {
          continue;
        }

        let Some(chunk_refs) = layer_value.get("chunkRefs").and_then(Value::as_object) else {
          continue;
        };

        for (chunk_key, chunk_relative_path) in chunk_refs {
          let chunk_relative_path = chunk_relative_path.as_str().ok_or_else(|| {
            format!(
              "Invalid chunk reference in map \"{}\" layer \"{}\" chunk \"{}\".",
              map_id, layer_id, chunk_key
            )
          })?;
          let chunk_path = resolve_project_relative_path(project_root, chunk_relative_path)?;
          let chunk_file = read_json_file(
            &chunk_path,
            &format!("Unable to read chunk file \"{}\"", chunk_path.display()),
          )?;

          chunks.push(LoadedChunkEntry {
            layer_id: layer_id.to_string(),
            chunk_key: chunk_key.to_string(),
            relative_chunk_path: normalize_relative_path(chunk_relative_path),
            chunk_file,
          });
        }
      }
    }

    maps.push(LoadedMapEntry {
      map_id: map_id.to_string(),
      relative_map_path: normalize_relative_path(relative_map_path),
      map_file,
      chunks,
    });
  }

  Ok(LoadedProjectBundleResult {
    project_root: to_path_string(project_root),
    manifest_path: to_path_string(manifest_path.as_path()),
    manifest,
    maps,
  })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      pick_project_folder,
      pick_project_manifest,
      pick_export_file,
      write_export_text_file,
      write_export_binary_file,
      save_project_bundle,
      load_project_bundle
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
