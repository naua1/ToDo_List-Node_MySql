import express, { urlencoded } from "express";
import {conexao} from"./db.js"
import {engine} from"express-handlebars"

const app = express();
app.use(express.json());

app.use("/css",express.static("./css"));

// faz que express endenda os dados enviados pelo formulario
app.use(urlencoded({extended:false}));

app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));

  
//"Use o Handlebars como mecanismo para renderizar arquivos de view."
app.set('view engine', 'handlebars');
// Define o diretório onde estão os arquivos de views (templates).
app.set("views","./views")

//metodo get da api
app.get("/",( req, res) =>{
    
  const sql = `select * from tarefas`

    conexao.query(sql, (erro,retorno) =>{
      if(erro) throw erro;
    
      res.render("lista", {tarefas: retorno})
})

    
});
//metodo post
app.post("/adicionarTarefa", (req,res) => {

    const {tarefa} = req.body;
   
    const sql = `insert into tarefas (tarefa) value ('${tarefa}')`
    conexao.query(sql,(erro,retorno) =>{
        if(erro) throw erro;

        res.redirect("/")
    })
});

//delete da api
app.get("/removerTarefa/:id", (req,res) =>{

  const id = req.params.id;

  const sql = `delete from tarefas where i_d = ${id}`

  conexao.query(sql,(erro,retorno) =>{

    if(erro) throw erro;

    res.redirect("/")

  });

});

app.listen(3000)