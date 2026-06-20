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

fn js_call_string(obj: &JsValue, method: &str) -> Option<String> {
    let func = js_sys::Reflect::get(obj, &JsValue::from_str(method)).ok()?;
    let f = func.dyn_into::<js_sys::Function>().ok()?;
    f.call0(obj).ok()?.as_string()
}

fn js_call_species_value(obj: &JsValue, id: &str, field: &str, value: f32) {
    if let Ok(func) = js_sys::Reflect::get(obj, &JsValue::from_str("set_species_value")) {
        if let Ok(f) = func.dyn_into::<js_sys::Function>() {
            let _ = f.call3(
                obj,
                &JsValue::from_str(id),
                &JsValue::from_str(field),
                &JsValue::from_f64(value as f64),
            );
        }
    }
}

#[derive(Clone, PartialEq)]
struct SpeciesConfigUi {
    id: String,
    probability: f32,
    neighbor_distance: f32,
    desired_separation: f32,
    separation_multiplier: f32,
    alignment_multiplier: f32,
    cohesion_multiplier: f32,
    max_speed: f32,
    max_force: f32,
    bird_size: f32,
    color_r: f32,
    color_g: f32,
    color_b: f32,
}

fn reflect_f32(obj: &JsValue, field: &str) -> f32 {
    js_sys::Reflect::get(obj, &JsValue::from_str(field))
        .ok()
        .and_then(|v| v.as_f64())
        .unwrap_or(0.0) as f32
}

fn reflect_string(obj: &JsValue, field: &str) -> String {
    js_sys::Reflect::get(obj, &JsValue::from_str(field))
        .ok()
        .and_then(|v| v.as_string())
        .unwrap_or_default()
}

