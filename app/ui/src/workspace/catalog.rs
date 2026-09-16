use std::rc::Rc;

use panel_kit::LayoutBuilder;
use panel_kit_core::PanelCatalog;

use crate::{DemoPanel, Panel};

pub(crate) fn app_catalog() -> Rc<PanelCatalog<Panel>> {
    let mut layout = LayoutBuilder::new();
    let panels = [
        Panel::Info,
        Panel::Projects,
        Panel::Featured,
        Panel::BirdNix,
        Panel::Consortium,
        Panel::Hephaestus,
        Panel::FlockDemo,
        Panel::PipedreamDemo,
        Panel::Spot,
        Panel::NotebookKinematics,
        Panel::NotebookInverseKinematics,
        Panel::NotebookWigglystuff,
        Panel::PanelKitPage,
        Panel::PanelKitWebDemo,
        Panel::PanelKitTuiDemo,
    ]
    .into_iter()
    .enumerate()
    .map(|(index, kind)| layout.at(kind, 16.0 + index as f64, 16.0, 320.0, 240.0))
    .collect::<Vec<_>>();

    Rc::new(
        PanelCatalog::from_panel_kind_layout(&panels)
            .expect("info panel enum must serialize as stable string IDs"),
    )
}

pub(crate) fn demo_catalog() -> Rc<PanelCatalog<DemoPanel>> {
    let panels = crate::demo_default_layout();
    Rc::new(
        PanelCatalog::from_panel_kind_layout(&panels)
            .expect("demo panel enum must serialize as stable string IDs"),
    )
}
