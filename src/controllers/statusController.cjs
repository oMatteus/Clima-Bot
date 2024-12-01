const lastExec = new Date;

exports.index = ('/clima/status', (request, response)=>{
    return response.send(
        {message:'server is up',
        status: 200,
        lastExec: lastExec.toLocaleString('pt-BR',{
            dateStyle: 'full', timeStyle: 'short'
        })
        }
    )
});