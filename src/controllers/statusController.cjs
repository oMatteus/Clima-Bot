exports.index = ('/clima/status', (request, response)=>{

    const lastExec = new Date;
    return response.send(
        {message:'server is up',
        status: 200,
        time: lastExec.toLocaleString('pt-BR',{
            dateStyle: 'full', timeStyle: 'short'
        })
        }
    )
});