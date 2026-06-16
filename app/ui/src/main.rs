//! Dioxus web frontend for the info site.
//!
//! The workspace shell (floating/tiling panels, traffic lights, dock, layout
//! persistence) comes from `panel-kit`; this crate supplies a base dashboard
//! plus per-project resource panels ported from the old Nuxt components:
//!
//! - **Info** — `ExperienceList.vue`: the experience list.
//! - **Projects** — `ProjectsWrapper.vue`: the project / library / notebook list.
//! - **Featured** — workspace context; demos/pages open as separate panels.

use dioxus::prelude::*;
use panel_kit::{
    get_bevy_handle, use_workspace, BevyCanvas, LayoutBuilder, Mode, PanelKind, PanelWin,
    TilingFlow, WinState, Workspace, BEVY_CSS, CSS,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

fn main() {
    dioxus::launch(App);
}

// ─────────────────────────────────────────────────────────────────────────────
// JS Interop for Demo Controls
// ─────────────────────────────────────────────────────────────────────────────

/// Get a property from a JS object
fn js_get_f32(obj: &JsValue, prop: &str) -> Option<f32> {
    js_sys::Reflect::get(obj, &JsValue::from_str(prop))
        .ok()
        .and_then(|v| v.as_f64())
        .map(|v| v as f32)
}

fn js_get_bool(obj: &JsValue, prop: &str) -> Option<bool> {
    js_sys::Reflect::get(obj, &JsValue::from_str(prop))
        .ok()
        .and_then(|v| v.as_bool())
}

fn js_get_usize(obj: &JsValue, prop: &str) -> Option<usize> {
    js_sys::Reflect::get(obj, &JsValue::from_str(prop))
        .ok()
        .and_then(|v| v.as_f64())
        .map(|v| v as usize)
}

fn js_get_u32(obj: &JsValue, prop: &str) -> Option<u32> {
    js_sys::Reflect::get(obj, &JsValue::from_str(prop))
        .ok()
        .and_then(|v| v.as_f64())
        .map(|v| v as u32)
}

/// Set a property on a JS object
fn js_set(obj: &JsValue, prop: &str, val: &JsValue) {
    let _ = js_sys::Reflect::set(obj, &JsValue::from_str(prop), val);
}

/// Call a method on a JS object
fn js_call_method(obj: &JsValue, method: &str) {
    if let Ok(func) = js_sys::Reflect::get(obj, &JsValue::from_str(method)) {
        if let Ok(f) = func.dyn_into::<js_sys::Function>() {
            let _ = f.call0(obj);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Panels
// ─────────────────────────────────────────────────────────────────────────────

#[derive(Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
enum Panel {
    Info,
    Projects,
    Featured,
    BirdNixPage,
    BirdNixDemo,
    ConsortiumPage,
    ConsortiumDemo,
    HephaestusPage,
    HephaestusDemo,
    FlockDemo,
    PipedreamDemo,
    NotebookKinematics,
    NotebookInverseKinematics,
    NotebookWigglystuff,
}

impl PanelKind for Panel {
    fn title(self) -> &'static str {
        match self {
            Panel::Info => "info",
            Panel::Projects => "projects",
            Panel::Featured => "featured",
            Panel::BirdNixPage => "bird-nix page",
            Panel::BirdNixDemo => "bird-nix demo",
            Panel::ConsortiumPage => "consortium page",
            Panel::ConsortiumDemo => "consortium demo",
            Panel::HephaestusPage => "hephaestus page",
            Panel::HephaestusDemo => "hephaestus recording",
            Panel::FlockDemo => "flocking demo",
            Panel::PipedreamDemo => "pipedream demo",
            Panel::NotebookKinematics => "kinematics notebook",
            Panel::NotebookInverseKinematics => "inverse kinematics notebook",
            Panel::NotebookWigglystuff => "wigglystuff notebook",
        }
    }
}

const BIRD_NIX_RESOURCES: &[Panel] = &[Panel::BirdNixPage, Panel::BirdNixDemo];
const CONSORTIUM_RESOURCES: &[Panel] = &[Panel::ConsortiumPage, Panel::ConsortiumDemo];
const HEPHAESTUS_RESOURCES: &[Panel] = &[Panel::HephaestusPage, Panel::HephaestusDemo];
const FLOCK_RESOURCES: &[Panel] = &[Panel::FlockDemo];
const PIPEDREAM_RESOURCES: &[Panel] = &[Panel::PipedreamDemo];
const KINEMATICS_RESOURCES: &[Panel] = &[Panel::NotebookKinematics];
const INVERSE_KINEMATICS_RESOURCES: &[Panel] = &[Panel::NotebookInverseKinematics];
const WIGGLYSTUFF_RESOURCES: &[Panel] = &[Panel::NotebookWigglystuff];
const ALL_PROJECT_RESOURCES: &[Panel] = &[
    Panel::BirdNixPage,
    Panel::BirdNixDemo,
    Panel::ConsortiumPage,
    Panel::ConsortiumDemo,
    Panel::HephaestusPage,
    Panel::HephaestusDemo,
    Panel::FlockDemo,
    Panel::PipedreamDemo,
    Panel::NotebookKinematics,
    Panel::NotebookInverseKinematics,
    Panel::NotebookWigglystuff,
];

fn default_layout() -> Vec<PanelWin<Panel>> {
    let mut b = LayoutBuilder::new();
    vec![
        b.at(Panel::Info, 16.0, 16.0, 360.0, 360.0)
            .with_tile(2, 2)
            .with_tile_flex(58.0, 1.0)
            .with_tile_min(280.0, 240.0),
        b.at(Panel::Projects, 16.0, 392.0, 360.0, 260.0)
            .with_tile(2, 1)
            .with_tile_flex(42.0, 1.0)
            .with_tile_min(280.0, 170.0),
    ]
}

const LAYOUT_KEY: &str = "info_layout_v7";

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

#[component]
fn App() -> Element {
    let mut ws = use_workspace(LAYOUT_KEY, default_layout);
    let mut opened_initial_project = use_signal(|| false);

    use_hook(|| {
        let has_saved: bool = web_sys::window()
            .and_then(|w: web_sys::Window| w.local_storage().ok().flatten())
            .and_then(|s: web_sys::Storage| s.get_item(LAYOUT_KEY).ok().flatten())
            .is_some();
        if !has_saved {
            ws.mode.set(Mode::Tiling);
        }
    });

    use_effect(move || {
        if opened_initial_project() {
            return;
        }
        opened_initial_project.set(true);

        if let Some((_, project)) = random_project() {
            open_project_resources(ws, resources_for_project(project.link));
        }
    });

    rsx! {
        style { {CSS} }
        style { {BEVY_CSS} }
        style { {APP_CSS} }
        div {
            class: ws.root_class(),
            onmousemove: move |e| ws.handle_mouse_move(&e),
            onmouseup: move |_| ws.handle_mouse_up(),
            {ws.render_with_tiling_flow(TilingFlow::Column, move |kind, _maximized| panel_body(kind, ws))}
            {ws.dock()}
        }
    }
}

fn panel_body(kind: Panel, ws: Workspace<Panel>) -> Element {
    match kind {
        Panel::Info => info_body(),
        Panel::Projects => projects_panel(ws),
        Panel::Featured => featured_body(),
        Panel::BirdNixPage => bird_nix_page(),
        Panel::BirdNixDemo => bird_nix_demo(),
        Panel::ConsortiumPage => consortium_page(),
        Panel::ConsortiumDemo => consortium_demo(),
        Panel::HephaestusPage => hephaestus_page(),
        Panel::HephaestusDemo => hephaestus_demo(),
        Panel::FlockDemo => flock_demo(),
        Panel::PipedreamDemo => pipedream_demo(),
        Panel::NotebookKinematics => notebook_panel("kinematics", "Kinematics"),
        Panel::NotebookInverseKinematics => notebook_panel(
            "inverse-kinematic-approximations",
            "Inverse Kinematics Approximation",
        ),
        Panel::NotebookWigglystuff => notebook_panel("wigglystuff", "Wigglystuff Demos"),
    }
}

fn resources_for_project(link: &str) -> &'static [Panel] {
    match link {
        "/lib/bird-nix" => BIRD_NIX_RESOURCES,
        "/lib/consortium" => CONSORTIUM_RESOURCES,
        "/src/hephaestus" => HEPHAESTUS_RESOURCES,
        "/src/flock" => FLOCK_RESOURCES,
        "/src/pipedream" => PIPEDREAM_RESOURCES,
        "/projects/notebooks/kinematics" => KINEMATICS_RESOURCES,
        "/projects/notebooks/inverse-kinematic-approximations" => INVERSE_KINEMATICS_RESOURCES,
        "/projects/notebooks/wigglystuff"
        | "/projects/notebooks/parallelcoords"
        | "/projects/notebooks/treemap"
        | "/projects/notebooks/polynomials" => WIGGLYSTUFF_RESOURCES,
        _ => &[],
    }
}

fn random_project() -> Option<(&'static str, &'static info_core::Project)> {
    let total = info_core::project_count();
    if total == 0 {
        return None;
    }

    let idx = (js_sys::Math::random() * total as f64).floor() as usize;
    info_core::project_at(idx)
}

fn resource_panel_default(kind: Panel, index: usize, total: usize, z: i32) -> PanelWin<Panel> {
    let total = total.max(1);
    let primary = index == 0;
    let primary_basis = if total > 2 { 56.0 } else { 62.0 };
    let secondary_basis = if total > 1 {
        (100.0 - primary_basis) / (total - 1) as f64
    } else {
        100.0
    };
    let (basis, grow, min_w, min_h, tile_w, tile_h) = if total == 1 {
        (100.0, 1.0, 280.0, 220.0, 4, 3)
    } else if primary {
        (primary_basis, 2.0, 280.0, 220.0, 2, 3)
    } else {
        (secondary_basis, 1.0, 240.0, 150.0, 2, 2)
    };

    PanelWin {
        kind,
        x: 16.0,
        y: 16.0,
        w: 760.0,
        h: 560.0,
        state: WinState::Floating,
        z,
        tile_w: 1,
        tile_h: 2,
        tile_basis_pct: None,
        tile_grow: None,
        tile_min_w: None,
        tile_min_h: None,
    }
    .with_tile(tile_w, tile_h)
    .with_tile_flex(basis, grow)
    .with_tile_min(min_w, min_h)
}

fn open_project_resources(mut ws: Workspace<Panel>, resources: &'static [Panel]) {
    if resources.is_empty() {
        return;
    }

    ws.mode.set(Mode::Tiling);

    let mut panels = ws.panels;
    let mut ps = panels.write();
    ps.retain(|panel| !ALL_PROJECT_RESOURCES.contains(&panel.kind));

    let mut z = ps.iter().map(|p| p.z).max().unwrap_or(0) + 1;
    for (index, kind) in resources.iter().copied().enumerate() {
        ps.push(resource_panel_default(kind, index, resources.len(), z));
        z += 1;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects Panel — Always shows the list
// ─────────────────────────────────────────────────────────────────────────────

fn projects_panel(ws: Workspace<Panel>) -> Element {
    rsx! {
        div { class: "info-projects",
            for cat in info_core::projects() {
                div { key: "{cat.subject}", class: "cat",
                    div { class: "cat-subject", "{cat.subject}" }
                    for item in cat.items {
                        div { key: "{item.heading}", class: "proj",
                            a {
                                class: "proj-link",
                                href: "#",
                                onclick: {
                                    let link = item.link.to_string();
                                    move |e: Event<MouseData>| {
                                        e.prevent_default();
                                        open_project_resources(ws, resources_for_project(&link));
                                    }
                                },
                                "{item.heading}"
                            }
                            div { class: "proj-text", "{item.text}" }
                            if !item.links.is_empty() {
                                div { class: "proj-links",
                                    for l in item.links {
                                        a {
                                            key: "{l.label}",
                                            class: "ext",
                                            href: "{l.url}",
                                            target: "_blank",
                                            "↳ {l.label}"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Info Panel
// ─────────────────────────────────────────────────────────────────────────────

fn info_body() -> Element {
    rsx! {
        div { class: "info-panel",
            h1 { class: "name rainbow-text-animated", "Olive Casazza" }

            section { class: "contact",
                h2 { class: "section-title", "Contact" }
                div {
                    span { "email: " }
                    a { class: "link", href: "mailto:olive@casazza.info", "olive@casazza.info" }
                }
                div {
                    span { "git: " }
                    a { class: "link", href: "https://github.com/olivecasazza", target: "_blank", "github.com/olivecasazza" }
                }
            }

            section { class: "experience",
                h2 { class: "section-title", "Experience" }
                ul { class: "info-exp",
                    for e in info_core::experiences() {
                        li { key: "{e.company}", class: "exp",
                            div { class: "exp-co", "{e.company}" }
                            for r in e.roles {
                                div { key: "{r.description}", class: "exp-role",
                                    span { class: "exp-date", "{r.start}" }
                                    " - "
                                    span { class: "exp-date", "{r.end}" }
                                    ": "
                                    span { "{r.description}" }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Control Panels
// ─────────────────────────────────────────────────────────────────────────────

/// Flock demo controls - overlayed on the canvas
#[component]
fn FlockControls(canvas_id: String) -> Element {
    let mut controls_visible = use_signal(|| false);
    let mut timestep = use_signal(|| 1.0_f32);
    let mut max_flock_size = use_signal(|| 2400_u32);
    let mut enable_randomization = use_signal(|| true);

    // Clone canvas_id for all closures
    let canvas_id_effect = canvas_id.clone();
    let canvas_id_timestep = canvas_id.clone();
    let canvas_id_flock = canvas_id.clone();
    let canvas_id_rand = canvas_id.clone();

    // Sync from handle on mount and periodically
    use_effect(move || {
        let canvas_id = canvas_id_effect.clone();
        wasm_bindgen_futures::spawn_local(async move {
            gloo_timers::future::TimeoutFuture::new(500).await;
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                if let Some(v) = js_get_f32(&handle, "timestep") {
                    timestep.set(v);
                }
                if let Some(v) = js_get_u32(&handle, "max_flock_size") {
                    max_flock_size.set(v);
                }
                if let Some(v) = js_get_bool(&handle, "enable_randomization") {
                    enable_randomization.set(v);
                }
            }
        });
    });

    let toggle_controls = move |_| {
        controls_visible.set(!controls_visible());
    };

    let on_timestep_change = {
        let canvas_id = canvas_id_timestep.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<f32>() {
                timestep.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "timestep", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_flock_size_change = {
        let canvas_id = canvas_id_flock.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<u32>() {
                max_flock_size.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "max_flock_size", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_randomization_change = {
        let canvas_id = canvas_id_rand.clone();
        move |e: Event<FormData>| {
            let checked = e.value() == "true";
            enable_randomization.set(checked);
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                js_set(
                    &handle,
                    "enable_randomization",
                    &JsValue::from_bool(checked),
                );
            }
        }
    };

    rsx! {
        div { class: "demo-controls",
            button {
                class: "controls-toggle",
                onclick: toggle_controls,
                if controls_visible() { "▼ hide" } else { "▶ settings" }
            }
            if controls_visible() {
                div { class: "controls-panel",
                    div { class: "control-row",
                        label { "timestep" }
                        input {
                            r#type: "range",
                            min: "0",
                            max: "5",
                            step: "0.1",
                            value: "{timestep}",
                            oninput: on_timestep_change,
                        }
                        span { class: "control-value", "{timestep:.1}" }
                    }
                    div { class: "control-row",
                        label { "flock size" }
                        input {
                            r#type: "range",
                            min: "0",
                            max: "5000",
                            step: "100",
                            value: "{max_flock_size}",
                            oninput: on_flock_size_change,
                        }
                        span { class: "control-value", "{max_flock_size}" }
                    }
                    div { class: "control-row",
                        label {
                            input {
                                r#type: "checkbox",
                                checked: enable_randomization(),
                                onchange: on_randomization_change,
                            }
                            " auto-randomize"
                        }
                    }
                }
            }
        }
    }
}

/// Pipedream demo controls - overlayed on the canvas
#[component]
fn PipedreamControls(canvas_id: String) -> Element {
    let mut controls_visible = use_signal(|| false);
    let mut speed = use_signal(|| 20.0_f32);
    let mut scale = use_signal(|| 10.0_f32);
    let mut pixel = use_signal(|| 3.0_f32);
    let mut pipe_count = use_signal(|| 8_usize);
    let mut straightness = use_signal(|| 10_u32);

    // Clone canvas_id for all closures
    let canvas_id_effect = canvas_id.clone();
    let canvas_id_speed = canvas_id.clone();
    let canvas_id_scale = canvas_id.clone();
    let canvas_id_pixel = canvas_id.clone();
    let canvas_id_pipes = canvas_id.clone();
    let canvas_id_straight = canvas_id.clone();
    let canvas_id_reset = canvas_id.clone();

    // Sync from handle on mount
    use_effect(move || {
        let canvas_id = canvas_id_effect.clone();
        wasm_bindgen_futures::spawn_local(async move {
            gloo_timers::future::TimeoutFuture::new(500).await;
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                if let Some(v) = js_get_f32(&handle, "speed") {
                    speed.set(v);
                }
                if let Some(v) = js_get_f32(&handle, "scale") {
                    scale.set(v);
                }
                if let Some(v) = js_get_f32(&handle, "pixel") {
                    pixel.set(v);
                }
                if let Some(v) = js_get_usize(&handle, "pipe_count") {
                    pipe_count.set(v);
                }
                if let Some(v) = js_get_u32(&handle, "straightness") {
                    straightness.set(v);
                }
            }
        });
    });

    let toggle_controls = move |_| {
        controls_visible.set(!controls_visible());
    };

    let on_speed_change = {
        let canvas_id = canvas_id_speed.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<f32>() {
                speed.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "speed", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_scale_change = {
        let canvas_id = canvas_id_scale.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<f32>() {
                scale.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "scale", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_pixel_change = {
        let canvas_id = canvas_id_pixel.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<f32>() {
                pixel.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "pixel", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_pipe_count_change = {
        let canvas_id = canvas_id_pipes.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<usize>() {
                pipe_count.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "pipe_count", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_straightness_change = {
        let canvas_id = canvas_id_straight.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<u32>() {
                straightness.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "straightness", &JsValue::from_f64(v as f64));
                }
            }
        }
    };

    let on_reset = {
        let canvas_id = canvas_id_reset.clone();
        move |_| {
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                js_call_method(&handle, "reset_pipes");
            }
        }
    };

    rsx! {
        div { class: "demo-controls",
            button {
                class: "controls-toggle",
                onclick: toggle_controls,
                if controls_visible() { "▼ hide" } else { "▶ settings" }
            }
            if controls_visible() {
                div { class: "controls-panel",
                    div { class: "control-row",
                        label { "speed" }
                        input {
                            r#type: "range",
                            min: "5",
                            max: "240",
                            step: "5",
                            value: "{speed}",
                            oninput: on_speed_change,
                        }
                        span { class: "control-value", "{speed:.0}" }
                    }
                    div { class: "control-row",
                        label { "scale" }
                        input {
                            r#type: "range",
                            min: "6",
                            max: "26",
                            step: "1",
                            value: "{scale}",
                            oninput: on_scale_change,
                        }
                        span { class: "control-value", "{scale:.0}" }
                    }
                    div { class: "control-row",
                        label { "pixel" }
                        input {
                            r#type: "range",
                            min: "1",
                            max: "8",
                            step: "0.5",
                            value: "{pixel}",
                            oninput: on_pixel_change,
                        }
                        span { class: "control-value", "{pixel:.1}" }
                    }
                    div { class: "control-row",
                        label { "pipes" }
                        input {
                            r#type: "range",
                            min: "1",
                            max: "8",
                            step: "1",
                            value: "{pipe_count}",
                            oninput: on_pipe_count_change,
                        }
                        span { class: "control-value", "{pipe_count}" }
                    }
                    div { class: "control-row",
                        label { "straightness" }
                        input {
                            r#type: "range",
                            min: "1",
                            max: "20",
                            step: "1",
                            value: "{straightness}",
                            oninput: on_straightness_change,
                        }
                        span { class: "control-value", "{straightness}" }
                    }
                    div { class: "control-row",
                        button {
                            class: "reset-btn",
                            onclick: on_reset,
                            "reset pipes"
                        }
                    }
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured Panel
// ─────────────────────────────────────────────────────────────────────────────

fn featured_body() -> Element {
    rsx! {
        div { class: "featured-info",
            h1 { "project workspace" }
            p { "Choose a project from the projects panel. Detail pages, demos, notebooks, and recordings open as separate panels." }
            p { "The featured panel stays available as workspace context instead of hosting embedded demos." }
        }
    }
}

fn flock_demo() -> Element {
    rsx! {
        div { class: "featured-demo",
            BevyCanvas {
                module_path: "/wasm/flock/flock.js".to_string(),
                canvas_id: "flock-canvas".to_string(),
                loading_text: "loading flock...".to_string(),
            }
            FlockControls { canvas_id: "flock-canvas".to_string() }
        }
    }
}

fn pipedream_demo() -> Element {
    rsx! {
        div { class: "featured-demo",
            BevyCanvas {
                module_path: "/wasm/pipedream/pipedream.js".to_string(),
                canvas_id: "pipedream-canvas".to_string(),
                loading_text: "loading pipedream...".to_string(),
            }
            PipedreamControls { canvas_id: "pipedream-canvas".to_string() }
        }
    }
}

fn bird_nix_demo() -> Element {
    rsx! {
        iframe {
            src: "https://olivecasazza.github.io/bird-nix/",
            class: "featured-iframe",
            title: "bird-nix demo",
        }
    }
}

fn notebook_panel(slug: &'static str, title: &'static str) -> Element {
    let url = format!(
        "https://olivecasazza.github.io/notebooks/notebooks/{}.html",
        slug
    );
    rsx! {
        iframe {
            src: "{url}",
            class: "featured-iframe",
            title: "{title}",
        }
    }
}

fn consortium_demo() -> Element {
    rsx! {
        figure { class: "project-figure",
            img { src: "/projects-media/consortium-fan-out.gif", alt: "consortium fan-out terminal recording" }
            figcaption { "claw / molt / pinch / cast against mm01-mm05." }
        }
    }
}

fn bird_nix_page() -> Element {
    const INSTALL: &str = r#"inputs.bird-nix.url = "github:olivecasazza/bird-nix";

# As a full library:
let bn = inputs.bird-nix.lib {}; in bn.I "hello"

# Or just the combinators:
inherit (inputs.bird-nix.lib {}) I M K KI B C L W S V Y;"#;

    rsx! {
        article { class: "project-article",
            header {
                h1 { "bird-nix" }
                p { "Raymond Smullyan's To Mock a Mockingbird, in pure Nix." }
            }
            section { class: "article-section",
                p { "The birds of combinatory logic - I, M, K, KI, B, C, L, W, S, V, Y - written as pure Nix expressions, with a DSL, AST compiler, pretty-printer, property-based tests, and a tvix-eval wasm playground." }
            }
            section { class: "article-section",
                h2 { "the birds" }
                div { class: "table-wrap",
                    table { class: "bird-table",
                        thead {
                            tr {
                                th { "name" }
                                th { "aka" }
                                th { "rule" }
                            }
                        }
                        tbody {
                            tr { td { "I" } td { "idiot" } td { code { "Ix = x" } } }
                            tr { td { "M" } td { "mockingbird" } td { code { "Mx = xx" } } }
                            tr { td { "K" } td { "kestrel" } td { code { "Kxy = x" } } }
                            tr { td { "B" } td { "bluebird" } td { code { "Bxyz = x(yz)" } } }
                            tr { td { "C" } td { "cardinal" } td { code { "Cxyz = xzy" } } }
                            tr { td { "W" } td { "warbler" } td { code { "Wxy = xyy" } } }
                            tr { td { "S" } td { "starling" } td { code { "Sxyz = xz(yz)" } } }
                            tr { td { "V" } td { "vireo" } td { code { "Vxyz = zxy" } } }
                            tr { td { "Y" } td { "sage bird" } td { code { "Yx = x(Yx)" } } }
                        }
                    }
                }
            }
            section { class: "article-section",
                h2 { "a few laws" }
                p { "Once the rules are in scope the identities fall out by reduction. S K K = I: Starling distributes to two Kestrels, each of which keeps only its first argument. W K = I: Warbler duplicates into Kestrel, and Kestrel throws the duplicate away." }
            }
            section { class: "article-section",
                h2 { "install" }
                pre { class: "code-block", code { "{INSTALL}" } }
            }
            section { class: "article-section",
                h2 { "links" }
                ul {
                    li { a { class: "link", href: "https://github.com/olivecasazza/bird-nix", target: "_blank", "source" } " - github.com/olivecasazza/bird-nix" }
                    li { a { class: "link", href: "https://olivecasazza.github.io/bird-nix/", target: "_blank", "demo" } " - full playground" }
                    li { a { class: "link", href: "https://hydra.casazza.io/jobset/bird-nix/main", target: "_blank", "Hydra" } " - CI builds" }
                }
            }
        }
    }
}

fn consortium_page() -> Element {
    const INSTALL: &str = r#"nix run github:olivecasazza/consortium#claw -- -w 'node[01-16]' uptime
cargo install consortium-cli
pip install consortium"#;
    const USAGE: &str = r#"# Node-set algebra
pinch -e 'node[01-05,07]'
pinch -f node1 node2 node3
pinch -i 'node[1-5]' 'node[3-7]'

# Fan-out a command
claw -w 'node[01-16]' -- uptime
claw -w 'node[01-16]' -b -- 'uname -r'

# Coalesce piped output
some_command | molt -b

# Deploy a fleet of NixOS hosts
cast deploy --on 'hp[01-03]' switch"#;

    rsx! {
        article { class: "project-article",
            header {
                h1 { "consortium" }
                p { "A Rust reimplementation of the ClusterShell toolchain. Tokio dispatch core, persistent SSH multiplexers, workspace crates, user-facing binaries, and PyO3 bindings for existing ClusterShell scripts." }
            }
            section { class: "article-section",
                h2 { "scope" }
                p { "Replaces clush, clubak, cluset/nodeset plus the Python library, and adds cast for NixOS fleet deployment. Adapter crates resolve node sets from Slurm, Ray, Ansible, SkyPilot, or Nix flakes while the dispatcher stays scheduler-agnostic." }
            }
            section { class: "article-section",
                h2 { "workspace" }
                ul {
                    li { code { "consortium" } " - node-set parser, async dispatcher, SSH transport." }
                    li { code { "consortium-py" } " - PyO3 ClusterShell-compatible API." }
                    li { code { "consortium-cli" } " - claw, molt, pinch, cast." }
                    li { code { "consortium-nix" } ", " code { "consortium-ansible" } ", " code { "consortium-slurm" } ", " code { "consortium-ray" } ", " code { "consortium-skypilot" } " - fleet and scheduler adapters." }
                    li { code { "consortium-test-harness" } " - upstream ClusterShell parity suite." }
                }
            }
            section { class: "article-section",
                h2 { "binaries" }
                ul {
                    li { code { "claw -w 'node[01-16]' -- uptime" } " - fan-out command execution." }
                    li { code { "some_command | molt -b" } " - grouped output aggregation." }
                    li { code { "pinch -e 'node[1-5]'" } " - node-set algebra." }
                    li { code { "cast deploy --on 'hp[01-03]' switch" } " - NixOS deployment orchestration." }
                }
            }
            section { class: "article-section",
                h2 { "install" }
                pre { class: "code-block", code { "{INSTALL}" } }
            }
            section { class: "article-section",
                h2 { "usage" }
                pre { class: "code-block", code { "{USAGE}" } }
            }
            section { class: "article-section",
                h2 { "links" }
                ul {
                    li { a { class: "link", href: "https://github.com/olivecasazza/consortium", target: "_blank", "github.com/olivecasazza/consortium" } }
                    li { a { class: "link", href: "https://hydra.casazza.io/jobset/consortium/main", target: "_blank", "hydra.casazza.io/jobset/consortium/main" } " - CI" }
                    li { a { class: "link", href: "https://consortium.cachix.org", target: "_blank", "consortium.cachix.org" } " - binary cache" }
                    li { a { class: "link", href: "https://pypi.org/project/consortium", target: "_blank", "pypi.org/project/consortium" } " - PyO3 bindings" }
                }
            }
        }
    }
}

fn hephaestus_page() -> Element {
    const CRD: &str = r#"apiVersion: heph.nixlab.io/v1alpha1
kind: MetalMachinePool
metadata: { name: ml-training, namespace: heph-system }
spec:
  replicas: 3
  selector: { role: ml-worker }
  scalingStrategy: PowerCycle
  scaleDownPolicy: LeastUtilized
  cooldownSeconds: 300
---
apiVersion: heph.nixlab.io/v1alpha1
kind: MetalMachine
metadata: { name: hp01, namespace: heph-system, labels: { role: ml-worker } }
spec:
  bmc:
    address: ipmi://192.168.1.221
    protocol: Ipmi
    credentialsSecretRef: hp01-bmc
  online: true"#;
    const INSTALL: &str = r#"nix run github:casazza-info/hephaestus -- export-crds | kubectl apply -f -

helm install hephaestus ./charts/hephaestus -n heph-system --create-namespace

# Or as a Kubenix module
imports = [ flake.inputs.hephaestus.kubenixModules.hephaestus ];"#;

    rsx! {
        article { class: "project-article",
            header {
                h1 { "hephaestus" }
                p { "A bare-metal lifecycle and autoscaling operator for Kubernetes, written in Rust against kube-rs. It reconciles CRDs into power events on physical hosts via IPMI, Redfish, or Wake-on-LAN." }
            }
            section { class: "article-section",
                h2 { "scope" }
                p { "Pod autoscaling and cloud autoscaling are solved problems; bare metal is not. Hephaestus keeps a labelled pool of bare-metal hosts at a target replica count by power-cycling their BMCs." }
            }
            section { class: "article-section",
                h2 { "CRDs" }
                p { "MetalMachine represents one host. MetalMachinePool represents a label-selected group with desired replicas, scaling strategy, scale-down policy, and cooldown guard." }
                pre { class: "code-block", code { "{CRD}" } }
            }
            section { class: "article-section",
                h2 { "workspace" }
                ul {
                    li { code { "hephaestus-api" } " - CRD types and OpenAPI." }
                    li { code { "hephaestus" } " - controller binary, reconciler, BMC transports, Prometheus metrics." }
                    li { code { "hephaestus-grpc" } " - external scheduler pool-state service." }
                    li { code { "hephaestus-operator-lib" } " - telemetry and export-crds scaffolding." }
                }
            }
            section { class: "article-section",
                h2 { "production deployment" }
                p { "Runs on a nixlab fleet managing ProLiant workers and Mac Mini agents. The ML training pool scales ProLiants up when SkyPilot tasks queue and drains them back down on cordon." }
            }
            section { class: "article-section",
                h2 { "install" }
                pre { class: "code-block", code { "{INSTALL}" } }
            }
            section { class: "article-section",
                h2 { "links" }
                ul {
                    li { a { class: "link", href: "https://hydra.casazza.io/jobset/hephaestus/main", target: "_blank", "hydra.casazza.io/jobset/hephaestus/main" } " - CI" }
                    li { a { class: "link", href: "https://hephaestus.cachix.org", target: "_blank", "hephaestus.cachix.org" } " - binary cache" }
                    li { code { "ghcr.io/casazza-info/hephaestus" } " - container image" }
                }
                p { class: "muted", "Source repository is private. Contact for access." }
            }
        }
    }
}

fn hephaestus_demo() -> Element {
    const TAPE: &str = r#"# charmbracelet/vhs tape
# Render with: vhs hephaestus-scale-up.tape
# Produces:   hephaestus-scale-up.gif

kubectl get metalmachinepool edge -o yaml | tail -8
kubectl patch metalmachinepool edge --type=merge -p '{"spec":{"minReplicas":16}}'
kubectl get metalmachine -l site=edge -w
kubectl get metalmachine -l site=edge --no-headers | awk '{print $2}' | sort | uniq -c
curl -s localhost:8080/metrics | grep -E 'hephaestus_(reconcile_total|pool_ready_replicas)' | head"#;

    rsx! {
        article { class: "project-article recording-panel",
            header {
                h1 { "hephaestus recording" }
                p { "The original page referenced a rendered scale-up GIF, but the repository currently contains the VHS source tape rather than the generated GIF asset." }
            }
            section { class: "article-section",
                h2 { "scale-up tape" }
                pre { class: "code-block", code { "{TAPE}" } }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const APP_CSS: &str = r#"
:root {
  --bg:     #0a0a0a;
  --panel:  #0a0a0a;
  --fg:     #ededed;
  --dim:    #7a7a7a;
  --line:   #262626;
  --line2:  #3a3a3a;
  --accent: #d9b94c;
  --red:    #d45547;
  --yellow: #f0dd7d;
  --green:  #5dcdbe;
  --blue:   #579db4;
  --pink:   #e4786a;
  --inv-bg: #ededed;
  --inv-fg: #0a0a0a;
}

.rainbow-text-animated {
  background: linear-gradient(to right, #6666ff, #0099ff, #00ff00, #ff3399, #6666ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow_animation 6s ease-in-out infinite;
  background-size: 400% 100%;
}
@keyframes rainbow_animation {
  0%, 100% { background-position: 0 0; }
  50% { background-position: 100% 0; }
}

.ws-root {
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
}

.ws-root:not(.mobile) .panel-featured .panel-body {
  display: flex;
  overflow: hidden;
  padding: 1.55rem .4rem .4rem;
}

.panel-flocking-demo .panel-body,
.panel-pipedream-demo .panel-body,
.panel-bird-nix-demo .panel-body,
.panel-kinematics-notebook .panel-body,
.panel-inverse-kinematics-notebook .panel-body,
.panel-wigglystuff-notebook .panel-body {
  display: flex;
  overflow: hidden;
  padding: 1.55rem .4rem .4rem;
}

/* Info panel */
.info-panel { font-size: 13px; line-height: 1.5; padding: 4px 2px; }
.info-panel .name { font-size: 1.5rem; margin: 0 0 12px 0; font-weight: 400; }
.info-panel .section-title { font-size: 1rem; color: var(--green); margin: 12px 0 6px 0; font-weight: 400; }
.info-panel .contact { margin-bottom: 8px; }
.info-panel .contact div { margin: 2px 0; }
.link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
.link:hover { color: var(--yellow); }

.info-projects, .info-exp { font-size: 13px; line-height: 1.5; padding: 4px 2px; }

/* Projects list */
.cat { margin-bottom: 14px; }
.cat-subject { color: var(--dim); text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px; margin-bottom: 6px; }
.proj { margin-bottom: 10px; }
.proj-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
.proj-link:hover { color: var(--yellow); }
.proj-text { color: var(--fg); margin-top: 2px; }
.proj-links { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 4px; }
.ext { color: var(--dim); font-size: 11px; text-decoration: none; }
.ext:hover { color: var(--accent); }

/* Experience */
.info-exp { list-style: none; margin: 0; padding: 4px 2px; }
.exp { margin-bottom: 12px; }
.exp-co { color: var(--accent); font-weight: 600; }
.exp-role { margin-top: 2px; }
.exp-date { color: var(--dim); }

/* Featured panel content */
.featured-iframe {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  border: none;
  background: #fff;
}

.featured-info {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.featured-info h1 {
  color: var(--green);
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 400;
}
.featured-info p {
  color: var(--fg);
  margin: 0.25rem 0;
}
.featured-links {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

/* Featured demo container */
.featured-demo {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  position: relative;
}

/* Project detail pages */
.project-article {
  max-width: 760px;
  margin: 0 auto;
  padding: 2px 4px 18px;
  font-size: 13px;
  line-height: 1.58;
}
.project-article header {
  margin-bottom: 18px;
}
.project-article h1 {
  color: var(--green);
  font-size: 1.4rem;
  margin: 0 0 4px;
  font-weight: 400;
}
.project-article h2 {
  color: var(--green);
  font-size: .95rem;
  margin: 0;
  font-weight: 400;
}
.project-article p {
  margin: 0;
}
.project-article ul {
  margin: 0;
  padding-left: 1.2rem;
}
.article-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 18px;
}
.muted {
  color: var(--dim);
  font-size: 12px;
}
.code-block {
  margin: 0;
  padding: 10px 12px;
  overflow: auto;
  background: color-mix(in srgb, var(--line) 38%, var(--bg));
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--fg);
  font-size: 12px;
  line-height: 1.45;
}
.table-wrap {
  overflow-x: auto;
}
.bird-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.bird-table th,
.bird-table td {
  padding: 4px 12px 4px 0;
  text-align: left;
  vertical-align: top;
}
.bird-table th {
  color: var(--dim);
  font-weight: 400;
}
.project-figure {
  height: 100%;
  margin: 0;
  padding: 1.55rem .4rem .4rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.project-figure img {
  flex: 1;
  min-height: 0;
  width: 100%;
  object-fit: contain;
  background: #000;
  border: 1px solid var(--line);
}
.project-figure figcaption {
  color: var(--dim);
  font-size: 12px;
}

/* Demo controls overlay */
.demo-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.controls-toggle {
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid var(--line2);
  color: var(--dim);
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
  border-radius: 3px;
}
.controls-toggle:hover {
  color: var(--fg);
  border-color: var(--accent);
}

.controls-panel {
  background: rgba(10, 10, 10, 0.92);
  border: 1px solid var(--line2);
  border-radius: 4px;
  padding: 10px 12px;
  margin-top: 4px;
  min-width: 180px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 11px;
}
.control-row:last-child {
  margin-bottom: 0;
}
.control-row label {
  color: var(--dim);
  min-width: 70px;
}
.control-row input[type="range"] {
  flex: 1;
  height: 4px;
  accent-color: var(--accent);
}
.control-row input[type="checkbox"] {
  accent-color: var(--accent);
}
.control-value {
  color: var(--fg);
  min-width: 36px;
  text-align: right;
  font-family: monospace;
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--line2);
  color: var(--dim);
  padding: 4px 8px;
  font-size: 10px;
  cursor: pointer;
  border-radius: 3px;
  width: 100%;
}
.reset-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
"#;
