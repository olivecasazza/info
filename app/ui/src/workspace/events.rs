use dioxus::events::{KeyboardEvent, PointerEvent as DioxusPointerEvent, WheelEvent};
use dioxus::prelude::*;
use panel_kit::input::{
    clear_selection, keyboard_event, pointer_event, release_pointer, wheel_event,
};
use panel_kit_core::persist::apply_save_decision;
use panel_kit_core::reducer::{reduce, HitTarget, ReduceContext, WorkspaceEvent};
use panel_kit_core::{
    Clamp, CommandStep, FocusContext, PanelKind, PointerButton, PointerEventKind, SnapPolicy,
    TileMetrics,
};

use super::state::{log_layout_error, PanelWorkspace};

pub(crate) fn workspace_event_handler<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
) -> EventHandler<WorkspaceEvent<K>> {
    let workspace = workspace.clone();
    EventHandler::new(move |event| {
        reduce_workspace_event(&workspace, event);
    })
}

pub(crate) fn handle_key<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    event: &KeyboardEvent,
) {
    let focus = if panel_kit::input::is_editing() {
        FocusContext::TextInput
    } else if let Some(key) = workspace.snapshot.read().focused {
        FocusContext::Panel(key)
    } else {
        FocusContext::Workspace
    };

    let Some(workspace_event) = keyboard_event(event, focus) else {
        return;
    };
    if reduce_workspace_event(workspace, workspace_event) {
        event.prevent_default();
    }
}

pub(crate) fn handle_pointer_move<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    event: &DioxusPointerEvent,
) {
    let kind = if workspace.snapshot.read().drag.is_some() {
        PointerEventKind::Drag(PointerButton::Primary)
    } else {
        PointerEventKind::Moved
    };
    reduce_workspace_event(workspace, pointer_event(HitTarget::Workspace, event, kind));
}

pub(crate) fn handle_pointer_up<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    event: &DioxusPointerEvent,
) {
    release_pointer(event);
    let changed = reduce_workspace_event(
        workspace,
        pointer_event(
            HitTarget::Workspace,
            event,
            PointerEventKind::Up(PointerButton::Primary),
        ),
    );
    if changed {
        clear_selection();
    }
}

pub(crate) fn handle_wheel<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    event: &WheelEvent,
) {
    if reduce_workspace_event(workspace, wheel_event(event)) {
        event.prevent_default();
    }
}

pub(crate) fn reduce_workspace_event<K: PanelKind>(
    workspace: &PanelWorkspace<K>,
    event: WorkspaceEvent<K>,
) -> bool {
    let mut snapshot_signal = workspace.snapshot;
    let mut snapshot = snapshot_signal.write();
    let context = ReduceContext {
        surface: panel_kit::surface::surface_profile(snapshot.viewport.width),
        clamp: &Clamp::WEB,
        command_step: CommandStep::WEB,
        tile: &TileMetrics::WEB,
        snap: SnapPolicy::default(),
    };
    let reduction = reduce(&mut snapshot, event, context);
    let changed = reduction.changed;
    let decision = workspace.save_policy.decide(&reduction);

    if let Err(error) =
        apply_save_decision(decision, &*workspace.store, &snapshot, &workspace.catalog)
    {
        log_layout_error("save layout", workspace.storage_key, &error);
    }
    if changed {
        if let Some(window) = web_sys::window() {
            let _ = window.dispatch_event(&web_sys::Event::new("resize").unwrap());
        }
    }

    changed
}
