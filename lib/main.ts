import { greet, create_pair, add_pair, type Pair } from "omnis_wasm";

const omnis_calls = await globalThis.loadModule("omnis_calls");

type MethodMap = { [name: string]: (param: any) => {} };

const methodMap: MethodMap = {
    greet: function () : { answer: string } {
        return { answer: greet() };
    },
    create_pair: function (param: any) : { pair: Pair } {
        return { pair: create_pair(param["one"], param["two"]) };
    },
    add_pair: function (param: any) : { pair: Pair } {
        return { pair: add_pair(param["left"], param["right"]) };
    },
};

// omnis_calls.omnisModuleDefaultExport returns an object suitable for your default export.
// You must pass it your methodMap object.
export default omnis_calls.omnisModuleDefaultExport(methodMap);