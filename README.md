# Web Assembly (WASM) for Omnis Studio Javascript Worker

A template for building Rust code as WASM, and then importing it into a type-safe, Omnis-compatible JS Worker package

## Usage

### Initialize Rust environment

Ensure that Rust (and Cargo) are installed by using [RustUp](https://rustup.rs/)

Install `wasm-pack` for cleaner build commands

```bash
cargo install wasm-pack
```

### Compile Rust to WASM with `wasm-pack build`

[wasm-pack](https://rustwasm.github.io/wasm-pack/) can be used to compile the Rust code into web assembly (.wasm)

```bash
wasm-pack build --release
```

### Test WASM in Node (roughly equivalent to Omnis environment)

All tests can be run under the [wasm-pack test environment](https://rustwasm.github.io/wasm-pack/book/tutorials/npm-browser-packages/testing-your-project.html)

```bash
wasm-pack test --node
```

### Initialize Node environment

Install all node dependencies to allow for building

```bash
npm install
```

### Build the combined Rust WASM package and JS Worker Module

```bash
npm run build 
```

### Install the JS Worker Module

1. Locate the `$OMNIS_HOME`, usually in the user directory.
2. Copy the `dist/omnis_wasm` into `$OMNIS_HOME/jsworker/omnis_wasm`
3. Edit `$OMNIS_HOME/jsworker/omnis_modules.mjs` to add `omnis_wasm: await autoLoadModule('omnis_wasm')` to the `moduleMap` import array.

Example `omnis_modules.mjs` after edit (note the `omnis_wasm` entry)

```javascript
/* $Header$ */
// Contains the Omnis JavaScript worker module map
// Copyright (C) OLS Holdings Ltd 2018

// ...

import { createRequire } from 'node:module'; // jmg1372
const require = createRequire(import.meta.url); // jmg1372


// Map of modules that can be called
// Each member of the object is a module name that can be used as the module parameter to $callmethod
let moduleMap = {
   test: await autoLoadModule('omnis_test'),
   omnis_wasm: await autoLoadModule('omnis_wasm'),
  //  another: await autoLoadModule('another') // Use autoLoadModule() to try loading any module format, anywhere on the module search path
};


// caa2100b start
async function autoLoadModule(moduleName) {
    
	try {
		const imported = await globalThis.loadModule(moduleName); // jmg1372
		return imported.default ? imported.default : imported; // jmg1372
	}
	catch (err) { return err; }
  
  
}
// caa2100b end

const omnis_modules = {
  call: async function (module, method, param, response) { // jmg1372
    if (!moduleMap[module]) moduleMap[module] = await autoLoadModule(module); // caa2100b // jmg1372
    // caa2100a start
    if (moduleMap[module] instanceof Error)
      throw new Error(
        `Error importing module ${module}:\n${moduleMap[module].message}`
      );
    else return moduleMap[module].call(method, param, response);
    // caa2100a end
  },
};

export default omnis_modules;
```