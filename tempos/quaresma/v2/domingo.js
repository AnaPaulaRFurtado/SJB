// =============================
// FORMATAR CIFRA
// =============================
function formatarCifraComAcordes(cifra) {
  const linhas = cifra.split("\n");
  let resultado = "";
  let i = 0;

  const regexAcordeLinha = /^[A-G][#b]?(m|maj|sus|dim|aug)?[0-9°]*(\([0-9]+\))?(\/[A-G][#b]?)?$/;
  const regexAcordeGlobal = /([A-G][#b]?[^\s]*)/g;

  while (i < linhas.length) {
    const linhaAtual = linhas[i];
    const l = linhaAtual.trim();

    if (l === "") {
      resultado += "\n";
      i++;
      continue;
    }

    const palavras = l.split(/\s+/);
    const acordesValidos = palavras.filter(p => regexAcordeLinha.test(p));

    const todosSaoAcordes =
      acordesValidos.length > 0 &&
      acordesValidos.length >= palavras.length * 0.6;


    if (todosSaoAcordes) {
      const acordesFormatados = linhaAtual.replace(
        regexAcordeGlobal,
        '<span class="chord">$1</span>'
      );

      resultado += acordesFormatados + "\n";

      if (i + 1 < linhas.length) {
        const proxima = linhas[i + 1].trim();
        const proxPalavras = proxima.split(/\s+/);

        const proximaEhAcorde = proxPalavras.every(p =>
          regexAcordeLinha.test(p)
        );

        if (!proximaEhAcorde) {
          resultado += linhas[i + 1] + "\n";
          i += 2;
          continue;
        }
      }

      i++;
    } else {
      resultado += linhaAtual + "\n";
      i++;
    }
  }

  return resultado;
}

function formatarLetra(texto) {
  const linhas = texto.split("\n");
  let html = "";
  let blocoAtual = "";

  linhas.forEach(linha => {
    let l = linha.trim().toLowerCase();

    if (l.includes("{refrao}")) {
      blocoAtual = "refrao";
      return;
    }
    if (l.includes("{/refrao}")) {
      blocoAtual = "";
      return;
    }

    if (l === "") {
      html += `<div class="espaco"></div>`;
      return;
    }

    html += `<p class="${blocoAtual}">${linha}</p>`;
  });

  return html;
}

const notas = [
  "C", "C#", "D", "D#", "E",
  "F", "F#", "G", "G#", "A",
  "A#", "B"
];

function normalizarNota(nota) {
  const equivalencias = {
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#"
  };
  return equivalencias[nota] || nota;
}

function transporAcorde(acorde, semitons) {
  const regex = /^([A-G])(#|b)?(.*)$/;
  const match = acorde.match(regex);

  if (!match) return acorde;

  let [, notaBase, acidente, sufixo] = match;
  let notaCompleta = normalizarNota(notaBase + (acidente || ""));

  let index = notas.indexOf(notaCompleta);
  if (index === -1) return acorde;

  let novoIndex = (index + semitons + 12) % 12;
  let novaNota = notas[novoIndex];

  return novaNota + sufixo;
}

function inicializarTransposicao(card, tomOriginal) {

  card.dataset.transposicao = 0;
  card.dataset.tomOriginal = tomOriginal;

  card.querySelectorAll(".chord").forEach(el => {
    el.dataset.original = el.textContent;
  });

  atualizarLabelTom(card);
}

function alterarTom(card, direcao) {

  let atual = parseInt(card.dataset.transposicao);
  atual += direcao;
  card.dataset.transposicao = atual;

  card.querySelectorAll(".chord").forEach(el => {
    const original = el.dataset.original;
    el.textContent = transporAcorde(original, atual);
  });

  atualizarLabelTom(card);
}

function atualizarLabelTom(card) {

  const tomOriginal = card.dataset.tomOriginal;
  const transposicao = parseInt(card.dataset.transposicao);

  const tomAtual = transporAcorde(tomOriginal, transposicao);

  const label = card.querySelector(".tom-atual");
  if (label) {
    label.textContent = `Tom: ${tomAtual}`;
  }
}
//IMPRIMIR//
function imprimirCard(card) {

  const conteudo = card.innerHTML;


  const janela = window.open('', '', 'width=800,height=600');

  janela.document.write(`
    <html>
      <head>
        <title>Impressão</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .transposicao,
          .links,
          .audio-container {
            display: none;
          }
          pre {
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
          }
          .chord {
            color: #000;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${conteudo}
      </body>
    </html>
  `);

  janela.document.close();
  janela.print();
}


// =============================
// CARREGAMENTO
// =============================

Promise.all([
  fetch("data/domingo.json").then(r => r.json()),
  fetch("data/musicas.json").then(r => r.json()),
  fetch("data/fixas.json").then(r => r.json())
])
  .then(([domingo, musicas, fixas]) => {

    const todasMusicas = [...musicas, ...fixas];
    const tituloDomingoEl = document.getElementById("titulo-domingo");
    const antifonaEl = document.getElementById("antifona");
    antifonaEl.classList.add("hidden");
    const menuEl = document.getElementById("menu-partes");
    const listaCantosEl = document.getElementById("lista-cantos");
    const tituloParteEl = document.getElementById("titulo-parte");
    const btnVoltar = document.getElementById("btn-voltar");
    const btnVoltarTopo = document.getElementById("btn-voltar-topo");

    tituloDomingoEl.textContent = domingo.titulo;
    antifonaEl.classList.add("hidden");
    antifonaEl.innerHTML = "";

    btnVoltarTopo.addEventListener("click", function (e) {
      e.preventDefault();

      if (!menuEl.classList.contains("hidden")) {
        window.location.href = "index.html";
      } else {
        listaCantosEl.innerHTML = "";
        tituloParteEl.classList.add("hidden");
        menuEl.classList.remove("hidden");
        antifonaEl.classList.add("hidden");
      }
    });

    domingo.partes.forEach(parte => {
      const btn = document.createElement("button");
      btn.className = "menu-item";
      btn.textContent = parte.nome;

      btn.onclick = () => {
        if (parte.partes) {
          mostrarSubPartes(parte);
        } else {
          mostrarCantos(parte.musicas, parte.nome);
        }
      };

      menuEl.appendChild(btn);
    });

    function mostrarCantos(idsMusicas, nomeParte) {
      const parteAtual = domingo.partes.find(p => p.nome === nomeParte);

      menuEl.classList.add("hidden");
      menuEl.classList.add("hidden");
      tituloParteEl.classList.remove("hidden");
      listaCantosEl.innerHTML = "";

      if (nomeParte === "Liturgia da Palavra") {
        tituloParteEl.textContent = "Liturgia da Palavra";
        renderizarLeituras();
        return;
      }

      tituloParteEl.textContent = `Cantos de ${nomeParte}`;


      listaCantosEl.innerHTML = "";

      function renderizarLeituras() {

        fetch("data/domingo.json")
          .then(res => res.json())
          .then(data => {

            const domingo = data;

            listaCantosEl.innerHTML = "";

            const leituras = [
              { titulo: "Primeira Leitura", dados: domingo.primeiraLeitura },
              { titulo: "Salmo Responsorial", dados: domingo.salmo },
              { titulo: "Segunda Leitura", dados: domingo.segundaLeitura },
              { titulo: "Evangelho", dados: domingo.evangelho }
            ];

            leituras.forEach(item => {

              const card = document.createElement("div");
              card.className = "card";

              const textoId = `texto-${item.titulo.replace(/\s/g, "")}`;

              card.innerHTML = `
          <h3>${item.titulo} – ${item.dados.referencia}</h3>

          <div class="links especial">
            <button class="toggleLetra btn-mostrar">Mostrar</button>
          </div>

          <div id="${textoId}" class="letra hidden">
            <p>${item.dados.texto.replace(/\n/g, "<br>")}</p>
          </div>
        `;

              card.querySelector(".btn-mostrar").onclick = () => {
                const textoEl = card.querySelector(`#${textoId}`);
                textoEl.classList.toggle("hidden");
              };

              listaCantosEl.appendChild(card);
            });

          })
          .catch(err => console.error("Erro ao carregar liturgia:", err));
      }


      // Mostrar antífona apenas em Entrada e Comunhão
      if (domingo.antifonas) {

        if (nomeParte === "Entrada" && domingo.antifonas.entrada) {
          antifonaEl.innerHTML = `
      <strong>Antífona de Entrada:</strong><br>
      ${domingo.antifonas.entrada}
    `;
          antifonaEl.classList.remove("hidden");
        }

        else if (nomeParte === "Comunhão" && domingo.antifonas.comunhao) {
          antifonaEl.innerHTML = `
      <strong>Antífona de Comunhão:</strong><br>
      ${domingo.antifonas.comunhao}
    `;
          antifonaEl.classList.remove("hidden");
        }

        else {
          antifonaEl.classList.add("hidden");
        }

      }

      idsMusicas.forEach(id => {

        const musica = todasMusicas.find(m => m.id === id);
        if (!musica) return;

        // Montar letra final (juntar estrofe se existir)
        let letraFinal = musica.letra || "";

        if (parteAtual && parteAtual.estrofe) {
          letraFinal += "\n\n" + parteAtual.estrofe;
        }

        const card = document.createElement("div");
        card.className = "card";

        const audioId = `audio-${musica.id}`;
        const cifraId = `cifra-${musica.id}`;
        const letraId = `letra-${musica.id}`;

        let audioHTML = `<p style="font-size:14px;color:#777;">Áudio não disponível</p>`;
        if (musica.audio) {
          audioHTML = `
    <audio controls>
      <source src="${musica.audio}" type="audio/mpeg">
      Seu navegador não suporta áudio.
    </audio>
  `;
        } else if (musica.youtubeId) {
          audioHTML = `
          <iframe height="180"
            src="https://www.youtube.com/embed/${musica.youtubeId}"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>`;
        }

        card.innerHTML = `
  <h3>${musica.titulo}</h3>

  ${musica.observacao ? `<div class="observacao">${musica.observacao}</div>` : ""}
        <div class="links especial">
          <button class="toggleLetra btn-ouvir">Ouvir</button>
          <button class="toggleLetra btn-cifra">Cifra</button>
          <button class="toggleLetra btn-letra">Letra</button>
          <button class="btn-repertorio">+ Repertório</button>
        </div>
        <div class="msg-repertorio hidden"></div>

        <div id="${audioId}" class="audio-container hidden">
          ${audioHTML}
        </div>

        <div id="${cifraId}" class="cifra hidden">
          <div class="transposicao">
            <button class="btn-menos">−</button>
            <span class="tom-atual">Tom: --</span>
            <button class="btn-mais">+</button>
            <button class="btn-fixar" title="Salvar Tom Favorito">⭐</button>
            <button class="btn-imprimir" title="Imprimir">🖨️</button>
          </div>
          
        <pre>${formatarCifraComAcordes(musica.cifra || "")}</pre>
        </div>

        <div id="${letraId}" class="letra hidden">
          ${formatarLetra(letraFinal)}
        </div>
      `;

        card.querySelector(".btn-ouvir").onclick = () => {
          toggleExclusive(card, audioId);
        };

        card.querySelector(".btn-cifra").onclick = () => {
          toggleExclusive(card, cifraId);
        };

        card.querySelector(".btn-letra").onclick = () => {
          toggleExclusive(card, letraId);
        };

        inicializarTransposicao(card, musica.tom);

        card.querySelector(".btn-menos").onclick = () => {
          alterarTom(card, -1);
        };

        card.querySelector(".btn-mais").onclick = () => {
          alterarTom(card, 1);
        };

        card.querySelector(".btn-imprimir").onclick = () => {

          document.querySelectorAll(".card").forEach(c => {
            c.classList.remove("printable");
          });

          card.classList.add("printable");

          window.print();

          setTimeout(() => {
            card.classList.remove("printable");
          }, 500);

        };

        let repertorio = JSON.parse(localStorage.getItem("repertorio")) || [];

        const btnRep = card.querySelector(".btn-repertorio");
        const btnFixar = card.querySelector(".btn-fixar");
        const msg = card.querySelector(".msg-repertorio");

        // Verificar se já está salvo
        const itemSalvo = repertorio.find(item => item.id === musica.id);

        if (itemSalvo) {

          btnRep.classList.add("salvo");
          btnRep.textContent = "✓ No Repertório";
          btnFixar.classList.add("salvo");

          const transposicaoSalva = itemSalvo.transposicao || 0;

          card.dataset.transposicao = transposicaoSalva;

          card.querySelectorAll(".chord").forEach(el => {
            const original = el.dataset.original;
            el.textContent = transporAcorde(original, transposicaoSalva);
          });

          atualizarLabelTom(card);
        }

        // BOTÃO REPERTÓRIO (toggle simples)
        btnRep.onclick = () => {

          const jaExiste = repertorio.find(item => item.id === musica.id);

          if (jaExiste) {

            repertorio = repertorio.filter(item => item.id !== musica.id);
            localStorage.setItem("repertorio", JSON.stringify(repertorio));

            btnRep.classList.remove("salvo");
            btnRep.textContent = "+ Repertório";
            btnFixar.classList.remove("salvo");

            msg.textContent = "Removido do repertório";

          } else {

            const transposicaoAtual = parseInt(card.dataset.transposicao);
            const tomAtual = transporAcorde(musica.tom, transposicaoAtual);

            repertorio.push({
              id: musica.id,
              transposicao: transposicaoAtual,
              tom: tomAtual,
              parte: nomeParte
            });

            localStorage.setItem("repertorio", JSON.stringify(repertorio));

            btnRep.classList.add("salvo");
            btnRep.textContent = "✓ No Repertório";
            btnFixar.classList.add("salvo");

            msg.textContent = "Adicionado ao repertório!";
          }

          msg.classList.remove("hidden");

          setTimeout(() => {
            msg.classList.add("hidden");
          }, 2000);
        };

        // BOTÃO FIXAR TOM (apenas atualiza tom se já existir)
        btnFixar.onclick = () => {

          const transposicaoAtual = parseInt(card.dataset.transposicao);
          const tomAtual = transporAcorde(musica.tom, transposicaoAtual);

          const jaExiste = repertorio.find(item => item.id === musica.id);

          if (!jaExiste) {
            msg.textContent = "Adicione ao repertório primeiro.";
          } else {
            jaExiste.transposicao = transposicaoAtual;
            jaExiste.tom = tomAtual;
            jaExiste.parte = nomeParte;

            localStorage.setItem("repertorio", JSON.stringify(repertorio));

            btnFixar.classList.add("salvo");
            msg.textContent = "Tom atualizado no repertório!";
          }

          msg.classList.remove("hidden");

          setTimeout(() => {
            msg.classList.add("hidden");
          }, 2000);
        };


        listaCantosEl.appendChild(card);
      });
    }

    function mostrarSubPartes(parte) {

      menuEl.classList.add("hidden");

      tituloParteEl.classList.remove("hidden");
      tituloParteEl.textContent = parte.nome;

      listaCantosEl.innerHTML = "";

      // Para cada subparte dentro da Oração Eucarística
      parte.partes.forEach(sub => {

        const card = document.createElement("div");
        card.className = "card";

        const textoId = `texto-${sub.id}`;

        card.innerHTML = `
      <h3>${sub.nome}</h3>
      ${sub.observacao ? `<div class="observacao">${sub.observacao}</div>` : ""}

      <div class="links especial">
        <button class="toggleLetra btn-mostrar">Mostrar</button>
      </div>

      <div id="${textoId}" class="letra hidden">
        <p>${sub.texto.replace(/\n/g, "<br>")}</p>
      </div>
    `;

        card.querySelector(".btn-mostrar").onclick = () => {
          const textoEl = card.querySelector(`#${textoId}`);
          textoEl.classList.toggle("hidden");
        };

        listaCantosEl.appendChild(card);
      });
    }

    function toggleExclusive(card, idParaAbrir) {
      card.querySelectorAll(".audio-container, .cifra, .letra").forEach(el => {
        if (el.id === idParaAbrir) {
          el.classList.toggle("hidden");
        } else {
          el.classList.add("hidden");
        }
      });
    }

  })
  .catch(err => {
    console.error("Erro ao carregar dados:", err);
  });
