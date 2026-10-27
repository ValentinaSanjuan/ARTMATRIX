import { ejecutarJava } from './index';
const env = (f:number,c:number)=>({filas:f,columnas:c});
const envolver=(cuerpo:string)=>`public class Galeria {\n    public static void main(String[] args) {\n${cuerpo}\n    }\n}`;
let fallos=0;
function caso(nombre:string, codigo:string, e:{filas:number,columnas:number}, esperado:(r:ReturnType<typeof ejecutarJava>)=>boolean){
  const r=ejecutarJava(codigo,e); const ok=esperado(r); if(!ok) fallos++;
  console.log((ok?'OK   ':'FALLA')+' '+nombre+(ok?'':' -> '+JSON.stringify(r).slice(0,300)));
}
const k=(p:{fila:number,columna:number}[])=>p.map(x=>x.fila+','+x.columna).sort().join(' ');
const sol=(f:number,c:number,cond:(i:number,j:number)=>boolean)=>{const a=[];for(let i=0;i<f;i++)for(let j=0;j<c;j++)if(cond(i,j))a.push({fila:i,columna:j});return a;};
caso('nivel3 fila 2', envolver(`int fila = 2;\nfor (int columna = 0; columna < matriz[0].length; columna++) {\n colocar(fila, columna);\n}`), env(5,6), r=>r.ok&&k(r.pasos)===k(sol(5,6,(i)=>i==2)));
caso('nivel3 pares', envolver(`int columna = 4;\nfor (int fila = 0; fila < matriz.length; fila++) {\n if (fila % 2 == 0) { colocar(fila, columna); }\n}`), env(5,6), r=>r.ok&&k(r.pasos)===k(sol(5,6,(i,j)=>i%2==0&&j==4)));
caso('nivel4 perimetro', envolver(`for (int fila = 0; fila < matriz.length; fila++) {\n for (int columna = 0; columna < matriz[0].length; columna++) {\n  if (fila == 0 || fila == matriz.length - 1 || columna == 0 || columna == matriz[0].length - 1) colocar(fila, columna);\n }\n}`), env(4,6), r=>r.ok&&k(r.pasos)===k(sol(4,6,(i,j)=>i==0||i==3||j==0||j==5)));
caso('nivel5 multiplos', envolver(`for (int fila = 0; fila < FILAS; fila += 2)\n for (int c = 0; c < COLUMNAS; c++) { if (c % 2 != 0) continue; colocar(fila, c); }`), env(5,6), r=>r.ok&&k(r.pasos)===k(sol(5,6,(i,j)=>i%2==0&&j%2==0)));
caso('println y concatenacion', envolver(`int x = 7 / 2;\nSystem.out.println("x = " + x);\nString s = "a"; s += 1;\nSystem.out.println(s);`), env(2,2), r=>r.ok&&r.salida.join('|')==='x = 3|a1');
caso('falta punto y coma', envolver(`int x = 3\ncolocar(0,0);`), env(2,2), r=>!r.ok&&r.error!.tipo==='SINTAXIS'&&r.error!.linea===3);
caso('variable no declarada', envolver(`colocar(y, 0);`), env(2,2), r=>!r.ok&&r.error!.tipo==='EJECUCION'&&/y/.test(r.error!.mensaje));
caso('fuera de rango', envolver(`for (int i = 0; i <= matriz.length; i++) colocar(i, 0);`), env(3,3), r=>!r.ok&&/ArrayIndexOutOfBounds/.test(r.error!.mensaje)&&r.pasos.length===3);
caso('ciclo infinito', envolver(`int i = 0;\nwhile (i < 5) { colocar(0,0); }`), env(3,3), r=>!r.ok);
caso('ciclo infinito sin colocar', envolver(`int i = 0;\nwhile (i < 5) { i = i; }`), env(3,3), r=>!r.ok&&/infinito/.test(r.error!.mensaje));
caso('sin clase', `for (int i=0;i<3;i++) colocar(i,i);`, env(3,3), r=>r.ok&&r.pasos.length===3);
caso('tipos incompatibles', envolver(`int x = "hola";`), env(2,2), r=>!r.ok&&/incompatibles/.test(r.error!.mensaje));
caso('llave sin cerrar', `public class G { public static void main(String[] a) { colocar(0,0); }`, env(2,2), r=>!r.ok&&r.error!.tipo==='SINTAXIS');
caso('lectura matriz', envolver(`if (matriz[0][1] != "V") System.out.println(matriz[0][1]); else System.out.println("vacia");`), {filas:2,columnas:2,contenido:[[null,'El grito'],[null,null]]} as any, r=>r.ok&&r.salida[0]==='El grito');
caso('redeclarar', envolver(`int fila = 0;\nfor (int fila = 0; fila < 2; fila++) {}`), env(2,2), r=>!r.ok&&/ya fue declarada/.test(r.error!.mensaje));
caso('while con break y ternario', envolver(`int i = 0;\nwhile (true) { colocar(i, i % 2 == 0 ? 0 : 1); i++; if (i >= 3) break; }`), env(3,2), r=>r.ok&&r.pasos.length===3&&r.pasos[1].columna===1);
caso('division entre cero', envolver(`int x = 5 / 0;`), env(2,2), r=>!r.ok&&/cero/.test(r.error!.mensaje));
caso('string equals', envolver(`String a = "x"; if (a.equals("x")) colocar(1,1);`), env(2,2), r=>r.ok&&r.pasos.length===1);
caso('decremento', envolver(`for (int c = COLUMNAS - 1; c >= 0; c--) colocar(0, c);`), env(2,3), r=>r.ok&&r.pasos.map(p=>p.columna).join()==='2,1,0');

