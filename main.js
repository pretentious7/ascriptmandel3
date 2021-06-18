const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const ITER_CONST = 1000;
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL = -0.48857;
const WINDOW = 0.01;

const memory = new WebAssembly.Memory({
	initial: 50,
	maximum: 50
});
const importObj = {
	main: {
		sayHello() {
			console.log("Hello from WebAssembly!");
		},
		canvas_width: canvas.width,
		canvas_height: canvas.height,
		ITER_CONST,
		START_X_TOTAL,
		START_Y_TOTAL,
		WINDOW
	},
	env: {
		abort(_msg, _file, line, column) {
			console.error("abort called at main.ts:" + line + ":" + column);
		},
		memory: memory
	},
}
const startTime = performance.now();

function init_wasm(wasm_path) {
	// returns a promise that has webassembly result for the module that's
	// passed in.
	if(WebAssembly.instantiateStreaming) {
		return WebAssembly.instantiateStreaming(fetch(wasm_path), importObj)
	} else {
		return fetch(wasm_path).then(response =>
			response.arrayBuffer()
		).then(bytes =>
			WebAssembly.instantiate(bytes, importObj)
		).catch(console.error);
	}
}


return init_wasm("out/main.wasm").then(result => 
	//ctx.putImageData(draw(0), 1, 1);
	draw(0)
).catch(console.error);


function draw(arrayptr) {
	//takes in pointer, returns imageData
	const arr_start = arrayptr
	const arr_end = arr_start + WIDTH * HEIGHT
	const tempmem = new Uint8Array(memory.buffer)
	const imageArrayMemory = tempmem.slice(arr_start, arr_end);
	const arr = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
	imageArrayMemory.forEach(
		(val, i) => {
			if (val) {
				arr[4 * i + 0] = val; arr[4 * i + 1] = val; arr[4 * i + 2] = val; arr[4 * i + 3] = 255;
			}
		});

	let imageData = new ImageData(arr, WIDTH, HEIGHT);
	return imageData;
}
