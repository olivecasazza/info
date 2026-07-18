//! Renderer-agnostic content for the info site.
//!
//! This is the single source of truth ported verbatim from the Nuxt
//! components (`ProjectsWrapper.vue`, `ExperienceList.vue`). Every renderer —
//! the Dioxus web panels, the ratatui terminal, the ratzilla browser terminal
//! — reads this same data, so the *content* stays identical across skins while
//! the *layout* moves into a panel workspace.
//!
//! It is intentionally `#![no_std]`-friendly in spirit: pure `&'static` const
//! data, no dependencies, no platform APIs, so it compiles cleanly to both
//! `wasm32-unknown-unknown` and the native host target.

#![forbid(unsafe_code)]

/// An external link shown under a project (`↳ label`).
#[derive(Clone, Copy, Debug)]
pub struct Link {
    /// Short label, e.g. `"source"`, `"demo"`, `"Hydra"`.
    pub label: &'static str,
    /// Destination URL.
    pub url: &'static str,
}

/// One project / library / notebook entry.
#[derive(Clone, Copy, Debug)]
pub struct Project {
    /// Display heading, e.g. `"bird-nix"`.
    pub heading: &'static str,
    /// One-line description.
    pub text: &'static str,
    /// In-site route to the detail page, e.g. `"/lib/bird-nix"`.
    pub link: &'static str,
    /// External links rendered as a row beneath the description.
    pub links: &'static [Link],
}

/// A titled group of [`Project`]s (`libraries`, `projects`, `notebooks`).
#[derive(Clone, Copy, Debug)]
pub struct Category {
    /// Group title.
    pub subject: &'static str,
    /// Entries in the group, in display order.
    pub items: &'static [Project],
}

/// One position held at a [`Experience`] company.
#[derive(Clone, Copy, Debug)]
pub struct Role {
    /// Start year (or `"2015"`).
    pub start: &'static str,
    /// End year, or `"present"`.
    pub end: &'static str,
    /// Role title / description.
    pub description: &'static str,
}

/// A company/school and the roles held there.
#[derive(Clone, Copy, Debug)]
pub struct Experience {
    /// Organization name.
    pub company: &'static str,
    /// Roles, most recent first.
    pub roles: &'static [Role],
}

/// The project catalog, grouped by subject. Ported from `ProjectsWrapper.vue`.
pub fn projects() -> &'static [Category] {
    PROJECTS
}

/// The experience list, most recent first. Ported from `ExperienceList.vue`.
pub fn experiences() -> &'static [Experience] {
    EXPERIENCES
}

/// Deterministic index into [`projects`]' flattened item list, derived from a
/// caller-supplied seed. The "random project" the background used to show is
/// chosen by the renderer (which owns RNG/time); core only provides the
/// flattened addressing so every skin agrees on what item `n` is.
pub fn project_count() -> usize {
    PROJECTS.iter().map(|c| c.items.len()).sum()
}

/// The `n`th project across all categories (wraps), with its category subject.
pub fn project_at(n: usize) -> Option<(&'static str, &'static Project)> {
    let total = project_count();
    if total == 0 {
        return None;
    }
    let mut idx = n % total;
    for cat in PROJECTS {
        if idx < cat.items.len() {
            return Some((cat.subject, &cat.items[idx]));
        }
        idx -= cat.items.len();
    }
    None
}

