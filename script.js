const container = document.getElementById("container");
const cadastrarBtn = document.getElementById("cadastrar");
const entrarBtn = document.getElementById("entrar");

cadastrarBtn.addEventListener("click", function () {
    container.classList.add("ativo");
});

entrarBtn.addEventListener("click", function () {
    container.classList.remove("ativo");
});