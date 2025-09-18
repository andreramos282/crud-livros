import express, { Request, Response } from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import Livro from "./models/livro"
import path from 'path'

const app = express()
const PORT = 3000
const MONGODB_URI = "mongodb+srv://root:root@fatec.typea.mongodb.net/?retryWrites=true&w=majority&appName=fatec"

app.use(bodyParser.json())
app.use(cors())
app.use(express.static("public"))
app.use(express.json())

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error("Erro ao conectar ao MongoDB", err))

app.post("/livros", async (req: Request, res: Response) => {
    const { titulo, autor, ano } = req.body
    if (!titulo || !autor || !ano) {
        res.status(401).json({ message: "É necessario inserir 'titulo', 'autor' e 'ano'." })
        return
    }
    try {
        const novoLivro = new Livro({
            titulo: titulo,
            autor: autor,
            ano: ano
        })
        const livroSalvo = await novoLivro.save()
        res.status(201).json(livroSalvo)
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar livros", error })
    }
})

app.get("/livros", async (_: Request, res: Response) => {
    try {
        const livros = await Livro.find()
        res.status(200).json(livros)
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar livros", error })
    }
})

app.put("/livros/:id", async (req: Request, res: Response) => {
    const { id } = req.params
    const { titulo, autor, ano } = req.body
    if (!id) {
        res.status(401).json({ message: "É necessario informar o 'ID'" })
        return
    }
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(id, { titulo, autor, ano }, { new: true })
        if (!livroAtualizado) {
            res.status(404).json({ message: "Livro não encontrado" })
            return
        }
        res.status(200).json(livroAtualizado)
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar livro", error })
    }
})

app.delete("/livros/:id", async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        res.status(401).json({ message: "É necessario informar o 'ID'" })
        return
    }
    try {
        const livroDeletado = await Livro.findByIdAndDelete(id)
        if (!livroDeletado) {
            res.status(404).json({ message: "Livro não encontrado" })
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar livro", error })
    }
})

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"))
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server rodando em http://0.0.0.0:${PORT}`);
});