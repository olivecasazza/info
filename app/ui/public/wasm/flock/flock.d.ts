/* tslint:disable */
/* eslint-disable */

export class BirdConfig {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static new(id: string, probability: number, neighbor_distance: number, desired_separation: number, separation_multiplier: number, alignment_multiplier: number, cohesion_multiplier: number, max_speed: number, max_force: number, bird_size: number, color_r: number, color_g: number, color_b: number): BirdConfig;
    id: string;
    alignment_multiplier: number;
    bird_size: number;
    cohesion_multiplier: number;
    color_b: number;
    color_g: number;
    color_r: number;
    desired_separation: number;
    max_force: number;
    max_speed: number;
    neighbor_distance: number;
    probability: number;
    separation_multiplier: number;
}

export class Flock {
    free(): void;
    [Symbol.dispose](): void;
    add_bird(config_id: string, pos_x: number, pos_y: number): void;
    add_bird_at_random_position(config_id: string, width: number, height: number): void;
    insert_bird_config(config_id: string, bird_config: BirdConfig): void;
    constructor(max_flock_size: number, seed: bigint);
    remove_bird_config(config_id: string): void;
    update(width: number, height: number, time_step: number, update_flock_geometry: Function): void;
    readonly current_flock_size: number;
    max_flock_size: number;
}

export class WebHandle {
    free(): void;
    [Symbol.dispose](): void;
    destroy(): void;
    generate_random_species(): void;
    has_panicked(): boolean;
    is_pointer_over_ui(): boolean;
    constructor();
    remove_species(id: string): void;
    set_species_value(id: string, field: string, value: number): void;
    spawn_at_norm(_x: number, _y: number): void;
    species_json(): string;
    start(canvas: HTMLCanvasElement): Promise<void>;
    readonly current_flock_size: number;
    enable_randomization: boolean;
    max_flock_size: number;
    show_ui: boolean;
    timestep: number;
}

export function wasm_main(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_birdconfig_free: (a: number, b: number) => void;
    readonly __wbg_flock_free: (a: number, b: number) => void;
    readonly __wbg_get_birdconfig_alignment_multiplier: (a: number) => number;
    readonly __wbg_get_birdconfig_bird_size: (a: number) => number;
    readonly __wbg_get_birdconfig_cohesion_multiplier: (a: number) => number;
    readonly __wbg_get_birdconfig_color_b: (a: number) => number;
    readonly __wbg_get_birdconfig_color_g: (a: number) => number;
    readonly __wbg_get_birdconfig_color_r: (a: number) => number;
    readonly __wbg_get_birdconfig_desired_separation: (a: number) => number;
    readonly __wbg_get_birdconfig_max_force: (a: number) => number;
    readonly __wbg_get_birdconfig_max_speed: (a: number) => number;
    readonly __wbg_get_birdconfig_neighbor_distance: (a: number) => number;
    readonly __wbg_get_birdconfig_probability: (a: number) => number;
    readonly __wbg_get_birdconfig_separation_multiplier: (a: number) => number;
    readonly __wbg_set_birdconfig_alignment_multiplier: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_bird_size: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_cohesion_multiplier: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_color_b: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_color_g: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_color_r: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_desired_separation: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_max_force: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_max_speed: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_neighbor_distance: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_probability: (a: number, b: number) => void;
    readonly __wbg_set_birdconfig_separation_multiplier: (a: number, b: number) => void;
    readonly __wbg_webhandle_free: (a: number, b: number) => void;
    readonly birdconfig_id: (a: number) => [number, number];
    readonly birdconfig_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => number;
    readonly birdconfig_set_id: (a: number, b: number, c: number) => void;
    readonly flock_add_bird: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly flock_add_bird_at_random_position: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly flock_current_flock_size: (a: number) => number;
    readonly flock_insert_bird_config: (a: number, b: number, c: number, d: number) => void;
    readonly flock_max_flock_size: (a: number) => number;
    readonly flock_new: (a: number, b: bigint) => number;
    readonly flock_remove_bird_config: (a: number, b: number, c: number) => void;
    readonly flock_set_max_flock_size: (a: number, b: number) => void;
    readonly flock_update: (a: number, b: number, c: number, d: number, e: any) => void;
    readonly wasm_main: () => void;
    readonly webhandle_current_flock_size: (a: number) => number;
    readonly webhandle_destroy: (a: number) => void;
    readonly webhandle_enable_randomization: (a: number) => number;
    readonly webhandle_generate_random_species: (a: number) => void;
    readonly webhandle_has_panicked: (a: number) => number;
    readonly webhandle_max_flock_size: (a: number) => number;
    readonly webhandle_new: () => number;
    readonly webhandle_remove_species: (a: number, b: number, c: number) => void;
    readonly webhandle_set_enable_randomization: (a: number, b: number) => void;
    readonly webhandle_set_max_flock_size: (a: number, b: number) => void;
    readonly webhandle_set_show_ui: (a: number, b: number) => void;
    readonly webhandle_set_species_value: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly webhandle_set_timestep: (a: number, b: number) => void;
    readonly webhandle_show_ui: (a: number) => number;
    readonly webhandle_spawn_at_norm: (a: number, b: number, c: number) => void;
    readonly webhandle_species_json: (a: number) => [number, number];
    readonly webhandle_start: (a: number, b: any) => any;
    readonly webhandle_timestep: (a: number) => number;
    readonly webhandle_is_pointer_over_ui: (a: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__h38ceabc43d4134bc: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__hf1bbae459f7296f8: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h43131957f3b9256c: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_3: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13c7de1e82782d94: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13c7de1e82782d94_5: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13c7de1e82782d94_8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_9: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_10: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_11: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h13c7de1e82782d94_12: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2bf6342a60dad646_13: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__ha48ba26a2886c19d: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h2349edbd2210e499: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
