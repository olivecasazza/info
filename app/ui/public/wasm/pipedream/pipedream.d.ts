/* tslint:disable */
/* eslint-disable */

/**
 * WebHandle for Bevy-based pipedream WASM app.
 */
export class WebHandle {
    free(): void;
    [Symbol.dispose](): void;
    destroy(): void;
    has_panicked(): boolean;
    constructor();
    reset_pipes(): void;
    spawn_at_norm(_x: number, _y: number): void;
    start(canvas: HTMLCanvasElement): Promise<void>;
    max_len_per_pipe: number;
    min_spacing: number;
    pipe_count: number;
    pixel: number;
    scale: number;
    show_ui: boolean;
    speed: number;
    straightness: number;
}

export function wasm_main(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_webhandle_free: (a: number, b: number) => void;
    readonly wasm_main: () => void;
    readonly webhandle_destroy: (a: number) => void;
    readonly webhandle_has_panicked: (a: number) => number;
    readonly webhandle_max_len_per_pipe: (a: number) => number;
    readonly webhandle_min_spacing: (a: number) => number;
    readonly webhandle_new: () => number;
    readonly webhandle_pipe_count: (a: number) => number;
    readonly webhandle_pixel: (a: number) => number;
    readonly webhandle_reset_pipes: (a: number) => void;
    readonly webhandle_scale: (a: number) => number;
    readonly webhandle_set_max_len_per_pipe: (a: number, b: number) => void;
    readonly webhandle_set_min_spacing: (a: number, b: number) => void;
    readonly webhandle_set_pipe_count: (a: number, b: number) => void;
    readonly webhandle_set_pixel: (a: number, b: number) => void;
    readonly webhandle_set_scale: (a: number, b: number) => void;
    readonly webhandle_set_show_ui: (a: number, b: number) => void;
    readonly webhandle_set_speed: (a: number, b: number) => void;
    readonly webhandle_set_straightness: (a: number, b: number) => void;
    readonly webhandle_show_ui: (a: number) => number;
    readonly webhandle_spawn_at_norm: (a: number, b: number, c: number) => void;
    readonly webhandle_speed: (a: number) => number;
    readonly webhandle_start: (a: number, b: any) => any;
    readonly webhandle_straightness: (a: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__h9829ca5cb514abfa: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h6862f6da5a8a30f9: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h9045d862f6afa74a: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_3: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h4279800c10b91d9a: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h4279800c10b91d9a_5: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h4279800c10b91d9a_8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_9: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_10: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_11: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h4279800c10b91d9a_12: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1e06c38b874578ad_13: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h0deb11689d9bfd3b: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hca7a0100f42141f0: (a: number, b: number) => void;
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
