document.getElementById('fetchDataBtn2').addEventListener('click', getAuthCode);
document.getElementById('fetchDataBtn').addEventListener('click', fetchData);
let code = localStorage.getItem('authcode');
let respData = ''
let fila = '';
let espera = '';

let quantAtt= [];
let tecTransf = []
const tecnAtt = []
const attAtivo = []
let totalEspera = '0';
let totalFila = '0';

let substituicoes = {
    "ID": "ID",
    "Status": "Status",
    "Technician": "Técnico",
    "Start Time": "Hora Início",
    "Waiting Time": "Tempo Espera",
    "Custom Field 0": "NOME",
    "Custom Field 1": "EMPRESA",
    "Custom Field 2": "TELEFONE",
    "Custom Field 3": "DESCRICAO",
    "Custom Field 4": "CNPJ",
    "Transferred To": "Transferido Para",
    "Transferred Comment": "Comentário Transferido",
    
};

function traduzirStatus(statusEmIngles) {
    const traducoes = {
        "Aborted: technician was deleted or disabled": "Abortado: técnico foi deletado ou desativado",
        "Active": "Ativo",
        "Closed by active customer": "Fechado pelo cliente ativo",
        "Closed by customer": "Fechado pelo cliente",
        "Closed by technician": "Fechado pelo técnico",
        "Closed by waiting customer": "Fechado pelo cliente em espera",
        "Connecting": "Conectando",
        "Declined by customer": "Recusado pelo cliente",
        "Disconnected": "Desconectado",
        "Expired": "Expirado",
        "Not available": "Indisponível",
        "Offline": "Offline",
        "On Hold": "Em espera",
        "Rebooted": "Reiniciado",
        "Rebooting": "Reiniciando",
        "Reconnecting": "Reconectando",
        "Revoked": "Revogado",
        "Timed out": "Tempo esgotado",
        "Timed out: closed by technician": "Tempo esgotado: fechado pelo técnico",
        "Transferred": "Transferido",
        "Transferring": "Transferindo",
        "Waiting": "Esperando"
    };

    // Verifica se a string recebida está presente no objeto de traduções
    if (traducoes.hasOwnProperty(statusEmIngles)) {
        return traducoes[statusEmIngles];
    } else {
        return "Status não encontrado";
    }
}


function translateResp(arr, substituicoes) {
    let novoArray = [];

    arr.forEach(obj => {
        let novoObjeto = {};

        for (let chave in obj) {
            if (obj.hasOwnProperty(chave)) {
                let novaChave = chave;

                for (let [antiga, nova] of Object.entries(substituicoes)) {
                    novaChave = novaChave.replace(antiga, nova);
                }

                novoObjeto[novaChave] = obj[chave];
            }
        }

        novoArray.push(novoObjeto);
    });

    return novoArray;
}

