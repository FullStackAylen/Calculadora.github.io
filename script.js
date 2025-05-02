let botones = document.getElementsByClassName("btn");
let total = document.getElementById("total");
let anticipe = document.getElementById("anticipe");
let isActive = false;

for (const boton of botones) {
    boton.addEventListener("click", (event) => {
        const value = event.target.textContent;
        const operadores = ["+", "-", "x", "÷"];

        // Si es una función especial o un operador, mando a la función operar
        if (
            ["=", "⌫", "C", "CE", "+/-", "x²", "√x", "1/x", ",", "%"].includes(value) ||
            operadores.includes(value)
        ) {
            operar(value);
        } else {
            // Si el total está en 0 y todavía no escribo nada
            if (total.textContent === "0" && !isActive) {
                total.textContent = "";
            }

            // Evita doble operador seguido (por seguridad)
            const ultimo = total.textContent.slice(-1);
            if (operadores.includes(ultimo) && operadores.includes(value)) return;

            // Evita doble coma/punto decimal
            if (value === "," && total.textContent.includes(".")) return;

            // Reemplaza coma por punto para que funcione el decimal
            total.textContent += value === "," ? "." : value;
            isActive = true;
        }
    });
}

function operar(valor) {
    const operadores = ["+", "-", "x", "÷"];

    switch (valor) {
        case "CE":
            total.textContent = "0";
            isActive = false;
            break;

        case "C":
            total.textContent = "0";
            anticipe.textContent = "";
            isActive = false;
            break;

        case "⌫":
            total.textContent = total.textContent.length > 1
                ? total.textContent.slice(0, -1)
                : "0";
            if (total.textContent === "0") isActive = false;
            break;

        case "+/-":
            if (total.textContent !== "0") {
                total.textContent = String(parseFloat(total.textContent) * -1);
            }
            break;

        case "%":
            total.textContent = String(parseFloat(total.textContent) / 100);
            break;

        case "x²":
            total.textContent = String(Math.pow(parseFloat(total.textContent), 2));
            break;

        case "√x":
            const raiz = parseFloat(total.textContent);
            total.textContent = raiz < 0 ? "Error" : String(Math.sqrt(raiz));
            break;

        case "1/x":
            const valorInverso = parseFloat(total.textContent);
            total.textContent = valorInverso === 0 ? "Error" : String(1 / valorInverso);
            break;

        case "=":
            anticipe.textContent += total.textContent;
            let expression = anticipe.textContent
                .replace(/÷/g, "/")
                .replace(/x/g, "*");

            try {
                const resultado = eval(expression);
                total.textContent = resultado;
            } catch {
                total.textContent = "Error";
            }

            anticipe.textContent = "";
            isActive = false;
            break;

        default: 
            // Evita poner operador si ya hay uno al final de anticipe
            const ultimoAnticipe = anticipe.textContent.slice(-1);
            if (["+", "-", "*", "/"].includes(ultimoAnticipe)) return;

            anticipe.textContent += total.textContent + valor;
            total.textContent = "0";
            isActive = false;
            break;
    }
}
