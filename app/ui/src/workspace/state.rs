use std::{cell::RefCell, rc::Rc};

use dioxus::prelude::*;
use panel_kit::store::LocalStorageLayoutStore;
use panel_kit::surface::{observe_viewport, surface_profile, viewport_size};
use panel_kit_core::frame::{
    project_into, ChromeProjectionInput, Placement, ProjectedFrame, ProjectionBuffer,
    ProjectionInput, TileFillOrder, TileLayoutMetrics,
};
use panel_kit_core::persist::{
    apply_save_decision, persist_snapshot, restore_snapshot, LayoutError, RestoreContext,
    SavePolicy,
};
use panel_kit_core::reducer::{ResizePolicy, Snapshot, Viewport, WorkspaceEvent};
use panel_kit_core::{
    ChromeMetrics, Clamp, Mode, PanelCatalog, PanelKind, PanelWin, TileMetrics, Units,
};

use super::events::workspace_event_handler;

#[derive(Clone)]
pub(crate) struct PanelWorkspace<K: PanelKind> {
    pub(crate) storage_key: &'static str,
    pub(crate) snapshot: Signal<Snapshot<K>>,
    pub(crate) catalog: Rc<PanelCatalog<K>>,
    pub(crate) scratch: Rc<RefCell<ProjectionBuffer<K>>>,
    pub(crate) fill_order: TileFillOrder,
    pub(super) store: Rc<LocalStorageLayoutStore>,
    pub(super) save_policy: SavePolicy,
    defaults: fn() -> Vec<PanelWin<K>>,
    default_mode: Mode,
}

pub(crate) fn use_panel_workspace<K: PanelKind>(
    storage_key: &'static str,
    defaults: fn() -> Vec<PanelWin<K>>,
    default_mode: Mode,
    catalog_factory: fn() -> Rc<PanelCatalog<K>>,
    fill_order: TileFillOrder,
) -> PanelWorkspace<K> {
    let initial_viewport = current_viewport();
    let default_snapshot = Snapshot::from_defaults(defaults(), default_mode, initial_viewport);
    let catalog = use_hook(catalog_factory);
    let store = use_hook(move || Rc::new(LocalStorageLayoutStore::new(storage_key)));
    let snapshot = use_signal({
        let catalog = catalog.clone();
        let store = store.clone();
        let defaults = default_snapshot.clone();
        move || restore_or_default(storage_key, &store, defaults, &catalog)
    });
    let scratch = use_hook({
        let panel_count = catalog.len();
        move || Rc::new(RefCell::new(ProjectionBuffer::with_panel_capacity(panel_count)))
    });

    PanelWorkspace {
        storage_key,
        snapshot,
        catalog,
        scratch,
        fill_order,
        store,
        save_policy: SavePolicy::OnSettle,
        defaults,
        default_mode,
    }
}

pub(crate) fn mount_viewport_observer<K: PanelKind>(workspace: &PanelWorkspace<K>) {
    let emit = workspace_event_handler(workspace);
    let _status = observe_viewport(EventHandler::new(move |size: Viewport| {
        emit.call(WorkspaceEvent::ViewportChanged {
            size,
            policy: ResizePolicy::ScaleFloating,
        });
    }));
}

pub(crate) fn project_workspace<'frame, K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    snapshot: &Snapshot<K>,
    scratch: &'frame mut ProjectionBuffer<K>,
) -> ProjectedFrame<'frame, K> {
    let surface = surface_profile(snapshot.viewport.width);
    let chrome = ChromeProjectionInput::full(ChromeMetrics::WEB);
    let tile = TileLayoutMetrics::from_tile_metrics(TileMetrics::WEB, surface)
        .with_fill_order(workspace.fill_order);

    project_into(
        ProjectionInput {
            snapshot,
            surface,
            chrome: &chrome,
            clamp: &Clamp::WEB,
            tile: &tile,
        },
        scratch,
    )
}

pub(crate) fn workspace_area_class<K: PanelKind>(
    frame: &ProjectedFrame<'_, K>,
) -> &'static str {
    if frame
        .panels
        .iter()
        .any(|panel| matches!(panel.placement, Placement::Maximized))
    {
        "ws maxed"
    } else if frame.mode == Mode::Tiling {
        "ws tiling"
    } else {
        "ws floating"
    }
}

pub(crate) fn mutate_snapshot<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    mutate: impl FnOnce(&mut Snapshot<K>),
) {
    let mut snapshot_signal = workspace.snapshot;
    let mut snapshot = snapshot_signal.write();
    mutate(&mut snapshot);
    if let Err(error) = persist_snapshot(&*workspace.store, &snapshot, &workspace.catalog) {
        log_layout_error("save layout", workspace.storage_key, &error);
    }
}

pub(crate) fn reset_workspace<K: PanelKind>(workspace: &PanelWorkspace<K>) {
    let viewport = workspace.snapshot.peek().viewport;
    let defaults = Snapshot::from_defaults((workspace.defaults)(), workspace.default_mode, viewport);
    let mut snapshot_signal = workspace.snapshot;
    snapshot_signal.set(defaults);
    let result = {
        let snapshot = snapshot_signal.peek();
        apply_save_decision(
            workspace.save_policy.reset_decision(),
            &*workspace.store,
            &snapshot,
            &workspace.catalog,
        )
    };
    if let Err(error) = result {
        log_layout_error("reset layout", workspace.storage_key, &error);
    }
}

fn current_viewport() -> Viewport {
    let (width, height) = viewport_size();
    Viewport {
        width,
        height,
        units: Units::CssPx,
    }
}

fn restore_or_default<K: PanelKind>(
    storage_key: &str,
    store: &LocalStorageLayoutStore,
    defaults: Snapshot<K>,
    catalog: &PanelCatalog<K>,
) -> Snapshot<K> {
    let context = RestoreContext {
        units: Units::CssPx,
        viewport: (defaults.viewport.width, defaults.viewport.height),
    };

    match restore_snapshot(store, defaults.clone(), catalog, context) {
        Ok(snapshot) => snapshot,
        Err(error) => {
            log_layout_error("restore layout", storage_key, &error);
            defaults
        }
    }
}

pub(super) fn log_layout_error(action: &str, storage_key: &str, error: &LayoutError) {
    let message = format!("panel-kit {action} failed for storage key `{storage_key}`: {error}");

    #[cfg(target_arch = "wasm32")]
    web_sys::console::error_1(&wasm_bindgen::JsValue::from_str(&message));

    #[cfg(not(target_arch = "wasm32"))]
    eprintln!("{message}");
}
