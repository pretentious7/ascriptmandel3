const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const memory = new WebAssembly.Memory({
  initial: 20,
  maximum: 50
});
const importObj = {
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
    },
    memory: memory
  },
}
const startTime = performance.now();
if(WebAssembly.instantiateStreaming) {
WebAssembly.instantiateStreaming(fetch("out/main.wasm"), importObj).then(result => {
    document.getElementById('timing-val').innerText = performance.now()-startTime;

  //const exports = result.instance.exports;
  //exports.run();
  //document.getElementById("container").textContent = "Result: " + exports.add(19, 23);
  draw(0)
}).catch(console.error);
}
else{
fetch('out/main.wasm').then(response =>
  response.arrayBuffer()
).then(bytes =>
  WebAssembly.instantiate(bytes, importObj)
).then(result => {
 document.getElementById('timing-val').innerText = performance.now()-startTime;

  //result.instance.exports.exported_func()
  draw(0)
}).catch(console.error);
}



function draw(arrayptr) {
    const arr_start = arrayptr
    console.log(arrayptr)
    const arr_end = arr_start + WIDTH * HEIGHT
    const tempmem = new Uint8Array(memory.buffer)
    console.log(tempmem)
    const imageArrayMemory = tempmem.slice(arr_start, arr_end);
    const arr = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
    console.log(imageArrayMemory);
    arr.fill(0);
    imageArrayMemory.forEach(
        (val, i) => {
            if (val) {
                arr[4 * i + 0] = 0; arr[4 * i + 1] = 0; arr[4 * i + 2] = 0; arr[4 * i + 3] = 255;
            }
        });

    let imageData = new ImageData(arr, WIDTH, HEIGHT);
    console.log(imageData);
    //ctx.putImageData(imageData,100,100);
    ctx.putImageData(imageData, 1, 1);
}