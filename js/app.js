'use strict';

$(function () {
  var typeTime;
  var upTime;
  var startTime1; //Valor de referencia １

  var startTime2; //Valor de referencia ２

  var arrayTotalKey = []; //Matriz Multidimensional (Intervalo de Entrada)

  var arrayTotalDU = []; //Matriz Multidimensional (De abajo a arriba)

  var arrayAveKey1 = []; //Intervalo de entrada １

  var arrayAveKey2 = []; //Intervalo de entrada 2

  var arrayAveDU1 = []; //Hasta 1 arriba

  var arrayAveDU2 = []; //Hasta 2 arriba

  var arrayDiffKey = []; //Diferencia de Intervalo de entrada

  var arrayDiffDU = []; //Diferencia de abajo a arriba

  var arrayKeycode = []; //Valor de entrada

  $("#firstDataset input").focus(function () {
    var click = $(this).data("click"); //Agregar atributo de datos　

    if (!click) {
      //Ingresa una vez para cada entrada
      var arrayKey = []; //Intervalo de entrada（almacenamiento temporal）

      var arrayDownup = []; //De abajo hacia arriba（almacenamiento temporal）

      arrayTotalKey.push(arrayKey);
      arrayTotalDU.push(arrayDownup);
      arrayKey.length = 0;
      arrayDownup.length = 0;
      startTime1 = null; //Medición del intervalo de entrada

      $(this).on('keydown', function (event) {
        if (event.keyCode == 8) {
          $(this).val("");
          arrayKey.length = 0;
          arrayDownup.length = 0;
          startTime1 = null; //$(this).html("<small class="form-text text-muted">Por favor ingrese desde el principio.</small>");
        } else if (event.keyCode == 9) {//Que hacer si se presiona la tecla de tabulación
        } else if (startTime1 == null) {
          typeTime = new Date().getTime();
          startTime1 = typeTime; //Almacenar la primera pulsación de tecla milisegundos en variable startTime1

          arrayKey.push(0);
        } else if (arrayKey.length == 0) {
          typeTime = new Date().getTime();
          arrayKey.push(typeTime - startTime1); //Restar startTime1 de la segunda pulsación de tecla milisegundos

          console.log(arrayKey);
        } else {
          typeTime = new Date().getTime();
          arrayKey.push(typeTime - (startTime1 + arrayKey.reduce(function (a, x) {
            return a += x;
          }, 0))); //Después de la tercera vez, reste startTime1 + key y key milisegundos de los milisegundos de pulsación de tecla.

          console.log(arrayKey);
        }
      }); //Medir de abajo hacia arriba

      $(this).on('keyup', function (event) {
        if (event.keyCode == 8) {
          arrayDownup.length = 0;
        } else if (event.keyCode == 9) {//Qué hacer si se presiona la tecla de tabulación
        } else {
          upTime = new Date().getTime();
          var diff = upTime - typeTime;
          arrayDownup.push(diff);
          console.log(arrayDownup);
        }
      });
      $(this).data("click", true);
    }
  }); //Función para el cálculo del valor medio y la verificación de la diferencia del valor de entrada

  function averageCalc(array, num, arrayResult) {
    var arrayMaxmin = []; //Valor máximo, matriz de validación de valor mínimo

    for (var i = 0; i < array[0].length; i++) {
      //Pasar por el número de caracteres de entrada
      var total = 0;
      arrayMaxmin.length = 0;

      for (var arr = 0; arr < array.length; arr++) {
        //Gire tantas veces como escriba (número de entradas)
        arrayMaxmin.push(array[arr][i]);
        total += array[arr][i]; //Array [número de matriz] [número de índice]
      }

      var minData = Math.min.apply(null, arrayMaxmin); //Escrutinio del valor mínimo

      var maxData = Math.max.apply(null, arrayMaxmin); //Examen de valor máximo

      var diff = maxData - minData;

      if (diff > num) {
        alert("El tiempo del valor de entrada está alterado. Por favor ingrese nuevamente.");
        throw new Error('end');
      }

      arrayResult.push(Math.round(total / array.length));
    }
  } //verificación del primer conjunto de datos (cálculo del valor medio)


  document.getElementById("insert").addEventListener('click', function () {
    try {
      arrayAveKey1.length = 0; //Inicialización de matriz

      var baseValue = $("#firstDataset input").eq(0).val(); //Obtiene el primer valor del elemento

      $("#firstDataset input").each(function (i) {
        var value = $(this).val();

        if (0 == value) {
          alert("El contenido de entrada es nulo");
          throw new Error('end');
        } else if (baseValue !== value) {
          alert("El contenido de entrada no coincide");
          throw new Error('end');
        }
      }); //Cálculo del valor medio

      averageCalc(arrayTotalKey, 200, arrayAveKey1); //Permita 0,2 segundos o más de diferencia en el intervalo de entrada

      averageCalc(arrayTotalDU, 200, arrayAveDU1); //Permitir una diferencia de 0,2 segundos o más desde la tecla hacia abajo hacia arriba

      $("#firstDataset input,addDataset,#insert").prop("disabled", true);
      $("#secondDataset input,#compare").prop("disabled", false);
    } catch (e) {
      console.log(e.message);
    }
  });
  /*---------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------*/

  var secondData = document.getElementById("secondData"); //Medición del intervalo de entrada

  secondData.addEventListener('keydown', function (event) {
    if (event.keyCode == 8) {
      $("#secondData").val("");
      arrayAveKey2.length = 0;
      startTime2 = null;
      arrayKeycode.length = 0; //Inicialización de matriz para la generación de gráficos
      //var caution = document.getElementById("caution2");
      //caution.innerHTML = "Por favor ingrese el tempo hasta el final.";
    } else if (event.keyCode == 9) {//Qué hacer si se presiona la tecla de tabulación
    } else if (startTime2 == null) {
      typeTime = new Date().getTime();
      startTime2 = typeTime;
    } else if (arrayAveKey2.length == 0) {
      typeTime = new Date().getTime();
      arrayAveKey2.push(0);
      arrayAveKey2.push(typeTime - startTime2);
      console.log(arrayAveKey2);
    } else {
      typeTime = new Date().getTime();
      arrayAveKey2.push(typeTime - (startTime2 + arrayAveKey2.reduce(function (a, x) {
        return a += x;
      }, 0)));
      console.log(arrayAveKey2);
    }
  }); //Medida de abajo a arriba

  secondData.addEventListener('keyup', function (event) {
    if (event.keyCode == 8) {
      arrayAveDU2.length = 0;
    } else if (event.keyCode == 9) {//Qué hacer si se presiona la tecla de tabulación
    } else {
      upTime = new Date().getTime();
      var diff = upTime - typeTime;
      arrayAveDU2.push(diff);
      arrayKeycode.push(String.fromCharCode(event.keyCode)); //Almacenamiento de códigos clave para la generación de gráficos
    }
  }); //Función de cálculo de diferencia

  function diffCalc(arrayDiff, arrayData1, arrayData2) {
    arrayDiff.length = 0;
    var diff;

    for (var i = 0; i < arrayData1.length; i++) {
      if (arrayData1[i] > arrayData2[i]) {
        diff = arrayData1[i] - arrayData2[i];
        arrayDiff.push(diff);
      } else {
        diff = arrayData2[i] - arrayData1[i];
        arrayDiff.push(diff);
      }
    }
  } //Función de cálculo de resultado


  function resultCalc(arrayDiff) {
    var total = 0;

    for (var i = 0; i < arrayDiff.length; i++) {
      total += 100 - arrayDiff[i]; //Valor de referencia 100
    }

    return Math.round(total / arrayAveKey2.length);
  } //Función de generación de gráficos


  function chart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: arrayKeycode,
        datasets: [{
          label: 'First dataset Key',
          data: arrayAveKey1,
          backgroundColor: "rgba(0,123,256,0.4)"
        }, {
          label: 'Second data Key',
          data: arrayAveKey2,
          backgroundColor: "rgba(0,123,256,0.4)"
        }, {
          label: 'First dataset Down Up',
          data: arrayAveDU1,
          backgroundColor: "rgba(145,219,185,0.4)"
        }, {
          label: 'Second data Down Up',
          data: arrayAveDU2,
          backgroundColor: "rgba(145,219,185,0.4)" // }, {
          //   label: 'Key Diff',
          //   data: arrayDiffKey,
          //   backgroundColor: "rgba(204,204,204,0.4)"
          // }, {
          //   label: 'Down Up Diff',
          //   data: arrayDiffDU,
          //   backgroundColor: "rgba(204,204,204,0.4)"
          // }

        }]
      }
    });
  } //Procesamiento final


  document.getElementById("compare").addEventListener('click', function () {
    if (!document.getElementById('firstData').value) {
      alert("Input content is null");
    } else if ($('#firstData').val() != $('#secondData').val()) {
      alert("Input content is not match");
    } else {
      diffCalc(arrayDiffKey, arrayAveKey1, arrayAveKey2);
      diffCalc(arrayDiffDU, arrayAveDU1, arrayAveDU2);
      var resultKey = resultCalc(arrayDiffKey);
      var resultDU = resultCalc(arrayDiffDU);
      var result = (resultKey + resultDU) / 2;
      document.getElementById('result').innerHTML = result + "%";
      chart();
    }
  }); //Proceso de adición de conjuntos de datos

  /*
  {
    var i = 4;
     document.getElementById("addDataset").onclick = function () {
      var div_element = document.createElement("div");
      div_element.setAttribute('class', 'col-md-4 mb-3');
      div_element.innerHTML = '<label>data' + i + '</label><input type="text" name="password" id="dataset' + i + '"class="form-control test" placeholder="Enter something" required><small id="caution4" class="form-text text-muted"></small>';
      var parent_object = document.getElementById("addDatasetArea");
      parent_object.appendChild(div_element);
      i++;
    };
  }
  */
});