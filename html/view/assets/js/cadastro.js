function startCadastro()
{
    nome_entry = document.getElementById('nome').value
    sobrenome_entry = document.getElementById('sobrenome').value
    sexo = document.getElementById('sexo').value
    data_nasc = document.getElementById('data_nasc').value

    email = document.getElementById('email').value
    celular = document.getElementById('celular').value

    username = document.getElementById('username').value
    senha = document.getElementById('senha').value

    rua = document.getElementById('rua').value
    numero = document.getElementById('numero').value
    cidade = document.getElementById('cidade').value
    estado = document.getElementById('estado').value
    cep = document.getElementById('cep').value

    data = {'nome': nome_entry, 'sobrenome': sobrenome_entry, 'sexo':sexo, 'data_nasc': data_nasc ,
            'email': email,'celular':celular,
            'username':username, 'senha':senha,
            'rua': rua, 'numero':numero, 'cidade':cidade, 'estado': estado, 'cep': cep}


    checkLogin(data)

}

function checkLogin(data)
{
    query = `
    query existsUsername($username: String!)
    {
        existsUsername(username: $username)
    }
    `
    variaveis = {username: data['username']}

    queryFetch(query, variaveis).then(result =>{
        if(result.data.existsLogin)
        {
            setUsuarioExistente()
        }
        else
        {

            setUsuarioInexistente(data)
        }
    });
}

function setUsuarioExistente()
{
    usuario.value = ""
    usuario.placeholder = "Username já existente!"
}

function addUsuario(data, id_login, id_contato, id_endereco)
{
    const mutation = `
    mutation addUsuario($nome: String!, $sobrenome: String!, $sexo: String!, $data_nasc: String!, $id_contato: ID!, $id_login: ID!, $id_endereco: ID!){
        addUsuario(nome: $nome, sobrenome: $sobrenome, sexo: $sexo, data_nasc: $data_nasc, id_contato: $id_contato, id_login: $id_login, id_endereco: $id_endereco)
        {
            id
        }
    }
    `
    const variaveis = {nome: data['nome'], sobrenome: data['sobrenome'],
                        sexo: data['sexo'], data_nasc:data['data_nasc'],
                        id_contato: id_contato, id_login: id_login, id_endereco: id_endereco}

    return queryFetch(mutation, variaveis)
}

function setUsuarioInexistente(data)
{
    addLogin(data).then(result => {
        addContato(data).then( result2 => {
            addEndereco(data).then( result3 => {
                const id_login = result.data.addLogin.id
                const id_contato = result2.data.addContato.id
                const id_endereco = result3.data.addEndereco.id
                addUsuario(data, id_login, id_contato, id_endereco).then(result4 =>{
                    localStorage.id = result4.data.addUsuario.id
                    document.location.href = "index.html"
                })
            })
        })
    })
}


function addLogin(data)
{
    const mutation = `
    mutation addLogin($nomeUsuario: String!, $senha: String!){
        addLogin(nomeUsuario: $nomeUsuario, senha: $senha)
        {
            id
        }
    }
    `
    const variaveis = {nomeUsuario: data['username'], senha: data['senha']}

    return queryFetch(mutation, variaveis)
}

function addContato(data)
{
    const mutation = `
    mutation addContato($celular: String!, $email: String!){
        addContato(celular: $celular, email: $email)
        {
            id
        }
    }
    `
    const variaveis = {celular: data['celular'], email: data['email']}

    return queryFetch(mutation, variaveis)
}


function addEndereco(data)
{
    const mutation = `
    mutation addEndereco($rua: String, $numero: String, $cep: String, $cidade: String, $estado: String){
        addEndereco(rua: $rua, numero: $numero, cep: $cep, cidade: $cidade, estado: $estado)
        {
            id
        }
    }
    `
    const variaveis = {rua:data['rua'], numero: data['numero'], cep: data['cep'], cidade:data['cidade'], estado: data['estado']}

    return queryFetch(mutation, variaveis)
}

function queryFetch(query_entry, variables_entry)
{
    return fetch('http://localhost:8088/graphql',
        {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                query: query_entry,
                variables: variables_entry
            })
        }).then(res => res.json())
}