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
    aisles: number;
    flows: number;
    pixel: number;
    racks: number;
    scale: number;
    show_ui: boolean;
    sites: number;
    speed: number;
    trail: number;
}

export function wasm_main(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_webhandle_free: (a: number, b: number) => void;
    readonly wasm_main: () => void;
    readonly webhandle_aisles: (a: number) => number;
    readonly webhandle_destroy: (a: number) => void;
    readonly webhandle_flows: (a: number) => number;
    readonly webhandle_has_panicked: (a: number) => number;
    readonly webhandle_new: () => number;
    readonly webhandle_pixel: (a: number) => number;
    readonly webhandle_racks: (a: number) => number;
    readonly webhandle_reset_pipes: (a: number) => void;
    readonly webhandle_scale: (a: number) => number;
    readonly webhandle_set_aisles: (a: number, b: number) => void;
    readonly webhandle_set_flows: (a: number, b: number) => void;
    readonly webhandle_set_pixel: (a: number, b: number) => void;
    readonly webhandle_set_racks: (a: number, b: number) => void;
    readonly webhandle_set_scale: (a: number, b: number) => void;
    readonly webhandle_set_show_ui: (a: number, b: number) => void;
    readonly webhandle_set_sites: (a: number, b: number) => void;
    readonly webhandle_set_speed: (a: number, b: number) => void;
    readonly webhandle_set_trail: (a: number, b: number) => void;
    readonly webhandle_show_ui: (a: number) => number;
    readonly webhandle_sites: (a: number) => number;
    readonly webhandle_spawn_at_norm: (a: number, b: number, c: number) => void;
    readonly webhandle_speed: (a: number) => number;
    readonly webhandle_start: (a: number, b: any) => any;
    readonly webhandle_trail: (a: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__hb75d3ea6d7536192: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h6b5177e7d70da055: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h205408623fab4814: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h43f2c833ec071a29: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h68af8df1be89a0f6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h1c0bf032ef9c0512: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hef1547959be7bec7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h8ee79aae56b3760c: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h33120249f914d678: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__ha615bbcbce373c0e: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h07daebad57cc2e15: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h56a034c2a4ed2923: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hdbdbe21f1f3029f6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h235988aac123bc17: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hfc0b040950045db8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__hc2528a39c94b8b48: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h6ce3306026f06734: (a: number, b: number) => number;
    readonly wasm_bindgen__convert__closures_____invoke__hb07939a8ab6d13ef: (a: number, b: number) => void;
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