let teste = `OK

ID|Status|Entry ID|Entry|Technician ID|Technician|Start Time|Waiting Time|Custom Field 0|Custom Field 1|Custom Field 2|Custom Field 3|Custom Field 4|Custom Field 5|Language|Transferred To|Transferred Comment|Is Lead Technician|HandingOff|
1073174914|Active|1927940688|Canal Suporte Tecnico|25445857|ELLSON|6/19/2024 11:04 AM|2600|RICARDO|POSTO AGUIA|34845730|O MFE NAO ESTA CONECTANDO|094984270001||en|||yes||
1073201447|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 1:46 PM|4267|Lucia|POSTO BALEIA|88988340232|SISTEMA  OFFILINE|0429840500109||en|||yes||
1073209957|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:29 PM|1697|aline|posto jp|91321478|sistema|08286434000373||en|||yes||
1073191601|Active|1927940688|Canal Suporte Tecnico|25442318|Pedro Henrique|6/19/2024 12:51 PM|7382|elias|jacarey|888888|pedeo henrique|37599274000159||en|||yes||
1073180549|Closed by active customer|1927940688|Canal Suporte Tecnico|23890323|Jeferson Martins|6/19/2024 11:27 AM|3939|JULIA|POSTO COLINA|32153058|ERRO CAIXA|02858003000358||en|||yes||
1073211838|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:38 PM|1156|leo lima|240310|987924200|ofiline|02696818000205||en|||yes||
1073188524|Active|1927940688|Canal Suporte Tecnico|23890323|Jeferson Martins|6/19/2024 12:30 PM|6159|lucas|leste loja|85991708672|erro de transmissao shell|28039304000181||en|||yes||
1073211979|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:39 PM|1108|lorrana|posto mil|85992545724|MANIFESTO NOTA FISCAL|02782524000107||en|||yes||
1073211511|Active|1927940688|Canal Suporte Tecnico|25445857|ELLSON|6/19/2024 2:50 PM|418|rafaela|aguiar comercial|85996183854|nsf|00382609000172||en|||yes||
1073183843|Active|1927940688|Canal Suporte Tecnico|24202697|Lopes|6/19/2024 1:09 PM|4601|leandro|posto santa cecilia|85982390620|sistema|07636087000137||en|||yes||
1073182839|Closed by active customer|1927940688|Canal Suporte Tecnico|25442318|Pedro Henrique|6/19/2024 11:47 AM|59|marcos paulo|posto sta cecilia 02|988908270|desconto em produto nao autorizado|14407650000150||en|||yes||
1073209442|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:26 PM|1844|KELLY|POSTO CAPUAN |85986143047|TRCAR CLIENTE DO VALE |22788784000105||en|||yes||
1073209177|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:25 PM|1926|netto|posto anjos|85988240052|relatorio|14496482000127||en|||yes||
1073177422|Active|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/19/2024 10:54 AM|13013|PEDRO |SMS POSTO|85987600003|MFE INATIVO|13277741000166||en|||yes||
1073200269|Offline|1927940688|Canal Suporte Tecnico|0||6/19/2024 1:39 PM|795|renato|posto da paz|85989634779|cair vendas|19277140000130||en|||yes||
1073201007|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 1:43 PM|4423|TALINE|POSTO PIONEIRO|85986547144|LMC|69373793000190||en|||yes||
1073181646|Active|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/19/2024 11:37 AM|9453|ARI|POSTO SHOPPING|8532621787|SEM CONEXÃO|02858003000277||en|||yes||
1073206101|Active|1927940688|Canal Suporte Tecnico|26091415|João Pedro|6/19/2024 2:10 PM|2191|mota|amv|986255837|sistema|08032284000290||en|||yes||
1073208982|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:25 PM|1957|NATALIA|POSTO PARA TY|85992834935|VENDA QUE NAO FINALIZOU COMO TEF|10933060000110||en|||yes||
1073183658|Closed by active customer|1927940688|Canal Suporte Tecnico|23890323|Jeferson Martins|6/19/2024 11:55 AM|3013|NANDO|POSTO COLINA|85989685401|HORARIO DIFERENTE|02858003000358||en|||yes||
1073182655|On Hold|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/19/2024 11:46 AM|10876|rogerio|j a comercio|86092739|off|02696818000620||en|||yes||
1073207648|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:18 PM|2372|Amanda|Posto Via Sul|85994194774|Tef não esta pegando |2217509300128||en|||yes||
1073191836|Active|1927940688|Canal Suporte Tecnico|25445857|ELLSON|6/19/2024 12:53 PM|3263|gutembergue|barracuda|988006753|estoque|06220994000138||en|||yes||
1073178772|Active|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/19/2024 11:09 AM|2281|jamilles|jpn|88988090898|sistema|22135247000158||en|||yes||
1073199749|Active|1927940688|Canal Suporte Tecnico|25442318|Pedro Henrique|6/19/2024 1:37 PM|4660|vitoria|pbb caucaia|85988731385|preciso alterar o bico para diesel aditivado|05613385000186||en|||yes||
1073198280|Active|1927940688|Canal Suporte Tecnico|23890323|Jeferson Martins|6/19/2024 1:29 PM|1742|ANAILTON|RODAO 2|85|VERIFICAR|05352158000225||en|||yes||
1073205249|Active|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/19/2024 2:15 PM|2555|Crislene Silva|Posto Papagaio|558599163886|Acesso ao Servidor|0||en|||yes||
1073185217|Active|1927940688|Canal Suporte Tecnico|25445857|ELLSON|6/19/2024 12:07 PM|7029|JARBAS|POSTO NS DE FATIMA|85997897319|SUPORTE |49821084000113||en|||yes||
1073211213|Active|1927940688|Canal Suporte Tecnico|26120942|Beatriz|6/19/2024 2:36 PM|1203|Josiele|Posto Jacarey|85|NOTA FISCAL |0||en|||yes||
1073187228|Active|1927940688|Canal Suporte Tecnico|25442318|Pedro Henrique|6/19/2024 12:22 PM|1915|wagner|posto mendes 4|85989442975|sistema|03018877000106||en|||yes||
1073176308|On Hold|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/19/2024 10:42 AM|11742|rogerio|cap 9|92369828|acs|02696818000973||en|||yes||
1073197012|Active|1927940688|Canal Suporte Tecnico|26091415|João Pedro|6/19/2024 1:22 PM|1287|Paulo Maria|posto 05 de outubro|85981719428|liberar cartao|247201880000144||en|||yes||
1073181002|Active|1927940688|Canal Suporte Tecnico|26120942|Beatriz|6/19/2024 11:31 AM|11874|Bruna|Da paz|85996555652|lançamento de nf-e |19277140000130||en|||yes||
1073211755|Waiting|1927940688|Canal Suporte Tecnico|0||6/19/2024 2:38 PM|1169|FLAVIANA |LVM|91218667|SISTEMA|44107080000154||en|||yes||
1073198088|Active|1927940688|Canal Suporte Tecnico|25442318|Pedro Henrique|6/19/2024 1:28 PM|4985|MYRNA|PBB|85997963442|DS10 ADITIVADO|05613385000186||en|||yes||
1073211492|Active|1927940688|Canal Suporte Tecnico|23890323|Jeferson Martins|6/19/2024 2:36 PM|1223|ANAILTON|RODAO2|981242022|ABASTECIMENTO|05352158000225||en|||yes||
1073185217|Active|1927940688|Canal Suporte Tecnico|23345104|Joaquim Carlos|6/19/2024 2:05 PM|2972|JARBAS|POSTO NS DE FATIMA|85997897319|SUPORTE |49821084000113||en|||||
1073198088|Active|1927940688|Canal Suporte Tecnico|24202697|Lopes|6/19/2024 2:52 PM|153|MYRNA|PBB|85997963442|DS10 ADITIVADO|05613385000186||en|||||`;

