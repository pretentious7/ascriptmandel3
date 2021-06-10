start:
	npx asc assembly/main.ts -b out/main.wasm -t out/main.wat -O3s  --maximumMemory 50 --importMemory --noExportMemory  --initialMemory 20 --memoryBase 1000000 --runtime stub