// ---- Misiones nuevas (V4): se comprueba que tengan solución con el lenguaje del editor ----
const ord=(p:{fila:number,columna:number}[])=>p.map(x=>x.fila+','+x.columna).join(' ');
caso('v4 columnas impares', envolver(`int fila = 1;\nfor (int columna = 0; columna < matriz[0].length; columna++) {\n if (columna % 2 != 0) colocar(fila, columna);\n}`), env(5,6), r=>r.ok&&k(r.pasos)===k(sol(5,6,(i,j)=>i==1&&j%2==1)));
caso('v4 esquinas', envolver(`int uf = matriz.length - 1; int uc = matriz[0].length - 1;\nfor (int f = 0; f < matriz.length; f++) for (int c = 0; c < matriz[0].length; c++)\n if ((f == 0 || f == uf) && (c == 0 || c == uc)) colocar(f, c);`), env(5,7), r=>r.ok&&k(r.pasos)===k(sol(5,7,(i,j)=>(i==0||i==4)&&(j==0||j==6))));
caso('v4 interior', envolver(`for (int f = 1; f < matriz.length - 1; f++) for (int c = 1; c < matriz[0].length - 1; c++) colocar(f, c);`), env(5,6), r=>r.ok&&k(r.pasos)===k(sol(5,6,(i,j)=>i>0&&i<4&&j>0&&j<5)));
caso('v4 serpiente', envolver(`for (int f = 0; f < matriz.length; f++) {\n if (f % 2 == 0) { for (int c = 0; c < matriz[0].length; c++) colocar(f, c); }\n else { for (int c = matriz[0].length - 1; c >= 0; c--) colocar(f, c); }\n}`), env(4,5), r=>r.ok&&ord(r.pasos)==='0,0 0,1 0,2 0,3 0,4 1,4 1,3 1,2 1,1 1,0 2,0 2,1 2,2 2,3 2,4 3,4 3,3 3,2 3,1 3,0');
caso('v4 diagonales', envolver(`int n = matriz.length;\nfor (int f = 0; f < n; f++) for (int c = 0; c < n; c++) if (f == c || f + c == n - 1) colocar(f, c);`), env(5,5), r=>r.ok&&k(r.pasos)===k(sol(5,5,(i,j)=>i==j||i+j==4)));
caso('v4 ronda', envolver(`int uf = matriz.length - 1; int uc = matriz[0].length - 1;\nfor (int c = 0; c <= uc; c++) colocar(0, c);\nfor (int f = 1; f <= uf; f++) colocar(f, uc);\nfor (int c = uc - 1; c >= 0; c--) colocar(uf, c);\nfor (int f = uf - 1; f >= 1; f--) colocar(f, 0);`), env(4,5), r=>r.ok&&ord(r.pasos)==='0,0 0,1 0,2 0,3 0,4 1,4 2,4 3,4 3,3 3,2 3,1 3,0 2,0 1,0');
{
  const contenido=[[null,'A',null,null,null,null],[null,null,null,null,'B',null],[null,null,'C',null,null,null],['D',null,null,null,null,'E']];
  caso('v4 huecos', envolver(`for (int f = 0; f < matriz.length; f++) for (int c = 0; c < matriz[0].length; c++) if (matriz[f][c].equals("V")) colocar(f, c);`), {filas:4,columnas:6,contenido} as any,
    r=>r.ok&&k(r.pasos)===k(sol(4,6,(i,j)=>contenido[i][j]===null)));
}
console.log(fallos===0?'TODOS LOS CASOS PASARON':fallos+' FALLOS'); if (fallos) throw new Error(fallos + ' fallos');
