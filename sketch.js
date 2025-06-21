// Jogo de Reciclagem na Praia - p5.js

// Objetivo: Arrastar e soltar os lixos nos lugares certos antes do tempo acabar.
//OBS!! É mais efetivo clicar na parte de cima dos emojis, para pegar ele

//Esse foi o prompt que usei no gpt "crie um codigo sobre um jogo de reciclagem na praia, tendo os lixos e ter que colocar cada lixo no lugar certo "metal, plastico, papel, vidro, organico" , com um tempo pra fazer isso começando com uma mensagem "Comece!! :D" e se não conseguir  a tempo "O tempo acabou! :(" quero que tenha imojis pra representar a garota, e 4 imojis pra representar os tipos de lixo, uns 30 lixos no maximo, pequenos, e se conseguir a tempo "Tu conseguiu, parabéns dalee!!!"

//Eu mudei só algumas coisas, como cores, cores do cenário, emoji, posições, adicionei um sol

let lixoTipos = [
  { tipo: "metal", emoji: "🔔" },    // metal (barril)
  { tipo: "plastico", emoji: "🥤" }, // plástico (mamadeira)
  { tipo: "papel", emoji: "📄" },    // papel (folha)
  { tipo: "vidro", emoji: "🥛" },    // vidro (garrafa)
  { tipo: "organico", emoji: "🥪" }  // orgânico (banana)
];

let areasReciclagem = [];
let lixos = [];
let lixosSoltos = 0;

let tempoMax = 60; // segundos para jogar
let tempoAtual;
let jogoRodando = false;
let mensagemFinal = "";

let nerd = "🤓";

let lixoSelecionado = null;
let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(24);
  noStroke();

  // criar as áreas de reciclagem na parte direita da tela
  let startY = 100;
  let alturaArea = 70;
  for (let i = 0; i < lixoTipos.length; i++) {
    let y = startY + i * (alturaArea + 20);
    areasReciclagem.push({
      tipo: lixoTipos[i].tipo,
      emoji: lixoTipos[i].emoji,
      x: width - 160,
      y: y,
      w: 120,
      h: alturaArea
    });
  }

  mostrarMensagemInicio();
}

function mostrarMensagemInicio() {
  background("rgb(160,160,255)");
  fill("rgb(255,240,185)");
  textSize(48);
  text("Comece!! :D", width / 2, height / 2 - 50);
  textSize(80);
  text(nerd, width / 2, height / 2 + 50);

  textSize(24);
  text("Clique para começar (￣▽￣)", width / 2, height / 2 + 120);
}

function iniciarJogo() {
  // Resetar tudo para começar
  lixos = [];
  lixosSoltos = 0;
  tempoAtual = tempoMax;
  jogoRodando = true;
  mensagemFinal = "";

  // Criar até 30 lixos aleatórios na área esquerda
  let qtdLixos = floor(random(25, 30));
  for (let i = 0; i < qtdLixos; i++) {
    let tipoIndex = floor(random(lixoTipos.length));
    lixos.push({
      tipo: lixoTipos[tipoIndex].tipo,
      emoji: lixoTipos[tipoIndex].emoji,
     x: random(50, width / 2),
      y: random(100, height - 100),
      w: 70,
      h: 70,
      arrastando: false,
      encaixado: false
    });
  }
}

function draw() {
  if (!jogoRodando) return;

  background(150, 220, 255);

  // Desenhar o mar e areia
  desenharCenario();

  // Desenhar as áreas de reciclagem
  for (let area of areasReciclagem) {
    fill(252, 197, 205);
    rect(area.x, area.y, area.w, area.h, 10);
    fill(0);
    textSize(32);
    text(area.emoji, area.x + area.w / 2 - 30, area.y + area.h / 2);
    textSize(18);
    text(area.tipo.toUpperCase(), area.x + area.w / 2 - 30, area.y + area.h / 2 + 35);
  }

  // Desenhar o nerd no canto inferior esquerdo
  textSize(80);
  text(nerd, 60, height - 80);

  // Atualizar e desenhar lixos
  for (let lixo of lixos) {
    if (!lixo.encaixado) {
      fill(255);
      textSize(40);
      text(lixo.emoji, lixo.x, lixo.y);
    }
  }

  // Mostrar tempo restante
  fill(0);
  textSize(28);
  textAlign(LEFT, TOP);
  text(`Tempo: ${tempoAtual.toFixed(1)}s`, 10, 10);

  // Contar tempo
  if (frameCount % 6 === 0 && tempoAtual > 0) { // reduzir tempo a cada 0.1 segundo
    tempoAtual -= 0.1;
    if (tempoAtual <= 0) {
      tempoAtual = 0;
      finalizarJogo(false);
    }
  }

  // Verificar se todos os lixos foram reciclados
  if (lixosSoltos === lixos.length && lixos.length > 0) {
    finalizarJogo(true);
  }
}

function desenharCenario() {
  // Céu
  noStroke();
  fill(163, 223, 255);
  rect(0, 0, width, height / 2);

  // Mar
  fill(103, 235, 226);
  rect(0, height / 2, width, height / 3);

  // Areia
  fill(250, 234, 162);
  rect(0, height * 5 / 6, width, height / 6);
  //Sol!!
  fill(250, 211, 132)
  circle(120, 100, 110)
}

function mousePressed() {
  if (!jogoRodando) {
    iniciarJogo();
    return;
  }

  // Verificar se clicou em algum lixo não encaixado
  for (let lixo of lixos) {
    if (!lixo.encaixado && dist(mouseX, mouseY, lixo.x, lixo.y) < 25) {
      lixoSelecionado = lixo;
      lixo.arrastando = true;
      offsetX = lixo.x - mouseX;
      offsetY = lixo.y - mouseY;
      break;
    }
  }
}

function mouseDragged() {
  if (lixoSelecionado && lixoSelecionado.arrastando) {
    lixoSelecionado.x = mouseX + offsetX;
    lixoSelecionado.y = mouseY + offsetY;
  }
}

function mouseReleased() {
  if (lixoSelecionado) {
    lixoSelecionado.arrastando = false;

    // Verificar se está sobre uma área de reciclagem certa
    for (let area of areasReciclagem) {
      if (
        lixoSelecionado.x > area.x &&
        lixoSelecionado.x < area.x + area.w &&
        lixoSelecionado.y > area.y &&
        lixoSelecionado.y < area.y + area.h
      ) {
        if (lixoSelecionado.tipo === area.tipo) {
          // Encaixou certo
          lixoSelecionado.encaixado = true;
          lixoSelecionado.x = area.x + area.w / 2;
          lixoSelecionado.y = area.y + area.h / 2;
          lixosSoltos++;
        } else {
          // Errado, volta pro lugar inicial (ou próxima posição aleatória)
          lixoSelecionado.x = random(100, width / 100);
          lixoSelecionado.y = random(100, height - 0);
        }
        break;
      }
    }

    lixoSelecionado = null;
  }
}

function finalizarJogo(venceu) {
  jogoRodando = false;
  background(160,160,255);
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(255,240,185);

  if (venceu) {
    mensagemFinal = "Tu conseguiu, dalee!!! 🎉🎉🎉";
  } else {
    mensagemFinal = "O tempo acabou! :( ";
  }

  text(mensagemFinal, width / 2, height / 2 - 30);
  textSize(80);
  text(nerd, width / 2, height / 2 + 70);

  textSize(24);
  text("Clique para jogar novamente! :)", width / 2, height / 2 + 140);
}
