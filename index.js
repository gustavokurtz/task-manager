const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const PORT = 3000;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

const database = [];

app.get('/', (req, res) => {
    res.render('tasks', { items: database });
});

app.post('/tasks', (req, res) => {
    const tarefa = req.body.tarefa;

    if (tarefa !== undefined && tarefa !== null && tarefa.trim() !== '') {
        const id = database.length + 1;
        const novaTarefa = { id, tarefa };
        database.push(novaTarefa);
    }

    res.redirect('/');
});

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = database.find((tarefa) => tarefa.id === taskId);

    if (!task) {
        res.status(404).send('Tarefa não encontrada');
        return;
    }

    res.render('task', { task });
});


// Rota para editar uma tarefa (exemplo)
app.get('/edit/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = database.find((tarefa) => tarefa.id === taskId);

    if (!task) {
        res.status(404).send('Tarefa não encontrada');
        return;
    }

    res.render('edit', { task });
});

// Rota POST para processar a edição de uma tarefa
app.post('/edit/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body.tarefa;

    // Atualize a tarefa no seu array de tarefas (ou no banco de dados, se estiver usando um)
    const taskIndex = database.findIndex((tarefa) => tarefa.id === taskId);

    if (taskIndex === -1) {
        res.status(404).send('Tarefa não encontrada');
        return;
    }

    // Atualize a tarefa
    database[taskIndex].tarefa = updatedTask;

    // Redirecione de volta para a página de detalhes ou outra página apropriada
    res.redirect(`/tasks/${taskId}`);
});





// Rota para excluir uma tarefa (exemplo)
app.get('/delete/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = database.findIndex((tarefa) => tarefa.id === taskId);

    if (taskIndex === -1) {
        res.status(404).send('Tarefa não encontrada');
        return;
    }

    // Remova a tarefa da lista
    database.splice(taskIndex, 1);

    // Redirecione de volta para a página inicial
    res.redirect('/');
});




app.listen(PORT, () => {
    console.log(`Servidor Express está rodando na porta ${PORT}`);
});