function inRespApi(input) {
    console.log(input)
    console.log(typeof input)

    // Split the text into lines
    const lines = input.split('\n').slice(2).filter(line => line.trim() !== '');
    console.log(lines.length)


    console.log(lines);

    // Extract headers
    const headers = lines[0].split('|');
    console.log(headers);

    // Map the rest of the lines into objects
    const objects = lines.slice(1).map(line => {
        const fields = line.split('|');
        const obj = {};
        headers.forEach((header, index) => {
            if (header === 'Language' || header === 'Custom Field 5' || header === 'Is Lead Technician' || header === 'HandingOff') {
                // console.log('EEEEEEEERRRRRRRRRRRROOOOOOOOOOOOOOOOUUUUUUUUUU')
            } else {
                obj[header.trim()] = fields[index];

            }
        });
        return obj;
    });
    
    let inBR = translateResp(objects,substituicoes)

    espera = inBR.filter((x) => x.Status === 'Waiting')
    // console.log(espera);
    incluidoTabelas(espera, 'espera')

    fila = inBR.filter((y) => {
        if (y.Status === 'Waiting') {
        } else {
            return y
        }
    }
    )
    incluidoTabelas(fila, 'fila')
}


async function fetchData() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = `https://secure.logmeinrescue.com/API/getSession_v3.aspx?node=15859053&noderef=CHANNEL&authcode=${code}`;
    const url = proxyUrl + targetUrl;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text(); // Assuming the response is in text format
        // document.getElementById('output').textContent = data;
        respData = inRespApi(data);
        // document.body.innerHTML += 
        incluidoTabelas(respData);
        // console.log(inRespApi(data));
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('output').textContent = `Error: ${error.message}`;
    }
}

async function getAuthCode() {
    const targetUrl = 'https://secure.logmeinrescue.com/API/requestAuthCode.aspx?email=lucas.acsinformatica@gmail.com&pwd=acs@2410';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = proxyUrl + targetUrl;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text(); // Assuming the response is in text format
        const authcode = extractAuthcode(data);
        localStorage.setItem('authcode', authcode);
        // document.getElementById('output').textContent = authcode;
        alert('atualizado o codigo')
        code = authcode
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('output').textContent = `Error: ${error.message}`;
    }
    
    function extractAuthcode(responseText) {
        const authcodePrefix = 'AUTHCODE:';
        const startIndex = responseText.indexOf(authcodePrefix);
        if (startIndex !== -1) {
            const authcode = responseText.substring(startIndex + authcodePrefix.length).trim();
            return authcode;
        }
        return 'AUTHCODE not found';
        
        
    }
}

// inRespApi(teste)

