use egui::Context;

use crate::app::FlockApp;

impl eframe::App for FlockApp {
    fn update(&mut self, ctx: &Context, _frame: &mut eframe::Frame) {
        // Time.
        let dt_s = {
            let dt = ctx.input(|i| i.unstable_dt);
            if dt.is_finite() && dt > 0.0 { dt } else { 1.0 / 60.0 }
        };

        self.step(ctx, dt_s);

        // Keep animating.
        ctx.request_repaint();
    }
}