fn parse_species_json(json: &str) -> Vec<SpeciesConfigUi> {
    let Ok(parsed) = js_sys::JSON::parse(json) else {
        return Vec::new();
    };
    let array = js_sys::Array::from(&parsed);
    array
        .iter()
        .map(|item| SpeciesConfigUi {
            id: reflect_string(&item, "id"),
            probability: reflect_f32(&item, "probability"),
            neighbor_distance: reflect_f32(&item, "neighbor_distance"),
            desired_separation: reflect_f32(&item, "desired_separation"),
            separation_multiplier: reflect_f32(&item, "separation_multiplier"),
            alignment_multiplier: reflect_f32(&item, "alignment_multiplier"),
            cohesion_multiplier: reflect_f32(&item, "cohesion_multiplier"),
            max_speed: reflect_f32(&item, "max_speed"),
            max_force: reflect_f32(&item, "max_force"),
            bird_size: reflect_f32(&item, "bird_size"),
            color_r: reflect_f32(&item, "color_r"),
            color_g: reflect_f32(&item, "color_g"),
            color_b: reflect_f32(&item, "color_b"),
        })
        .collect()
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
const SIDEBAR_TILE_WIDTH: f64 = 33.333;
const PROJECT_TILE_WIDTH: f64 = 100.0 - SIDEBAR_TILE_WIDTH;
const TOP_ROW_TILE_BASIS: f64 = 58.0;
const BOTTOM_ROW_TILE_BASIS: f64 = 100.0 - TOP_ROW_TILE_BASIS;

fn default_layout() -> Vec<PanelWin<Panel>> {
    let mut b = LayoutBuilder::new();
    vec![
        b.at(Panel::Info, 16.0, 16.0, 360.0, 360.0)
            .with_tile(2, 2)
            .with_tile_flex(TOP_ROW_TILE_BASIS, 1.0)
            .with_tile_cross(SIDEBAR_TILE_WIDTH)
            .with_tile_min(240.0, 240.0),
        b.at(Panel::Projects, 16.0, 392.0, 360.0, 260.0)
            .with_tile(2, 1)
            .with_tile_flex(BOTTOM_ROW_TILE_BASIS, 1.0)
            .with_tile_cross(SIDEBAR_TILE_WIDTH)
            .with_tile_min(220.0, 170.0),
    ]
}

const LAYOUT_KEY: &str = "info_layout_v9";

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
    let secondary_count = total.saturating_sub(1).max(1);
    // Keep the right-hand project column's row heights aligned with the
    // left-hand info/projects column. Row 1 is the featured/opened resource;
    // row 2 is shared by any additional resources for that project.
    let primary_basis = TOP_ROW_TILE_BASIS;
    let secondary_basis = BOTTOM_ROW_TILE_BASIS / secondary_count as f64;
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
        tile_cross_pct: None,
        tile_min_w: None,
        tile_min_h: None,
    }
    .with_tile(tile_w, tile_h)
    .with_tile_flex(basis, grow)
    .with_tile_cross(PROJECT_TILE_WIDTH)
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
    let mut max_flock_size = use_signal(|| 2000_u32);
    let mut enable_randomization = use_signal(|| true);
    let mut current_flock_size = use_signal(|| 0_usize);
    let mut species = use_signal(Vec::<SpeciesConfigUi>::new);

    let mut refresh_species = {
        let canvas_id = canvas_id.clone();
        move || {
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                if let Some(json) = js_call_string(&handle, "species_json") {
                    species.set(parse_species_json(&json));
                }
            }
        }
    };

    use_effect({
        let canvas_id = canvas_id.clone();
        move || {
            let canvas_id = canvas_id.clone();
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
                    if let Some(v) = js_get_usize(&handle, "current_flock_size") {
                        current_flock_size.set(v);
                    }
                    if let Some(json) = js_call_string(&handle, "species_json") {
                        species.set(parse_species_json(&json));
                    }
                }
            });
        }
    });

    let on_timestep_change = {
        let canvas_id = canvas_id.clone();
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
        let canvas_id = canvas_id.clone();
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
        let canvas_id = canvas_id.clone();
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

    let on_generate_species = {
        let canvas_id = canvas_id.clone();
        move |_| {
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                js_call_method(&handle, "generate_random_species");
            }
            refresh_species();
        }
    };

    rsx! {
        div { class: "demo-controls",
            button { class: "controls-toggle", onclick: move |_| controls_visible.set(!controls_visible()),
                if controls_visible() { "▼ hide" } else { "▶ settings" }
            }
            if controls_visible() {
                div { class: "controls-panel controls-panel-scroll",
                    div { class: "control-row",
                        label { "timestep" }
                        input { r#type: "range", min: "0", max: "5", step: "0.1", value: "{timestep}", oninput: on_timestep_change }
                        span { class: "control-value", "{timestep:.1}" }
                    }
                    div { class: "control-row",
                        label { "max flock" }
                        input { r#type: "range", min: "0", max: "2000", step: "50", value: "{max_flock_size}", oninput: on_flock_size_change }
                        span { class: "control-value", "{max_flock_size}" }
                    }
                    div { class: "control-row",
                        label { "current" }
                        span { class: "control-value", "{current_flock_size}" }
                    }
                    div { class: "control-row",
                        label {
                            input { r#type: "checkbox", checked: enable_randomization(), onchange: on_randomization_change }
                            " auto-randomize"
                        }
                    }
                    div { class: "control-row",
                        button { class: "reset-btn", onclick: on_generate_species, "generate random species" }
                    }
                    div { class: "species-list",
                        for cfg in species().iter().cloned() {
                            FlockSpeciesControls { key: "{cfg.id}", canvas_id: canvas_id.clone(), cfg: cfg.clone(), species }
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn FlockSpeciesControls(
    canvas_id: String,
    cfg: SpeciesConfigUi,
    species: Signal<Vec<SpeciesConfigUi>>,
) -> Element {
    let core_species = matches!(
        cfg.id.as_str(),
        "primary" | "secondary" | "tertiary" | "highlight"
    );
    let remove_id = cfg.id.clone();
    let on_remove = {
        let canvas_id = canvas_id.clone();
        move |_| {
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                if let Ok(func) =
                    js_sys::Reflect::get(&handle, &JsValue::from_str("remove_species"))
                {
                    if let Ok(f) = func.dyn_into::<js_sys::Function>() {
                        let _ = f.call1(&handle, &JsValue::from_str(&remove_id));
                    }
                }
            }
            species.with_mut(|items| items.retain(|item| item.id != remove_id));
        }
    };

    rsx! {
        details { class: "species-controls", open: core_species,
            summary { "{cfg.id}" }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "probability", label: "spawn probability multiplier", min: "0", max: "100", step: "1", value: cfg.probability, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "neighbor_distance", label: "neighbor distance", min: "0", max: "250", step: "1", value: cfg.neighbor_distance, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "desired_separation", label: "desired separation", min: "0", max: "250", step: "1", value: cfg.desired_separation, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "separation_multiplier", label: "separation", min: "0", max: "10", step: "0.1", value: cfg.separation_multiplier, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "alignment_multiplier", label: "alignment", min: "0", max: "10", step: "0.1", value: cfg.alignment_multiplier, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "cohesion_multiplier", label: "cohesion", min: "0", max: "10", step: "0.1", value: cfg.cohesion_multiplier, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "max_speed", label: "max speed", min: "0", max: "10", step: "0.1", value: cfg.max_speed, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "max_force", label: "max force", min: "0", max: "10", step: "0.1", value: cfg.max_force, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "bird_size", label: "bird size", min: "0.1", max: "5", step: "0.1", value: cfg.bird_size, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "color_r", label: "red", min: "0", max: "1", step: "0.01", value: cfg.color_r, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "color_g", label: "green", min: "0", max: "1", step: "0.01", value: cfg.color_g, species }
            SpeciesSlider { canvas_id: canvas_id.clone(), species_id: cfg.id.clone(), field: "color_b", label: "blue", min: "0", max: "1", step: "0.01", value: cfg.color_b, species }
            if !core_species {
                div { class: "control-row", button { class: "reset-btn", onclick: on_remove, "remove species" } }
            }
        }
    }
}

#[component]
fn SpeciesSlider(
    canvas_id: String,
    species_id: String,
    field: &'static str,
    label: &'static str,
    min: &'static str,
    max: &'static str,
    step: &'static str,
    value: f32,
    species: Signal<Vec<SpeciesConfigUi>>,
) -> Element {
    let oninput = move |e: Event<FormData>| {
        if let Ok(v) = e.value().parse::<f32>() {
            if let Some(handle) = get_bevy_handle(&canvas_id) {
                js_call_species_value(&handle, &species_id, field, v);
            }
            species.with_mut(|items| {
                if let Some(item) = items.iter_mut().find(|item| item.id == species_id) {
                    match field {
                        "probability" => item.probability = v,
                        "neighbor_distance" => item.neighbor_distance = v,
                        "desired_separation" => item.desired_separation = v,
                        "separation_multiplier" => item.separation_multiplier = v,
                        "alignment_multiplier" => item.alignment_multiplier = v,
                        "cohesion_multiplier" => item.cohesion_multiplier = v,
                        "max_speed" => item.max_speed = v,
                        "max_force" => item.max_force = v,
                        "bird_size" => item.bird_size = v,
                        "color_r" => item.color_r = v,
                        "color_g" => item.color_g = v,
                        "color_b" => item.color_b = v,
                        _ => {}
                    }
                }
            });
        }
    };

    rsx! {
        div { class: "control-row species-row",
            label { "{label}" }
            input { r#type: "range", min, max, step, value: "{value}", oninput }
            span { class: "control-value", "{value:.2}" }
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
    let mut min_spacing = use_signal(|| 5_i32);
    let mut straightness = use_signal(|| 10_u32);
    let mut max_len_per_pipe = use_signal(|| 500_usize);

    // Clone canvas_id for all closures
    let canvas_id_effect = canvas_id.clone();
    let canvas_id_speed = canvas_id.clone();
    let canvas_id_scale = canvas_id.clone();
    let canvas_id_pixel = canvas_id.clone();
    let canvas_id_pipes = canvas_id.clone();
    let canvas_id_spacing = canvas_id.clone();
    let canvas_id_straight = canvas_id.clone();
    let canvas_id_max_len = canvas_id.clone();
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
                if let Some(v) = js_get_f32(&handle, "min_spacing") {
                    min_spacing.set(v as i32);
                }
                if let Some(v) = js_get_u32(&handle, "straightness") {
                    straightness.set(v);
                }
                if let Some(v) = js_get_usize(&handle, "max_len_per_pipe") {
                    max_len_per_pipe.set(v);
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

    let on_min_spacing_change = {
        let canvas_id = canvas_id_spacing.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<i32>() {
                min_spacing.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "min_spacing", &JsValue::from_f64(v as f64));
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

    let on_max_len_change = {
        let canvas_id = canvas_id_max_len.clone();
        move |e: Event<FormData>| {
            if let Ok(v) = e.value().parse::<usize>() {
                max_len_per_pipe.set(v);
                if let Some(handle) = get_bevy_handle(&canvas_id) {
                    js_set(&handle, "max_len_per_pipe", &JsValue::from_f64(v as f64));
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
                        label { "min spacing" }
                        input {
                            r#type: "range",
                            min: "0",
                            max: "5",
                            step: "1",
                            value: "{min_spacing}",
                            oninput: on_min_spacing_change,
                        }
                        span { class: "control-value", "{min_spacing}" }
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
                        label { "max length" }
                        input {
                            r#type: "range",
                            min: "10",
                            max: "2000",
                            step: "10",
                            value: "{max_len_per_pipe}",
                            oninput: on_max_len_change,
                        }
                        span { class: "control-value", "{max_len_per_pipe}" }
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
    let url = if slug == "wigglystuff" {
        "/notebooks/wigglystuff-export/?v=20260619".to_string()
    } else {
        format!("/notebooks/{}.html", slug)
    };
    rsx! {
        iframe {
            src: "{url}",
            class: "featured-iframe notebook-iframe",
            title: "{title}",
        }
    }
}

fn consortium_demo() -> Element {
    rsx! {
        figure { class: "project-figure recording-figure",
            div {
                id: "asciinema-container",
                class: "asciinema-container",
                onmounted: move |_| {
                    let _ = web_sys::window().and_then(|w: web_sys::Window| {
                        let doc = w.document()?;
                        let js = concat!(
                            "AsciinemaPlayer.create('/projects-media/cascade-demo.cast',",
                            " document.getElementById('asciinema-container'), {",
                            "  cols: 95, rows: 30, autoPlay: true, loop: true, speed: 0.7,",
                            "  theme: 'monokai', fontSize: '11px', fit: false,",
                            "  idleTimeLimit: 2, controls: false",
                            "});"
                        ).to_string();
                        if doc.query_selector("script[src*='asciinema-player']").ok().flatten().is_none() {
                            let script = doc.create_element("script").ok()?;
                            script.set_attribute("src", "/projects-media/asciinema-player.min.js").ok()?;
                            let link = doc.create_element("link").ok()?;
                            link.set_attribute("rel", "stylesheet").ok()?;
                            link.set_attribute("href", "/projects-media/asciinema-player.css").ok()?;
                            doc.head()?.append_child(&link).ok()?;
                            doc.head()?.append_child(&script).ok()?;
                            let cb = wasm_bindgen::closure::Closure::<dyn FnMut()>::new(move || {
                                let _ = js_sys::eval(&js);
                            }).into_js_value();
                            let _ = w.set_timeout_with_callback_and_timeout_and_arguments_0(
                                cb.as_ref().unchecked_ref(), 500,
                            );
                            std::mem::forget(cb);
                        } else {
                            let _ = js_sys::eval(&js);
                        }
                        Some(())
                    });
                },
            }
            figcaption { "Live cascade deploy: cast deploy --on mm[01-05] --cascade --cascade-fanout 2 against the nixlab Mac Mini fleet." }
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
                p { "Raymond Smullyan's To Mock a Mockingbird, expressed as a pure Nix combinator library." }
            }
            section { class: "article-section",
                p { "The project implements the birds of combinatory logic - I, M, K, KI, B, C, L, W, S, V, and Y - as ordinary Nix lambdas. There are no builtins tricks or evaluator extensions; the combinators are one-line functions, and the rest of the library is built on top of them." }
                p { "Around those primitives is a small language layer: a DSL, AST compiler, pretty-printer, property-based tests, and a tvix-eval WASM playground. The goal is to make the reduction rules inspectable while still proving that the Nix expressions behave like their combinatory logic counterparts." }
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
                                th { "role" }
                            }
                        }
                        tbody {
                            tr { td { "I" } td { "idiot" } td { code { "I x = x" } } td { "identity" } }
                            tr { td { "M" } td { "mockingbird" } td { code { "M x = x x" } } td { "self application" } }
                            tr { td { "K" } td { "kestrel" } td { code { "K x y = x" } } td { "constant / first selector" } }
                            tr { td { "KI" } td { "kite" } td { code { "KI x y = y" } } td { "second selector" } }
                            tr { td { "B" } td { "bluebird" } td { code { "B x y z = x (y z)" } } td { "composition" } }
                            tr { td { "C" } td { "cardinal" } td { code { "C x y z = x z y" } } td { "argument swap" } }
                            tr { td { "L" } td { "lark" } td { code { "L x y = x (y y)" } } td { "apply to self-application" } }
                            tr { td { "W" } td { "warbler" } td { code { "W x y = x y y" } } td { "argument duplication" } }
                            tr { td { "S" } td { "starling" } td { code { "S x y z = x z (y z)" } } td { "substitution / distribution" } }
                            tr { td { "V" } td { "vireo" } td { code { "V x y z = z x y" } } td { "church pair" } }
                            tr { td { "Y" } td { "sage bird" } td { code { "Y x = x (Y x)" } } td { "fixed point" } }
                        }
                    }
                }
                ul {
                    li { "I returns its argument unchanged." }
                    li { "K and KI select the first or second value from a pair-like call." }
                    li { "B, C, W, and S are enough to express composition, reordering, duplication, and substitution." }
                    li { "V encodes a pair by accepting a selector, which makes K and KI useful as projections." }
                    li { "Y gives recursion without naming a recursive function." }
                }
            }
            section { class: "article-section",
                h2 { "a few laws" }
                p { "Once the rules are in scope, several identities fall out by ordinary beta reduction. S K K = I: Starling distributes the final argument to two Kestrels, and each Kestrel keeps only its first argument, so the original value comes back unchanged." }
                p { "W K = I takes a different path to the same result. Warbler duplicates its input into Kestrel, then Kestrel discards the duplicate. V x y K = x and V x y KI = y show how Vireo acts as a church-encoded pair: the selector you hand it decides which side of the pair is observed." }
                p { "The Nix implementation keeps those laws testable. Property tests reduce generated expressions through the compiler and compare the result against the expected combinator behavior, which catches accidental changes in the DSL and pretty-printer." }
            }
            section { class: "article-section",
                h2 { "play" }
                p { "The separate bird-nix demo panel opens the full playground: real Nix compiled to WASM with tvix-eval, wired into a browser REPL. The page panel keeps the discussion and install notes available while the demo panel is used interactively." }
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
    const USAGE: &str = r#"# Node-set algebra (no network)
pinch -e 'node[01-05,07]'        # node01 node02 node03 node04 node05 node07
pinch -f node1 node2 node3       # node[1-3]
pinch -i 'node[1-5]' 'node[3-7]' # node[3-5]   (intersection)

# Fan-out a command
claw -w 'node[01-16]' -- uptime
claw -w 'node[01-16]' -b -- 'uname -r'

# Drive a Slurm allocation
claw slurm --partition gpu --nodes 4 -- nvidia-smi

# Coalesce piped output
some_command | molt -b

# Deploy a fleet of NixOS hosts
cast deploy --on 'hp[01-03]' switch

# Python - ClusterShell-compatible
import consortium
task = consortium.Task("hostname")
task.run("node[01-16]")"#;

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
                    li { code { "claw -w 'node[01-16]' -- uptime" } " - fan-out command execution. Replaces clush. Flags include -b for coalescing identical output, --copy for file transfer, and -l for remote user selection." }
                    li { code { "some_command | molt -b" } " - aggregates node:line stdin into grouped output. Replaces clubak." }
                    li { code { "pinch -e 'node[1-5]'" } " - node-set algebra. Replaces cluset/nodeset with expand, fold, count, intersection, and difference operations." }
                    li { code { "cast deploy --on 'hp[01-03]' switch" } " - NixOS deployment orchestration. Reads fleet.json, builds closures, copies them to host groups, and activates them. Subcommands include build, eval, health, and status." }
                }
            }
            section { class: "article-section",
                h2 { "test-harness contract" }
                p { "ClusterShell's upstream Python suite covers the node-set parser, the event loop, SSH transports, and the CLIs. consortium-test-harness runs that suite against both the original Python implementation and the consortium-py binding, asserting identical results." }
                p { "That test harness is the compatibility contract. The Rust core can be refactored freely, but changes that break parser behavior, grouped output, or Python API parity are blocked at CI." }
            }
            section { class: "article-section",
                h2 { "recording - nixlab Mac Mini fan-out" }
                p { "The separate consortium recording panel shows pinch exercising the parser, claw fanning out uptime across mm01-mm05, molt -b coalescing a kernel-version sweep, cast health probing the NixOS build hosts, and cast eval printing the deployment plan without applying it." }
                p { "Keeping the recording in its own panel lets the writeup remain readable while the terminal playback can be inspected beside it." }
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
  networkConfig:
    address: 192.168.1.121/24
    interface: bond0
  hardware:
    cpuCores: 16
    memoryMib: 65536
    gpu: { product: "NVIDIA RTX 5000", count: 1, vramMib: 16384 }
  poolRef: ml-training
    online: true"#;
    const INSTALL: &str = r#"nix run github:casazza-info/hephaestus -- export-crds | kubectl apply -f -

helm install hephaestus ./charts/hephaestus -n heph-system --create-namespace

# Or as a Kubenix module
imports = [ flake.inputs.hephaestus.kubenixModules.hephaestus ];"#;

    rsx! {
        article { class: "project-article",
            header {
                h1 { "hephaestus" }
                p { "A bare-metal lifecycle and autoscaling operator for Kubernetes, written in Rust against kube-rs. Treats physical hosts as first-class K8s objects and reconciles power + pool size through their BMCs." }
            }
            section { class: "article-section",
                h2 { "why" }
                p { "Kubernetes scales pods. Cluster-autoscaler scales cloud instances. Neither does anything for the bare-metal host: a saturated on-prem pool means someone in the rack or clicking a vendor BMC web UI. Existing tools (Metal3, Tinkerbell) target hyperscale provisioning pipelines and pull in their own CRD ecosystems. Hephaestus is intentionally smaller: it keeps a labelled host pool at a target replica count by power-cycling the underlying BMCs." }
                p { "The operator sits between Kubernetes scheduling intent and the physical machines in a lab or HPC fleet. Instead of treating bare-metal nodes as static inventory, it allows a pool to scale up for queued work and drain back down when the pool is no longer needed." }
            }
            section { class: "article-section",
                h2 { "CRDs" }
                p { "MetalMachine describes one host: BMC address + protocol (IPMI / Redfish / WakeOnLAN), credentials secret, network config, hardware profile (CPU/memory/GPU), and a pool reference. Status tracks phase (Registering | Inspecting | Available | Provisioning | JoiningCluster | Ready | Deprovisioning | PoweringOff | Error), BMC reachability, current power state, and the K8s node name once the host has joined." }
                p { "MetalMachinePool is a label-selected group of MetalMachines with desired replicas, a scalingStrategy (PowerCycle for warm hosts, PxeProvision for clean re-installs), and a scaleDownPolicy (LeastUtilized | Newest). The pool controller diffs Ready vs desired and instructs the per-machine controller to power on or off, with a configurable cooldown to avoid thrash." }
                pre { class: "code-block", code { "{CRD}" } }
            }
            section { class: "article-section",
                h2 { "workspace shape" }
                ul {
                    li { code { "hephaestus-api" } " - CRD types, schemars-generated OpenAPI." }
                    li { code { "hephaestus" } " - controller binary; kube reconciler, IPMI/Redfish/WoL transports, and Prometheus metrics on :8080/metrics." }
                    li { code { "hephaestus-grpc" } " - gRPC service for external schedulers to query pool state." }
                    li { code { "hephaestus-operator-lib" } " - shared telemetry and export-crds CLI scaffolding, reused by sibling operators." }
                }
            }
            section { class: "article-section",
                h2 { "case study - nixlab fleet" }
                p { "Live in production on the nixlab cluster. Manages three ProLiant workers (hp01-03) plus five Mac Mini agents (mm01-05). Power events flow through IPMI for the ProLiants and Wake-on-LAN for the Macs (no BMC). The hpc-workers pool scales 0 → 3 ProLiants when SkyPilot tasks queue up, and scales back to zero when the pool is idle. End-to-end from kubectl patch metalmachinepool to a Ready node sits around 90 s, dominated by firmware POST + PXE — the controller itself reconciles in tens of milliseconds." }
                p { "The separate recording panel shows a real 3 → 0 → 3 power cycle captured against hp01-hp03: the operator sends IPMI power-off to all three hosts simultaneously, waits for them to reach Available, then powers them back on. The firmware POST dominates — the controller's reconcile loop runs in milliseconds." }
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
    rsx! {
        figure { class: "project-figure recording-figure",
            div {
                id: "asciinema-heph-container",
                class: "asciinema-container",
                onmounted: move |_| {
                    let _ = web_sys::window().and_then(|w: web_sys::Window| {
                        let doc = w.document()?;
                        let js = concat!(
                            "AsciinemaPlayer.create('/projects-media/hephaestus-demo.cast',",
                            " document.getElementById('asciinema-heph-container'), {",
                            "  cols: 95, rows: 30, autoPlay: true, loop: true, speed: 0.7,",
                            "  theme: 'monokai', fontSize: '11px', fit: false,",
                            "  idleTimeLimit: 3, controls: false",
                            "});"
                        ).to_string();
                        if doc.query_selector("script[src*='asciinema-player']").ok().flatten().is_none() {
                            let script = doc.create_element("script").ok()?;
                            script.set_attribute("src", "/projects-media/asciinema-player.min.js").ok()?;
                            let link = doc.create_element("link").ok()?;
                            link.set_attribute("rel", "stylesheet").ok()?;
                            link.set_attribute("href", "/projects-media/asciinema-player.css").ok()?;
                            doc.head()?.append_child(&link).ok()?;
                            doc.head()?.append_child(&script).ok()?;
                            let cb = wasm_bindgen::closure::Closure::<dyn FnMut()>::new(move || {
                                let _ = js_sys::eval(&js);
                            }).into_js_value();
                            let _ = w.set_timeout_with_callback_and_timeout_and_arguments_0(
                                cb.as_ref().unchecked_ref(), 500,
                            );
                            std::mem::forget(cb);
                        } else {
                            let _ = js_sys::eval(&js);
                        }
                        Some(())
                    });
                },
            }
            figcaption { "Real IPMI scale-up/down: kubectl patch metalmachinepool hpc-workers replicas 3→0→3 against nixlab ProLiant hosts." }
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
  background: var(--bg);
  color-scheme: dark;
}
.notebook-iframe {
  background: #0a0a0a;
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
.ws-root:not(.mobile) .panel-consortium-demo,
.ws-root:not(.mobile) .panel-hephaestus-recording {
  --panel-min-h: 120px;
}
.asciinema-container {
  flex: 1;
  min-width: 0;
  min-height: 120px;
  overflow: hidden;
}
.cascade-split {
  display: flex;
  gap: 8px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.cascade-tree {
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  padding: 12px 8px;
  overflow-y: auto;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--line);
  border-radius: 4px;
}
.tree-title {
  color: var(--dim);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.tree-round {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}
.round-label {
  color: var(--dim);
  font-size: 9px;
  width: 20px;
  padding-top: 4px;
  text-align: right;
  flex-shrink: 0;
}
.tree-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  flex: 1;
}
.tree-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}
.tree-branch {
  display: flex;
  gap: 40px;
  height: 14px;
}
.tree-line {
  display: block;
  width: 1px;
  height: 100%;
  background: var(--line2);
}
.tree-node {
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  border: 1px solid var(--line2);
  background: var(--panel);
  color: var(--dim);
  white-space: nowrap;
  animation: node-pop 0.3s ease-out;
}
@keyframes node-pop {
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
}
.tree-source {
  border-color: var(--yellow);
  color: var(--yellow);
  background: rgba(240,221,125,0.08);
}
.tree-active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(217,185,76,0.08);
  animation: node-pop 0.3s ease-out, pulse-border 1.5s ease-in-out infinite 0.3s;
}
@keyframes pulse-border {
  50% { box-shadow: 0 0 8px rgba(217,185,76,0.4); }
}
.tree-done {
  border-color: var(--green);
  color: var(--green);
  background: rgba(93,205,190,0.05);
}
.tree-summary {
  margin-top: auto;
  color: var(--dim);
  font-size: 10px;
  text-align: center;
  padding-top: 12px;
}
.heph-panel {
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--line);
  border-radius: 4px;
}
.heph-replicas {
  display: flex;
  align-items: baseline;
  gap: 4px;
  justify-content: center;
}
.heph-replica-num {
  font-size: 28px;
  font-weight: bold;
  color: var(--accent);
}
.heph-replica-label {
  font-size: 11px;
  color: var(--dim);
}
.heph-phase {
  text-align: center;
  font-size: 10px;
  color: var(--dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.heph-hosts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}
.heph-host {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-radius: 3px;
  border: 1px solid var(--line2);
  background: var(--panel);
  font-size: 11px;
  animation: node-pop 0.3s ease-out;
}
.heph-host-name { font-weight: bold; }
.heph-host-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.heph-host-state { font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; }
.heph-host-uptime { font-size: 8px; opacity: 0.7; }
.heph-ready { border-color: var(--green); }
.heph-ready .heph-host-name { color: var(--green); }
.heph-ready .heph-host-state { color: var(--green); }
.heph-off { border-color: var(--line2); opacity: 0.5; }
.heph-off .heph-host-name, .heph-off .heph-host-state { color: var(--dim); }
.heph-powering-off { border-color: var(--red); animation: node-pop 0.3s ease-out, pulse-border 1s ease-in-out infinite 0.3s; }
.heph-powering-off .heph-host-name, .heph-powering-off .heph-host-state { color: var(--red); }
.heph-provisioning { border-color: var(--yellow); animation: node-pop 0.3s ease-out, pulse-border 1.5s ease-in-out infinite 0.3s; }
.heph-provisioning .heph-host-name, .heph-provisioning .heph-host-state { color: var(--yellow); }
.heph-joining { border-color: var(--blue); animation: node-pop 0.3s ease-out, pulse-border 1.5s ease-in-out infinite 0.3s; }
.heph-joining .heph-host-name, .heph-joining .heph-host-state { color: var(--blue); }
.heph-info {
  margin-top: auto;
  text-align: center;
  font-size: 9px;
  color: var(--dim);
  line-height: 1.5;
}
.project-figure img {
  flex: 1;
  min-height: 0;
  width: min(100%, 1100px);
  max-width: 100%;
  align-self: center;
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
.controls-panel-scroll {
  width: min(420px, calc(100vw - 32px));
  max-height: min(72vh, 640px);
  overflow-y: auto;
}
.species-list {
  border-top: 1px solid var(--line);
  margin-top: 8px;
  padding-top: 8px;
}
.species-controls {
  border: 1px solid var(--line);
  padding: 6px 8px;
  margin-top: 6px;
}
.species-controls summary {
  color: var(--accent);
  cursor: pointer;
  font-size: 11px;
  margin-bottom: 6px;
}
.species-row label {
  min-width: 150px;
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

/* Cascade fan-out demo */
.cascade-demo {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 1.55rem .4rem .4rem;
  overflow: auto;
}
.cascade-term {
  background: #050505;
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}
.term-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #111;
  border-bottom: 1px solid var(--line);
}
.term-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}
.term-title {
  color: var(--dim);
  font-size: 11px;
}
.term-body {
  padding: 8px 10px;
  font-size: 11px;
  line-height: 1.7;
  max-height: 220px;
  overflow-y: auto;
}
.term-line { white-space: pre-wrap; }
.term-cmd { color: var(--accent); }
.term-info { color: var(--dim); }
.term-r0 { color: var(--yellow); }
.term-r1 { color: var(--green); }
.term-r2 { color: var(--blue); }
.term-done { color: var(--accent); font-weight: bold; }
.term-cursor { color: var(--accent); animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
.cascade-tree {
  flex: 1;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px;
}
.tree-round {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  justify-content: center;
}
.round-label {
  color: var(--dim);
  font-size: 10px;
  width: 50px;
  text-align: right;
  flex-shrink: 0;
}
.tree-node {
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  border: 1px solid var(--line2);
  background: var(--panel);
  color: var(--dim);
  white-space: nowrap;
  animation: node-pop 0.3s ease-out;
}
@keyframes node-pop {
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
}
.tree-source {
  border-color: var(--yellow);
  color: var(--yellow);
  background: rgba(240,221,125,0.08);
}
.tree-active {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(217,185,76,0.08);
  animation: node-pop 0.3s ease-out, pulse-border 1.5s ease-in-out infinite 0.3s;
}
@keyframes pulse-border {
  50% { box-shadow: 0 0 8px rgba(217,185,76,0.4); }
}
.tree-done {
  border-color: var(--green);
  color: var(--green);
  background: rgba(93,205,190,0.05);
}
.tree-edges {
  display: flex;
  gap: 24px;
}
.tree-edges .edge {
  display: block;
  width: 1px;
  height: 20px;
  background: var(--line2);
}
.tree-nodes {
  display: flex;
  gap: 8px;
}
.tree-nodes-r2 {
  display: flex;
  align-items: center;
  gap: 16px;
}
.tree-group {
  display: flex;
  gap: 8px;
}
.cascade-demo figcaption {
  color: var(--dim);
  font-size: 11px;
  text-align: center;
  padding: 4px 12px;
}
"#;