async function incluidoTabelas(array, isFila) {

    if (isFila === 'espera') {
        totalEspera = array.length
    }
    
    function removerChave(arr) {
        arr.forEach(obj => {
            delete obj['Entry ID'];
            delete obj['Entry'];
            delete obj['Técnico ID'];
            delete obj[''];
            if (isFila === 'espera') {
                delete obj['Técnico'];
                delete obj['Transferido Para'];
                delete obj['Comentário Transferido'];
            }
        });
        
    }
    
    removerChave(array);

    // Criar o cabeçalho da tabela
    let headers = Object.keys(array[0]).map((key) => {
        return `<th>${key}</th>`;
    }).join('');

    // Criar as linhas da tabela
    let rows = array.map((obj) => {
        let isDanger=false;
        let isAtive=false;
       if(obj['Tempo Espera'] > 2025 ){
        isDanger = true
       }
       if(obj['Status'] === 'Active' ){
        isAtive = true
       }
        let cells = Object.keys(obj).map((key) => {
            if(key === 'TELEFONE'){
                let whats = validadorTelefone(`${obj[key]}`)
                console.log(whats,'Deu bom o numero')
                if(whats === 'Numero invalido'){
                    return `<td>${whats}</td>`;
                }
                return `<td class='text-nowrap'><a href="https://api.whatsapp.com/send?phone=${whats}" target="_blank" >${whats}</a>
         <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="19" height="19" viewBox="0 0 32 32">
 <path fill-rule="evenodd" d="M 24.503906 7.503906 C 22.246094 5.246094 19.246094 4 16.050781 4 C 9.464844 4 4.101563 9.359375 4.101563 15.945313 C 4.097656 18.050781 4.648438 20.105469 5.695313 21.917969 L 4 28.109375 L 10.335938 26.445313 C 12.078125 27.398438 14.046875 27.898438 16.046875 27.902344 L 16.050781 27.902344 C 22.636719 27.902344 27.996094 22.542969 28 15.953125 C 28 12.761719 26.757813 9.761719 24.503906 7.503906 Z M 16.050781 25.882813 L 16.046875 25.882813 C 14.265625 25.882813 12.515625 25.402344 10.992188 24.5 L 10.628906 24.285156 L 6.867188 25.269531 L 7.871094 21.605469 L 7.636719 21.230469 C 6.640625 19.648438 6.117188 17.820313 6.117188 15.945313 C 6.117188 10.472656 10.574219 6.019531 16.054688 6.019531 C 18.707031 6.019531 21.199219 7.054688 23.074219 8.929688 C 24.949219 10.808594 25.980469 13.300781 25.980469 15.953125 C 25.980469 21.429688 21.523438 25.882813 16.050781 25.882813 Z M 21.496094 18.445313 C 21.199219 18.296875 19.730469 17.574219 19.457031 17.476563 C 19.183594 17.375 18.984375 17.328125 18.785156 17.625 C 18.585938 17.925781 18.015625 18.597656 17.839844 18.796875 C 17.667969 18.992188 17.492188 19.019531 17.195313 18.871094 C 16.894531 18.722656 15.933594 18.40625 14.792969 17.386719 C 13.90625 16.597656 13.304688 15.617188 13.132813 15.320313 C 12.957031 15.019531 13.113281 14.859375 13.261719 14.710938 C 13.398438 14.578125 13.5625 14.363281 13.710938 14.1875 C 13.859375 14.015625 13.910156 13.890625 14.011719 13.691406 C 14.109375 13.492188 14.058594 13.316406 13.984375 13.167969 C 13.910156 13.019531 13.3125 11.546875 13.0625 10.949219 C 12.820313 10.367188 12.574219 10.449219 12.390625 10.4375 C 12.21875 10.429688 12.019531 10.429688 11.820313 10.429688 C 11.621094 10.429688 11.296875 10.503906 11.023438 10.804688 C 10.75 11.101563 9.980469 11.824219 9.980469 13.292969 C 9.980469 14.761719 11.050781 16.183594 11.199219 16.382813 C 11.347656 16.578125 13.304688 19.59375 16.300781 20.886719 C 17.011719 21.195313 17.566406 21.378906 18 21.515625 C 18.714844 21.742188 19.367188 21.710938 19.882813 21.636719 C 20.457031 21.550781 21.648438 20.914063 21.898438 20.214844 C 22.144531 19.519531 22.144531 18.921875 22.070313 18.796875 C 21.996094 18.671875 21.796875 18.597656 21.496094 18.445313 Z"></path>
 </svg>
         </td>`;
            }else if(key === 'Status'){
                let newStatus = traduzirStatus(`${obj[key]}`)
                return `<td>${newStatus.toUpperCase()}</td>`;
            }else if(key === 'Técnico' && isAtive === true){
                tecnAtt.push(obj[key])
                return `<td>${obj[key].toUpperCase()}</td>`;
            }
            return `<td>${(obj[key].toUpperCase())}</td>`;
        }).join('');
        if(isDanger){
            return `<tr class="table-danger">${cells}</tr>`;
        }
        return `<tr>${cells}</tr>`;
    }).join('');
    document.getElementById(`${isFila}`).innerHTML = `<thead class='table-dark'><tr>${headers}</tr></thead><tbody>${rows}</tbody>`;
      setTimeout(renderTable,500)


}

