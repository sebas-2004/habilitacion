const prompt = require('prompt-sync')({ sigint: true });


class Inmueble {
    constructor(id, tipo, valor) {              
        this.id = id; 
        this.tipo = tipo; 
        this.valor = valor; 
        this.vendido = false;                   
        this.alquilado = false;
    }
   
    mostrarInfo() {
        return `ID: ${this.id}, Tipo: ${this.tipo}, Valor: ${this.valor}`;
    }
}

                
class Venta extends Inmueble {                            
    constructor(id, valor) {                               
        super(id, 'venta', valor); 
    }                                                       
                                                           
            
    calcularComision() {                                   
        return this.valor * 0.1;                           
    }

   
    calcularComisionAsesor() {
        return this.calcularComision() * 0.03;
    }
}


class Alquiler extends Inmueble {
    constructor(id, valor, meses, porcentajeComision, mes) {
        super(id, 'alquiler', valor);
        this.meses = meses;
        this.porcentajeComision = porcentajeComision;
        this.mes = mes;
    }

    
    calcularComision() {
        return this.valor * (this.porcentajeComision / 100) * this.meses;
    }
}


class Inmobiliaria {
    constructor() {
        this.inmuebles = [];
        this.ventas = [];
        this.alquileres = [];
    }

    
    registrarInmueble(inmueble) {
        this.inmuebles.push(inmueble);
    }

    venderInmueble(id) {
        const inmueble = this.inmuebles.find(inm => inm.id === id && inm.tipo === 'venta' && !inm.vendido);
        if (inmueble) {
            this.ventas.push(inmueble);
            inmueble.vendido = true;
            return true;
        }
        return false;
    }

    
    alquilarInmueble(id, meses, porcentajeComision, mes) {
        const inmueble = this.inmuebles.find(inm => inm.id === id && inm.tipo === 'alquiler' && !inm.alquilado);
        if (inmueble) {
            const alquiler = new Alquiler(id, inmueble.valor, meses, porcentajeComision, mes);
            this.alquileres.push(alquiler);
            inmueble.alquilado = true;
            return true;
        }
        return false;
    }

    
    calcularGanancias() {
        const gananciasVentas = this.ventas.reduce((acc, venta) => acc + venta.calcularComision(), 0);
        const gananciasAlquileres = this.alquileres.reduce((acc, alquiler) => acc + alquiler.calcularComision(), 0);
        return { gananciasVentas, gananciasAlquileres };
    }

    
    compararGanancias() {
        const { gananciasVentas, gananciasAlquileres } = this.calcularGanancias();
        return gananciasVentas > gananciasAlquileres ? 
               `ventas con ${gananciasVentas}` : 
               `alquileres con ${gananciasAlquileres}`;
    }

    
    mesConMasGananciasAlquiler() {
        const gananciasPorMes = {};
        this.alquileres.forEach(alquiler => {
            const ganancia = alquiler.calcularComision();
            if (gananciasPorMes[alquiler.mes]) {
                gananciasPorMes[alquiler.mes] += ganancia;
            } else {
                gananciasPorMes[alquiler.mes] = ganancia;
            }
        });
        const mesMax = Object.keys(gananciasPorMes).reduce((a, b) => gananciasPorMes[a] > gananciasPorMes[b] ? a : b);
        return { mes: mesMax, ganancia: gananciasPorMes[mesMax] };
    }

   
    totalComisionesVenta() {
        const totalVentas = this.ventas.reduce((acc, venta) => acc + venta.valor, 0);
        return totalVentas * 0.1 * 0.03;
    }
}
class nodoInmueble  {
    constructor(Inmueble){
        this.valor = Inmueble;
        this.siguiente = null;
      
    }
}
class listaInmueble {
    constructor(){
        this.cabeza = null;
    } 
    insertar(Inmueble){
        const nuevonodo = new nodoEmpleado(Inmueble);
        if(this.cabeza === null){
            this.cabeza = nuevonodo;
        } else {
            let nodotmp = this.cabeza;
            while (nodotmp.siguiente !== null){
                nodotmp = nodotmp.siguiente;
            }
            nodotmp.siguiente = nuevonodo;
            }
        
    }

}


function main() {
    const inmobiliaria = new Inmobiliaria();
    
    let continuar = true;

    while (continuar) {
        console.log("\n--- Menú de opciones ---");
        console.log("1. Registrar inmueble");
        console.log("2. Vender inmueble");
        console.log("3. Alquilar inmueble");
        console.log("4. Calcular ganancias");
        console.log("5. Comparar ganancias");
        console.log("6. Mes con más ganancias por alquiler");
        console.log("7. Total comisiones por ventas");
        console.log("8. Salir");

        const opcion = prompt("Seleccione una opción: ");

        switch (opcion) {
            case '1':
                const id = parseInt(prompt("Ingrese el ID del inmueble: "));
                const tipo = prompt("Ingrese el tipo (venta/alquiler): ").toLowerCase();
                const valor = parseFloat(prompt("Ingrese el valor del inmueble: "));
                if (tipo === 'venta') {
                    inmobiliaria.registrarInmueble(new Venta(id, valor));
                } else if (tipo === 'alquiler') {
                    inmobiliaria.registrarInmueble(new Inmueble(id, tipo, valor));
                } else {
                    console.log("Tipo de inmueble no válido.");
                }
                break;
            case '2':
                const idVenta = parseInt(prompt("Ingrese el ID del inmueble a vender: "));
                if (inmobiliaria.venderInmueble(idVenta)) {
                    console.log("Inmueble vendido exitosamente.");
                } else {
                    console.log("No se pudo vender el inmueble. Verifique el ID y el tipo de inmueble.");
                }
                break;
            case '3':
                const idAlquiler = parseInt(prompt("Ingrese el ID del inmueble a alquilar: "));
                const meses = parseInt(prompt("Ingrese el número de meses de alquiler: "));
                const porcentajeComision = parseFloat(prompt("Ingrese el porcentaje de comisión: "));
                const mes = prompt("Ingrese el mes del alquiler: ");
                if (inmobiliaria.alquilarInmueble(idAlquiler, meses, porcentajeComision, mes)) {
                    console.log("Inmueble alquilado exitosamente.");
                } else {
                    console.log("No se pudo alquilar el inmueble. Verifique el ID y el tipo de inmueble.");
                }
                break;
            case '4':
                const { gananciasVentas, gananciasAlquileres } = inmobiliaria.calcularGanancias();
                console.log(`Ganancias por ventas: ${gananciasVentas}`);
                console.log(`Ganancias por alquileres: ${gananciasAlquileres}`);
                break;
            case '5':
                const tipoMayorGanancia = inmobiliaria.compararGanancias();
                console.log(`Se ha ganado más dinero por ${tipoMayorGanancia}`);
                break;
            case '6':
                const { Mes, ganancia } = inmobiliaria.mesConMasGananciasAlquiler();
                console.log(`El mes con más ganancias por alquiler fue ${mes} con ${ganancia}`);
                break;
            case '7':
                const comisionesVenta = inmobiliaria.totalComisionesVenta();
                console.log(`Total de comisiones por ventas: ${comisionesVenta}`);
                break;
            case '8':
                continuar = false;
                break;
            default:
                console.log("Opción no válida.");
                break;
        }
    }
}

main();
