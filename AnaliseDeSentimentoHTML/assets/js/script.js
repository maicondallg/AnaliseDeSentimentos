const sentimentosSelect = document.getElementById('sentimentos-select')

var sentimentoIdSelected = null

function getSentimentos(){
    query = `
            query{
                getAllSentimento
                {
                    id
                    nome
                }
            }
            `

    queryFetch(query, {}).then(data => {
        data.data.getAllSentimento.forEach(sentimento => {
            const option = document.createElement('option')
            option.value = sentimento.id
            option.innerText = sentimento.nome
            sentimentosSelect.append(option)
        })
    })
}

function ajudaAlgoritmo()
{
    const text = document.getElementById("texto").value
    const id_frase = saveFrase(text)
    
    addAnalise(id_frase, sentimentoIdSelected, 1, 1)
}

function addAnalise(id_frase_entry, id_sentimento_entry, id_usuario_entry, correto_entry)
{
    const mutation = `
    mutation addAnalise($id_frase: ID!, $id_sentimento: ID!, $id_usuario: ID!, $correto: Boolean){
        addAnalise(id_frase: $id_frase, id_sentimento: $id_sentimento, id_usuario: $id_usuario, correto: $correto)
        {
            id
        }
    }
    `

    const variaveis = {id_frase: id_frase_entry, id_sentimento: id_sentimento_entry, id_usuario: id_usuario_entry, correto: correto_entry}

    return queryFetch(mutation, variaveis)
}

function saveFrase(texto_entry)
{
    const mutation = `
    mutation addFrase($texto: String!){
        addFrase(frase: $texto){
            id
            texto
        }
      }
    `
    const variaveis = {texto: texto_entry}

    return queryFetch(mutation, variaveis).then(data => {
        return data.data.addFrase.id
    })
}

sentimentosSelect.addEventListener('change', e => {
    sentimentoIdSelected = e.target.value
})

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