function renderTable(){
    $(document).ready( function () {
        $('#espera').DataTable();
    } );
    
    $(document).ready( function () {
        $('#fila').DataTable();
    } );
totalFila = tecnAtt.length
    UpGraf()    
}


function validadorTelefone(numberTel) {
    let initNuber = numberTel.trim().indexOf('9')
    let initNuberOld = numberTel.trim().indexOf('8')
    let quantNumber = numberTel.trim().length


    if (quantNumber == 9 && initNuber == 0) {
        let newNumber = '5585' + numberTel.trim()
        return newNumber
    }

    if (quantNumber == 11 && initNuber == 2) {
        let newNumber = '55' + numberTel.trim()
        return newNumber
    }

    if (quantNumber == 8 && (initNuberOld == 0 || initNuber == 0) ) {
        let newNumber = '55859' + numberTel.trim()
        return newNumber
    }
    return 'Numero invalido'

}




//     let teste1 = attEspera.filter((x) => x.children[10])
//     console.log(teste1)

//     tabelaEspera.children[1].children[0].children[10].innerHTML = validadorTelefone(telefoneFilter)





//         <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="19" height="19" viewBox="0 0 32 32">
// <path fill-rule="evenodd" d="M 24.503906 7.503906 C 22.246094 5.246094 19.246094 4 16.050781 4 C 9.464844 4 4.101563 9.359375 4.101563 15.945313 C 4.097656 18.050781 4.648438 20.105469 5.695313 21.917969 L 4 28.109375 L 10.335938 26.445313 C 12.078125 27.398438 14.046875 27.898438 16.046875 27.902344 L 16.050781 27.902344 C 22.636719 27.902344 27.996094 22.542969 28 15.953125 C 28 12.761719 26.757813 9.761719 24.503906 7.503906 Z M 16.050781 25.882813 L 16.046875 25.882813 C 14.265625 25.882813 12.515625 25.402344 10.992188 24.5 L 10.628906 24.285156 L 6.867188 25.269531 L 7.871094 21.605469 L 7.636719 21.230469 C 6.640625 19.648438 6.117188 17.820313 6.117188 15.945313 C 6.117188 10.472656 10.574219 6.019531 16.054688 6.019531 C 18.707031 6.019531 21.199219 7.054688 23.074219 8.929688 C 24.949219 10.808594 25.980469 13.300781 25.980469 15.953125 C 25.980469 21.429688 21.523438 25.882813 16.050781 25.882813 Z M 21.496094 18.445313 C 21.199219 18.296875 19.730469 17.574219 19.457031 17.476563 C 19.183594 17.375 18.984375 17.328125 18.785156 17.625 C 18.585938 17.925781 18.015625 18.597656 17.839844 18.796875 C 17.667969 18.992188 17.492188 19.019531 17.195313 18.871094 C 16.894531 18.722656 15.933594 18.40625 14.792969 17.386719 C 13.90625 16.597656 13.304688 15.617188 13.132813 15.320313 C 12.957031 15.019531 13.113281 14.859375 13.261719 14.710938 C 13.398438 14.578125 13.5625 14.363281 13.710938 14.1875 C 13.859375 14.015625 13.910156 13.890625 14.011719 13.691406 C 14.109375 13.492188 14.058594 13.316406 13.984375 13.167969 C 13.910156 13.019531 13.3125 11.546875 13.0625 10.949219 C 12.820313 10.367188 12.574219 10.449219 12.390625 10.4375 C 12.21875 10.429688 12.019531 10.429688 11.820313 10.429688 C 11.621094 10.429688 11.296875 10.503906 11.023438 10.804688 C 10.75 11.101563 9.980469 11.824219 9.980469 13.292969 C 9.980469 14.761719 11.050781 16.183594 11.199219 16.382813 C 11.347656 16.578125 13.304688 19.59375 16.300781 20.886719 C 17.011719 21.195313 17.566406 21.378906 18 21.515625 C 18.714844 21.742188 19.367188 21.710938 19.882813 21.636719 C 20.457031 21.550781 21.648438 20.914063 21.898438 20.214844 C 22.144531 19.519531 22.144531 18.921875 22.070313 18.796875 C 21.996094 18.671875 21.796875 18.597656 21.496094 18.445313 Z"></path>
// </svg>
//         </td>`