static PROJECTS: &[Category] = &[
    Category {
        subject: "libraries",
        items: &[
            Project {
                heading: "bird-nix",
                text: "Combinator library from \"To Mock a Mockingbird\" — I, M, K, B, C, W, S, V, Y — as pure Nix, with compiler, DSL, and property-based testing.",
                link: "/lib/bird-nix",
                links: &[
                    Link { label: "demo", url: "https://olivecasazza.github.io/bird-nix/" },
                    Link { label: "source", url: "https://github.com/olivecasazza/bird-nix" },
                    Link { label: "Hydra", url: "https://hydra.casazza.io/jobset/bird-nix/main" },
                ],
            },
            Project {
                heading: "consortium",
                text: "Rust rewrite of ClusterShell with PyO3 Python bindings. Ships a CLI plus adapters for Nix, Ansible, Slurm, Ray, and SkyPilot for parallel command execution across HPC clusters.",
                link: "/lib/consortium",
                links: &[
                    Link { label: "source", url: "https://github.com/olivecasazza/consortium" },
                    Link { label: "Hydra", url: "https://hydra.casazza.io/jobset/consortium/main" },
                    Link { label: "cachix", url: "https://consortium.cachix.org" },
                ],
            },
        ],
    },
    Category {
        subject: "projects",
        items: &[
            Project {
                heading: "hephaestus",
                text: "Bare-metal Kubernetes operator reconciling MetalMachine and MetalMachinePool CRDs via IPMI/Redfish BMC control and Wake-on-LAN. Built on kube-rs with Prometheus metrics and a Helm chart.",
                link: "/src/hephaestus",
                links: &[
                    Link { label: "source", url: "https://github.com/casazza-info/hephaestus" },
                    Link { label: "Helm chart", url: "https://github.com/casazza-info/hephaestus/tree/main/charts/hephaestus" },
                    Link { label: "Hydra", url: "https://hydra.casazza.io/jobset/hephaestus/main" },
                    Link { label: "cachix", url: "https://hephaestus.cachix.org" },
                ],
            },
            Project {
                heading: "Flocking",
                text: "Boids algorithm with dynamic species configuration and real-time parameter tuning.",
                link: "/src/flock",
                links: &[
                    Link { label: "demo", url: "/src/flock" },
                    Link { label: "source", url: "https://github.com/olivecasazza/info/tree/main/wasm/flock" },
                ],
            },
            Project {
                heading: "Spot Gym",
                text: "Reinforcement-learned quadruped locomotion, replayed in the browser: the training physics (Rust/Rapier) compiled to WASM with in-browser ONNX inference, plus a dev-log of every reward exploit along the way.",
                link: "/src/spot",
                links: &[
                    Link { label: "live gym", url: "https://spot.casazza.io" },
                    Link { label: "demo", url: "/src/spot" },
                    Link { label: "source", url: "https://github.com/olivecasazza/skypilot-env" },
                    Link { label: "training dashboard", url: "https://spot-walk.casazza.io" },
                ],
            },
            Project {
                heading: "Conduit",
                text: "Procedural 3D path generation with collision avoidance and random-walk routing.",
                link: "/src/pipedream",
                links: &[
                    Link { label: "demo", url: "/src/pipedream" },
                    Link { label: "source", url: "https://github.com/olivecasazza/info/tree/main/wasm/pipedream" },
                ],
            },
            Project {
                heading: "panel-kit",
                text: "A window tiling layout manager library for Rust and WebAssembly, powering Native OS, HTML5 browser and Ratzilla/Ratatui terminal panel UI/UX. This site runs on panel-kit",
                link: "/src/panel-kit",
                links: &[
                    Link { label: "source", url: "https://github.com/olivecasazza/panel-kit" },
                    Link { label: "jump-cannon", url: "https://github.com/ocasazza/jump-cannon" },
                    Link { label: "definitely-not-crosswords", url: "https://github.com/olivecasazza/definitely-not-crosswords" },
                    Link { label: "bird-nix", url: "https://github.com/olivecasazza/bird-nix" },
                ],
            },
        ],
    },
    Category {
        subject: "notebooks",
        items: &[
            Project {
                heading: "Kinematics",
                text: "An analysis of the kinematics of robotic manipulator.",
                link: "/projects/notebooks/kinematics",
                links: &[Link {
                    label: "source",
                    url: "https://github.com/olivecasazza/SDSU-CS556-Workspace/blob/master/a4/p4.ipynb",
                }],
            },
            Project {
                heading: "Inverse Kinematics Approximation",
                text: "Approximation of a 2d inverse kinematic function.",
                link: "/projects/notebooks/inverse-kinematic-approximations",
                links: &[Link {
                    label: "source",
                    url: "https://github.com/olivecasazza/SDSU-CS556-Workspace/blob/master/a3/Assignment%203%2C%20Part%202.ipynb",
                }],
            },
            Project {
                heading: "Wigglystuff Demos",
                text: "Interactive Wigglystuff demos: parallel coordinates, hierarchical treemaps, and draggable polynomial phase portraits.",
                link: "/projects/notebooks/wigglystuff",
                links: &[Link {
                    label: "source",
                    url: "https://github.com/olivecasazza/notebooks/blob/main/content/pyodide/wigglystuff/wigglystuff_demos.py",
                }],
            },
        ],
    },
];

static EXPERIENCES: &[Experience] = &[
    Experience {
        company: "Schrödinger",
        roles: &[Role {
            start: "2024",
            end: "present",
            description: "Systems Engineer",
        }],
    },
    Experience {
        company: "Nvidia",
        roles: &[Role {
            start: "2024",
            end: "2024",
            description: "Senior HPC Data Analyst",
        }],
    },
    Experience {
        company: "Qualcomm",
        roles: &[
            Role {
                start: "2021",
                end: "2023",
                description: "Cloud Tools Software Engineer",
            },
            Role {
                start: "2020",
                end: "2021",
                description: "Programmer Analyst",
            },
        ],
    },
    Experience {
        company: "San Diego State University",
        roles: &[Role {
            start: "2015",
            end: "2019",
            description: "Bachelor\u{2019}S Degree In Computer Science",
        }],
    },
    Experience {
        company: "Voyager Space Technologies",
        roles: &[Role {
            start: "2018",
            end: "2019",
            description: "Full Stack Software Engineer",
        }],
    },
    Experience {
        company: "SDSU Rocket Project",
        roles: &[Role {
            start: "2015",
            end: "2018",
            description: "Systems and Avionics Engineer",
        }],
    },
];
