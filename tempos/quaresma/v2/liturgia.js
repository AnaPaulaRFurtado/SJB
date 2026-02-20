fetch("data/liturgiaAnoA.json")
  .then(res => res.json())
  .then(data => {

    const domingo = data["1domingo_quaresma"];

    document.getElementById("titulo-primeira").innerText =
      "1ª Leitura – " + domingo.primeiraLeitura.referencia;

    document.getElementById("texto-primeira").innerText =
      domingo.primeiraLeitura.texto;

    document.getElementById("titulo-salmo").innerText =
      "Salmo – " + domingo.salmo.referencia;

    document.getElementById("texto-salmo").innerText =
      domingo.salmo.texto;

    document.getElementById("titulo-segunda").innerText =
      "2ª Leitura – " + domingo.segundaLeitura.referencia;

    document.getElementById("texto-segunda").innerText =
      domingo.segundaLeitura.texto;

    document.getElementById("titulo-evangelho").innerText =
      "Evangelho – " + domingo.evangelho.referencia;

    document.getElementById("texto-evangelho").innerText =
      domingo.evangelho.texto;

  })
  .catch(err => console.error("Erro ao carregar liturgia:", err));
