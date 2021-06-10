const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;


WebAssembly.instantiateStreaming(fetch("../out/main.wasm"), {
  main: {
    sayHello() {
      console.log("Hello from WebAssembly!");
    },
    canvas_width: canvas.width,
    canvas_height: canvas.height
  },
  env: {
    abort(_msg, _file, line, column) {
      console.error("abort called at main.ts:" + line + ":" + column);
    }
  },
}).then(result => {
  const exports = result.instance.exports;
  //document.getElementById("container").textContent = "Result: " + exports.add(19, 23);
}).catch(console.error);
