
declare const canvas_width: i32;
declare const canvas_height: i32;

let __tempr: f64 = 0;
let __tempi: f64 = 0;

@unmanaged
class Complex {
	real: f64 = 0;
	imag: f64 = 0;

	constructor(real:f64, imag:f64){
		this.real = real;
		this.imag = imag;
    }
	add(cplx: Complex): Complex {
    this.real = this.real + cplx.real;
    this.imag = this.imag + cplx.imag;
    return this;
		//return new Complex(this.real + cplx.real, this.imag + cplx.imag);
	}

	mag(): f64 {
		//return Math.hypot(this.real,this.imag);
		return Math.sqrt(this.real * this.real + this.imag * this.imag)
	}

	mul(cplx: Complex): Complex {
		// (a + ib)*(c + id) = (ac - bd) + i(bc + ad)
		__tempr  = this.real*cplx.real - this.imag*cplx.imag;
    __tempi = this.imag*cplx.real + this.real*cplx.imag;
    this.real = __tempr;
    this.imag = __tempi;
    return this;
		//return new Complex(real_part, imag_part);
	}

  set(real:f64,imag:f64): void {
    this.real = real;
    this.imag = imag;
  }

}


const X_LEN:i32 = canvas_width;
const Y_LEN:i32 = canvas_height;

let z:Complex = new Complex(0,0);
let cplx:Complex = new Complex(0,0)

function mandelbrot(real:f64,imag:f64):i8{
  //let z: Complex = new Complex(0,0);
  //let cplx: Complex = new Complex(real, imag);
  let in_set: i8 = 0;
  const ITER_CONST = 100;


  z.set(0,0)
  cplx.set(real,imag)
  
  in_set = 0;
  for (let count = 0; z.mag() <= 2; count++) {
    z = (z.mul(z)).add(cplx); // z = z^2 + cplx
    if (count > ITER_CONST) {
      in_set = 1;
      break;
    }
  }
  return in_set;
}


const step_X = 4.0/X_LEN;
const step_Y = 4.0/Y_LEN;
for (let x = -2.0, count_x = 0; count_x < X_LEN; x += step_X, count_x++){
  for (let y = -2.0, count_y = 0; count_y < Y_LEN; y += step_Y, count_y++){
    store<i8>(count_x*Y_LEN + count_y, mandelbrot(x,y));
  }
}