//             if (tempoAtt >= 25 && sitFila == 'Esperando') {
//                 tabelaLinha.children[t].children[2].innerHTML += `
//              <a href="https://api.whatsapp.com/send?phone=${novoNumero}&text=${greetings}Sou%20o%20Lucas%20da%20ACS.%20Informamos%20que%20estamos%20com%20um%20pequeno%20atraso%20no%20atendimento%20no%20momento,%20mas%20em%20breve%20estaremos%20prontos%20para%20atend%C3%AA-lo.%20Pedimos%20desculpas%20pela%20espera%20e%20agradecemos%20pela%20sua%20paci%C3%AAncia." target="_blank" >
//             <svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 24 24" fill="none">
//             <g clip-path="url(#clip0_949_22799)">
//             <path fill-rule="evenodd" clip-rule="evenodd" d="M9.82664 2.22902C10.7938 0.590326 13.2063 0.590325 14.1735 2.22902L23.6599 18.3024C24.6578 19.9933 23.3638 22 21.4865 22H2.51362C0.63634 22 -0.657696 19.9933 0.340215 18.3024L9.82664 2.22902ZM10.0586 7.05547C10.0268 6.48227 10.483 6 11.0571 6H12.9429C13.517 6 13.9732 6.48227 13.9414 7.05547L13.5525 14.0555C13.523 14.5854 13.0847 15 12.554 15H11.446C10.9153 15 10.477 14.5854 10.4475 14.0555L10.0586 7.05547ZM14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18Z" fill="#000000"/>
//             </g>
//             <defs>
//             <clipPath id="clip0_949_22799">
//             <rect width="24" height="24" fill="white"/>
//             </clipPath> </defs> </svg> </a> `
//                 tabelaLinha.children[t].style.backgroundColor = 'pink';


function UpGraf() {
    console.log('PRODUZINDO')

    tecnAtt.forEach((x) => {
        var tec = tecnAtt.filter((t) => t == x)
        // console.log(tec, "tec do filter", tec[0])
        // console.log(tecTransf.indexOf(tec[0]), "indexOf")
        if (tecTransf.indexOf(tec[0]) === -1) {
            const addTec =
            {
                nome: tec[0],
                quantidade: tec.length
            }
            // console.log(addTec)
            // console.log('entrou no IF')
            attAtivo.push(addTec)
            tecTransf.push(tec[0])
        }
    }
    )
    // console.log(attAtivo)


    let myline1 = '<Td align="center" style="border: 2px #787373 solid;font-size: 19px; ">Tecnicos</Td>'
    let myline2 = '<Td align="center" style="border: 2px #787373 solid;font-size: 19px;">Quantidade</Td>'
    attAtivo.forEach((x => {
        myline1 += `<td align="center" style="border: 2px #787373 solid;font-size: 19px;">${x.nome}</td>`;
        myline2 += `<td align="center" style="border: 2px #787373 solid;font-size: 19px;">${x.quantidade}</td>`;
    }))
    myline1 += `<td align="center" style="border: 2px #787373 solid;font-size: 19px;">TOTAL DA ATENDIMENTO</td>
    <td align="center" style="border: 2px #787373 solid;font-size: 19px;">TOTAL DA FILA</td>`;
    myline2 += `<td align="center" style="border: 2px #787373 solid;font-size: 19px;">${totalFila}</td>
    <td align="center" style="border: 2px #787373 solid;font-size: 19px;">${totalEspera}</td>`;

    const navegacao = document.getElementById('graphic');
    
    // console.log(navegacao[0])
    navegacao.innerHTML = `<div id="mytablecount">
    <table class='table  table-dark table-sm table-hover table-striped rounded-2' width="1400px" align="center" style="border: 2px #787373 solid;font-size: 19px;" >
    <tr id="tablemyline1">
        ${myline1.toUpperCase()}
    </tr>
    <tr id="tablemyline2">
         ${myline2.toUpperCase()}
    </tr>
   </table></div>
  `

}