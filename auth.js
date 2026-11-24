import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// validar senha

function validarSenha(senha) {
  if (senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres.";
  }

  if (senha.length > 32) {
    return "A senha deve ter no máximo 32 caracteres.";
  }

  if (/^\d+$/.test(senha)) {
    return "A senha não pode conter somente números.";
  }

  if (!/[A-Z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra maiúscula.";
  }

  if (!/[a-z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra minúscula.";
  }

  if (!/[0-9]/.test(senha)) {
    return "A senha deve ter pelo menos um número.";
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    return "A senha deve ter pelo menos um caractere especial.";
  }

  if (/(.)\1\1/.test(senha)) {
    return "A senha não pode ter muitos caracteres repetidos.";
  }

  const senhaMinuscula = senha.toLowerCase();

  const sequenciasProibidas = [
    "123456",
    "12345678",
    "abcdef",
    "qwerty",
    "senha123",
    "password",
  ];

  for (const sequencia of sequenciasProibidas) {
    if (senhaMinuscula.includes(sequencia)) {
      return "A senha contém uma sequência muito fácil de adivinhar.";
    }
  }

  return null;
}
// formulario de cadastro
const formCadastro = document.getElementById("form-cadastro");

formCadastro.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome-cadastro").value.trim();

  const email = document.getElementById("email-cadastro").value.trim();

  const senha = document.getElementById("senha-cadastro").value;

  const tipo = document.getElementById("tipo-cadastro").value;

  const mensagem = document.getElementById("mensagem-cadastro");

  mensagem.textContent = "";
  // validacao do nome
  if (nome === "") {
    mensagem.textContent = "Digite o nome.";

    return;
  }

  if (nome.length > 60) {
    mensagem.textContent = "O nome não pode ter mais de 60 caracteres.";

    return;
  }
  // validacao do email
  if (email === "") {
    mensagem.textContent = "Digite o e-mail.";

    return;
  }

  if (email.length > 100) {
    mensagem.textContent = "O e-mail não pode ter mais de 100 caracteres.";

    return;
  }
  // validacao do tipo de usuario
  if (tipo === "") {
    mensagem.textContent = "Escolha o tipo de usuário.";

    return;
  }
  // validacao da senha
  const erroSenha = validarSenha(senha);

  if (erroSenha !== null) {
    mensagem.textContent = erroSenha;

    return;
  }
  // cadastro do fire
  try {
    const usuario = await createUserWithEmailAndPassword(auth, email, senha);

    await setDoc(doc(db, "usuarios", usuario.user.uid), {
      nome: nome,
      email: email,
      tipo: tipo,
    });

    alert("Usuário cadastrado com sucesso!");

    window.location.href = "inicio.html";
  } catch (erro) {
    console.log(erro);

    if (erro.code === "auth/email-already-in-use") {
      mensagem.textContent = "Este e-mail já está cadastrado.";
    } else if (erro.code === "auth/invalid-email") {
      mensagem.textContent = "Digite um e-mail válido.";
    } else if (erro.code === "auth/weak-password") {
      mensagem.textContent = "A senha precisa ser mais forte.";
    } else {
      mensagem.textContent = "Erro ao cadastrar usuário.";
    }
  }
});
// formulario de login
const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const email = document.getElementById("email-login").value.trim();

  const senha = document.getElementById("senha-login").value;

  const mensagem = document.getElementById("mensagem-login");

  mensagem.textContent = "";
  // validacao do email
  if (email === "") {
    mensagem.textContent = "Digite o e-mail.";

    return;
  }

  if (email.length > 100) {
    mensagem.textContent = "E-mail inválido.";

    return;
  }
  // validacao da senha
  if (senha === "") {
    mensagem.textContent = "Digite a senha.";

    return;
  }

  if (senha.length > 32) {
    mensagem.textContent = "Senha inválida.";

    return;
  }
  // login do fire
  try {
    await signInWithEmailAndPassword(auth, email, senha);

    window.location.href = "inicio.html";
  } catch (erro) {
    console.log(erro);

    if (erro.code === "auth/invalid-email") {
      mensagem.textContent = "Digite um e-mail válido.";
    } else if (erro.code === "auth/invalid-credential") {
      mensagem.textContent = "E-mail ou senha incorretos.";
    } else {
      mensagem.textContent = "Não foi possível entrar.";
    }
  }
});
