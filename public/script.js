async function atualizarListaDeLivros() {
    console.log("atualizando")

    const response = await fetch("/livros")
    const livros = await response.json()
    const listaDeLivros = document.getElementById("listaDeLivros")

    listaDeLivros.innerHTML = ""

    livros.forEach((livro) => {
        const div = document.createElement("div")
        div.className = "livro-item"
        div.innerHTML = `
            <strong>${livro.titulo}</strong> - ${livro.autor} ${livro.ano}
            <button class="btn btn-editar" onclick="editarLivro('${livro._id}')">Alterar</button>
            <button class="btn btn-excluir" onclick="excluirLivro('${livro._id}')">Excluir</button>
        `
        listaDeLivros.appendChild(div)
    })
}

async function cadastrarLivro(event) {
    event.preventDefault()

    const livro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        ano: parseInt(document.getElementById("ano").value)
    }

    const response = await fetch("/livros", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(livro)
    })

    const data = await response.json()
    console.log("Livro cadastrado:", data)

    atualizarListaDeLivros()
}

async function editarLivro(id) {
    const novoTitulo = prompt("Novo Titulo:")
    const novoAutor = prompt("Novo Autor:")
    const novoAno = prompt("Novo ano:")

    let titulo = novoTitulo === null ? "" : novoTitulo
    if (titulo === "") titulo = undefined

    let autor = novoAutor === null ? "" : novoAutor
    if (autor === "") autor = undefined

    let ano = parseInt(novoAno)
    if (isNaN(ano)) ano = undefined

    const livroAtualizado = {
        titulo: titulo,
        autor: autor,
        ano: ano
    }

    await fetch(`/livros/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(livroAtualizado)
    })

    atualizarListaDeLivros()
}

async function excluirLivro(id) {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
        const response = await fetch(`/livros/${id}`, { method: "DELETE" })

        if (response.ok) {
            console.log("Livro deletado com sucesso")
            await atualizarListaDeLivros()
        } else {
            console.error("Erro ao deletar:", response.status)
        }
    }
}

document.getElementById("formLivro").addEventListener("submit", cadastrarLivro)

window.onload = atualizarListaDeLivros