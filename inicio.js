import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

//ususarios
const formUsuario = document.getElementById("form-usuario");

const listaUsuarios = document.getElementById("lista-usuarios");

const nomeUsuario = document.getElementById("nome-usuario");

const tipoUsuario = document.getElementById("tipo-usuario");

const emailUsuario = document.getElementById("email-usuario");

const mensagemUsuario = document.getElementById("mensagem-usuario");

let usuarioEditando = null;
// cadastrar e editar usuario
formUsuario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const nome = nomeUsuario.value.trim();

  const tipo = tipoUsuario.value;

  const email = emailUsuario.value.trim();

  mensagemUsuario.textContent = "";
  // validar nome
  if (nome === "") {
    mensagemUsuario.textContent = "Digite o nome do usuário.";

    return;
  }

  if (nome.length < 3) {
    mensagemUsuario.textContent = "O nome deve ter pelo menos 3 caracteres.";

    return;
  }

  if (nome.length > 60) {
    mensagemUsuario.textContent = "O nome não pode ter mais de 60 caracteres.";

    return;
  }
  // Impede nome composto apenas por números
  if (/^\d+$/.test(nome)) {
    mensagemUsuario.textContent = "O nome não pode conter somente números.";

    return;
  }
  // validacao do tipo de usuario
  if (tipo === "") {
    mensagemUsuario.textContent = "Selecione o tipo do usuário.";

    return;
  }
  // validacao do email
  if (email === "") {
    mensagemUsuario.textContent = "Digite o e-mail.";

    return;
  }

  if (email.length > 100) {
    mensagemUsuario.textContent =
      "O e-mail não pode ter mais de 100 caracteres.";

    return;
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(email)) {
    mensagemUsuario.textContent = "Digite um e-mail válido.";

    return;
  }

  try {
    // verificar se o email existe
    const usuariosBanco = await getDocs(collection(db, "usuarios"));

    let emailExiste = false;

    usuariosBanco.forEach(function (documento) {
      const usuario = documento.data();

      if (
        usuario.email &&
        usuario.email.toLowerCase() === email.toLowerCase() &&
        documento.id !== usuarioEditando
      ) {
        emailExiste = true;
      }
    });

    if (emailExiste) {
      mensagemUsuario.textContent =
        "Já existe um usuário cadastrado com este e-mail.";

      return;
    }
    //novo usuario
    if (usuarioEditando === null) {
      await addDoc(collection(db, "usuarios"), {
        nome: nome,
        tipo: tipo,
        email: email,
      });

      mensagemUsuario.textContent = "Usuário salvo com sucesso.";
    }
    // editar usuario
    else {
      const usuarioRef = doc(db, "usuarios", usuarioEditando);

      await updateDoc(usuarioRef, {
        nome: nome,
        tipo: tipo,
        email: email,
      });

      mensagemUsuario.textContent = "Usuário atualizado com sucesso.";

      usuarioEditando = null;
    }

    formUsuario.reset();

    carregarUsuarios();
  } catch (erro) {
    console.error(erro);

    mensagemUsuario.textContent = "Erro ao salvar usuário.";
  }
});
//lista usuarios
async function carregarUsuarios() {
  try {
    listaUsuarios.innerHTML = "";

    const resultado = await getDocs(collection(db, "usuarios"));

    resultado.forEach(function (documento) {
      const usuario = documento.data();

      const linha = document.createElement("tr");

      linha.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${usuario.tipo}</td>
                <td>${usuario.email}</td>

                <td>

                    <button
                        class="editar"
                        data-id="${documento.id}">
                        Editar
                    </button>

                    <button
                        class="excluir"
                        data-id="${documento.id}">
                        Excluir
                    </button>

                </td>
            `;

      listaUsuarios.appendChild(linha);
    });

    configurarBotoes();
  } catch (erro) {
    console.error(erro);
  }
}
// editar e excluir usuario
function configurarBotoes() {
  const botoesEditar = document.querySelectorAll(".editar");

  botoesEditar.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const linha = botao.closest("tr");

      nomeUsuario.value = linha.children[0].textContent;

      tipoUsuario.value = linha.children[1].textContent;

      emailUsuario.value = linha.children[2].textContent;

      usuarioEditando = botao.dataset.id;

      mensagemUsuario.textContent = "Editando usuário.";
    });
  });

  const botoesExcluir = document.querySelectorAll(".excluir");

  botoesExcluir.forEach(function (botao) {
    botao.addEventListener("click", async function () {
      const confirmar = confirm("Deseja realmente excluir este usuário?");

      if (!confirmar) {
        return;
      }

      try {
        await deleteDoc(doc(db, "usuarios", botao.dataset.id));

        mensagemUsuario.textContent = "Usuário excluído com sucesso.";

        carregarUsuarios();
      } catch (erro) {
        console.error(erro);

        mensagemUsuario.textContent = "Erro ao excluir usuário.";
      }
    });
  });
}
//notas e faltas
const formNotas = document.getElementById("form-notas");

const alunoSelect = document.getElementById("aluno-select");

const disciplinaSelect = document.getElementById("disciplina");

const notaInput = document.getElementById("nota");

const faltasInput = document.getElementById("faltas");

const listaNotas = document.getElementById("lista-notas");

formNotas.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const aluno = alunoSelect.options[alunoSelect.selectedIndex].text;

  const alunoId = alunoSelect.value;

  const disciplina = disciplinaSelect.value;

  const nota = Number(notaInput.value);

  const faltas = Number(faltasInput.value);

  // validar aluno
  if (alunoId === "") {
    alert("Selecione um aluno.");

    return;
  }
  // validar disciplina
  if (disciplina === "") {
    alert("Selecione uma disciplina.");

    return;
  }
  //validar nota
  if (notaInput.value === "" || isNaN(nota)) {
    alert("Digite uma nota válida.");

    return;
  }

  if (nota < 0 || nota > 10) {
    alert("A nota deve estar entre 0 e 10.");

    return;
  }
  // validar faltas
  if (faltasInput.value === "" || isNaN(faltas)) {
    alert("Digite o número de faltas.");

    return;
  }

  if (faltas < 0) {
    alert("O número de faltas não pode ser negativo.");

    return;
  }

  if (!Number.isInteger(faltas)) {
    alert("O número de faltas deve ser um número inteiro.");

    return;
  }

  try {
    // verificar se ja existe nota

    const notasBanco = await getDocs(collection(db, "notas"));

    let notaExiste = false;

    notasBanco.forEach(function (documento) {
      const registro = documento.data();

      if (registro.alunoId === alunoId && registro.disciplina === disciplina) {
        notaExiste = true;
      }
    });

    if (notaExiste) {
      alert("Este aluno já possui uma nota cadastrada nesta disciplina.");

      return;
    }

    await addDoc(collection(db, "notas"), {
      alunoId: alunoId,
      aluno: aluno,
      disciplina: disciplina,
      nota: nota,
      faltas: faltas,
    });

    alert("Nota e faltas registradas com sucesso!");

    formNotas.reset();

    carregarNotas();
  } catch (erro) {
    console.error(erro);

    alert("Erro ao registrar nota.");
  }
});

// listar notas
async function carregarNotas() {
  try {
    listaNotas.innerHTML = "";

    const resultado = await getDocs(collection(db, "notas"));

    resultado.forEach(function (documento) {
      const registro = documento.data();

      let situacao = "Reprovado";

      if (registro.nota >= 6) {
        situacao = "Aprovado";
      }

      const linha = document.createElement("tr");

      linha.innerHTML = `
                <td>${registro.disciplina}</td>
                <td>${registro.nota}</td>
                <td>${registro.faltas}</td>
                <td>${situacao}</td>
            `;

      listaNotas.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
  }
}
//financeiro
const formFinanceiro = document.getElementById("form-financeiro");

const alunoFinanceiro = document.getElementById("aluno-financeiro");

const mesReferencia = document.getElementById("mes-de-referencia");

const valorInput = document.getElementById("valor");

const vencimentoInput = document.getElementById("vencimento");

const listaFinanceiro = document.getElementById("lista-financeiro");

formFinanceiro.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const aluno = alunoFinanceiro.options[alunoFinanceiro.selectedIndex].text;

  const alunoId = alunoFinanceiro.value;

  const mes = mesReferencia.value;

  const valor = Number(valorInput.value);

  const vencimento = vencimentoInput.value;
  // validar aluno
  if (alunoId === "") {
    alert("Selecione um aluno.");

    return;
  }

  // valida mes

  if (mes === "") {
    alert("Selecione o mês de referência.");

    return;
  }

  // validacao do valor

  if (valorInput.value === "" || isNaN(valor)) {
    alert("Digite um valor válido.");

    return;
  }

  if (valor <= 0) {
    alert("O valor deve ser maior que zero.");

    return;
  }

  if (valor > 100000) {
    alert("O valor informado é muito alto.");

    return;
  }

  // validacao do vencimento

  if (vencimento === "") {
    alert("Informe a data de vencimento.");

    return;
  }

  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  const dataVencimento = new Date(vencimento + "T00:00:00");

  if (dataVencimento < hoje) {
    alert("A data de vencimento não pode ser anterior à data atual.");

    return;
  }

  try {
    await addDoc(collection(db, "financeiro"), {
      alunoId: alunoId,
      aluno: aluno,
      mes: mes,
      valor: valor,
      vencimento: vencimento,
      status: "Pendente",
    });

    alert("Boleto registrado com sucesso!");

    formFinanceiro.reset();

    carregarFinanceiro();
  } catch (erro) {
    console.error(erro);

    alert("Erro ao registrar boleto.");
  }
});

//listar financeiro

async function carregarFinanceiro() {
  try {
    listaFinanceiro.innerHTML = "";

    const resultado = await getDocs(collection(db, "financeiro"));

    resultado.forEach(function (documento) {
      const registro = documento.data();

      const linha = document.createElement("tr");

      const valorFormatado = Number(registro.valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      let dataFormatada = registro.vencimento;

      if (registro.vencimento) {
        const partes = registro.vencimento.split("-");

        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }

      linha.innerHTML = `
                <td>${registro.aluno}</td>
                <td>${registro.mes}</td>
                <td>${valorFormatado}</td>
                <td>${dataFormatada}</td>
                <td>${registro.status}</td>
            `;

      listaFinanceiro.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
  }
}
//carregamento inicial
carregarUsuarios();

carregarNotas();

carregarFinanceiro();
