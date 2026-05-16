//! Hand-drawn pencil sketch post-processing effect
//!
//! Applies a notebook paper + hatching shader to make the scene look hand-drawn.
//! Based on Bevy's custom_post_processing example.

use bevy::{
    core_pipeline::{
        core_3d::graph::{Core3d, Node3d},
        fullscreen_vertex_shader::fullscreen_shader_vertex_state,
    },
    ecs::query::QueryItem,
    prelude::*,
    render::{
        extract_component::{
            ComponentUniforms, DynamicUniformIndex, ExtractComponent, ExtractComponentPlugin,
            UniformComponentPlugin,
        },
        render_graph::{
            NodeRunError, RenderGraphApp, RenderGraphContext, RenderLabel, ViewNode, ViewNodeRunner,
        },
        render_resource::{
            binding_types::{sampler, texture_2d, uniform_buffer},
            *,
        },
        renderer::{RenderContext, RenderDevice},
        view::ViewTarget,
        RenderApp,
    },
};

/// Shader asset path
const SHADER_ASSET_PATH: &str = "shaders/hand_drawn.wgsl";

/// Plugin that adds the hand-drawn post-processing effect
pub struct HandDrawnPlugin;

impl Plugin for HandDrawnPlugin {
    fn build(&self, app: &mut App) {
        app.add_plugins((
            ExtractComponentPlugin::<HandDrawnSettings>::default(),
            UniformComponentPlugin::<HandDrawnSettings>::default(),
        ));

        let Some(render_app) = app.get_sub_app_mut(RenderApp) else {
            return;
        };

        render_app
            .add_render_graph_node::<ViewNodeRunner<HandDrawnNode>>(Core3d, HandDrawnLabel)
            .add_render_graph_edges(
                Core3d,
                (Node3d::Tonemapping, HandDrawnLabel, Node3d::EndMainPassPostProcessing),
            );
    }

    fn finish(&self, app: &mut App) {
        let Some(render_app) = app.get_sub_app_mut(RenderApp) else {
            return;
        };

        render_app.init_resource::<HandDrawnPipeline>();
    }
}

/// Settings for the hand-drawn effect
#[derive(Component, Clone, Copy, ExtractComponent, ShaderType)]
pub struct HandDrawnSettings {
    pub time: f32,
    pub resolution_x: f32,
    pub resolution_y: f32,
    /// Intensity of the effect (0.0 = off, 1.0 = full)
    pub intensity: f32,
}

impl Default for HandDrawnSettings {
    fn default() -> Self {
        Self {
            time: 0.0,
            resolution_x: 100.0,
            resolution_y: 100.0,
            intensity: 1.0, // Default to ON
        }
    }
}

#[derive(Debug, Hash, PartialEq, Eq, Clone, RenderLabel)]
struct HandDrawnLabel;

#[derive(Default)]
struct HandDrawnNode;

impl ViewNode for HandDrawnNode {
    type ViewQuery = (
        &'static ViewTarget,
        &'static HandDrawnSettings,
        &'static DynamicUniformIndex<HandDrawnSettings>,
    );

    fn run(
        &self,
        _graph: &mut RenderGraphContext,
        render_context: &mut RenderContext,
        (view_target, _settings, settings_index): QueryItem<Self::ViewQuery>,
        world: &World,
    ) -> Result<(), NodeRunError> {
        let pipeline = world.resource::<HandDrawnPipeline>();
        let pipeline_cache = world.resource::<PipelineCache>();

        let Some(render_pipeline) = pipeline_cache.get_render_pipeline(pipeline.pipeline_id)
        else {
            return Ok(());
        };

        let settings_uniforms = world.resource::<ComponentUniforms<HandDrawnSettings>>();
        let Some(settings_binding) = settings_uniforms.uniforms().binding() else {
            return Ok(());
        };

        let post_process = view_target.post_process_write();

        let bind_group = render_context.render_device().create_bind_group(
            "hand_drawn_bind_group",
            &pipeline.layout,
            &BindGroupEntries::sequential((
                post_process.source,
                &pipeline.sampler,
                settings_binding.clone(),
            )),
        );

        let mut render_pass = render_context.begin_tracked_render_pass(RenderPassDescriptor {
            label: Some("hand_drawn_pass"),
            color_attachments: &[Some(RenderPassColorAttachment {
                view: post_process.destination,
                resolve_target: None,
                ops: Operations::default(),
            })],
            depth_stencil_attachment: None,
            timestamp_writes: None,
            occlusion_query_set: None,
        });

        render_pass.set_render_pipeline(render_pipeline);
        render_pass.set_bind_group(0, &bind_group, &[settings_index.index()]);
        render_pass.draw(0..3, 0..1);

        Ok(())
    }
}

#[derive(Resource)]
struct HandDrawnPipeline {
    layout: BindGroupLayout,
    sampler: Sampler,
    pipeline_id: CachedRenderPipelineId,
}

impl FromWorld for HandDrawnPipeline {
    fn from_world(world: &mut World) -> Self {
        let render_device = world.resource::<RenderDevice>();

        let layout = render_device.create_bind_group_layout(
            "hand_drawn_bind_group_layout",
            &BindGroupLayoutEntries::sequential(
                ShaderStages::FRAGMENT,
                (
                    texture_2d(TextureSampleType::Float { filterable: true }),
                    sampler(SamplerBindingType::Filtering),
                    uniform_buffer::<HandDrawnSettings>(true),
                ),
            ),
        );

        let sampler = render_device.create_sampler(&SamplerDescriptor::default());

        let shader = world.load_asset(SHADER_ASSET_PATH);

        let pipeline_id = world
            .resource_mut::<PipelineCache>()
            .queue_render_pipeline(RenderPipelineDescriptor {
                label: Some("hand_drawn_pipeline".into()),
                layout: vec![layout.clone()],
                vertex: fullscreen_shader_vertex_state(),
                fragment: Some(FragmentState {
                    shader,
                    shader_defs: vec![],
                    entry_point: "fragment".into(),
                    targets: vec![Some(ColorTargetState {
                        format: TextureFormat::bevy_default(),
                        blend: None,
                        write_mask: ColorWrites::ALL,
                    })],
                }),
                primitive: PrimitiveState::default(),
                depth_stencil: None,
                multisample: MultisampleState::default(),
                push_constant_ranges: vec![],
                zero_initialize_workgroup_memory: false,
            });

        Self {
            layout,
            sampler,
            pipeline_id,
        }
    }
}

/// System to update hand-drawn settings each frame
pub fn update_hand_drawn_settings(
    time: Res<Time>,
    windows: Query<&Window>,
    mut settings_query: Query<&mut HandDrawnSettings>,
) {
    let Ok(window) = windows.get_single() else {
        return;
    };

    for mut settings in settings_query.iter_mut() {
        settings.time = time.elapsed_secs();
        settings.resolution_x = window.width();
        settings.resolution_y = window.height();
        settings.intensity = 1.0; // Full effect
    }
}
