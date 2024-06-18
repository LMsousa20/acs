document.getElementById('fetchDataBtn2').addEventListener('click', fetchData2);
document.getElementById('fetchDataBtn').addEventListener('click', fetchData);
let code = ''

let teste = `OK

ID|Status|Entry ID|Entry|Technician ID|Technician|Start Time|Waiting Time|Custom Field 0|Custom Field 1|Custom Field 2|Custom Field 3|Custom Field 4|Custom Field 5|Language|Transferred To|Transferred Comment|Is Lead Technician|HandingOff|
1072770019|Encerrado pelo cliente ativo|1927940688|Canal Suporte Tecnico|25581488|Igor Queiroz|6/18/2024 12:49 AM|802|LUCAS|ACS|988952508|PROBLEMA SERIO|9||en|||sim||
1072646486|Encerrado pelo cliente que estava esperando|1927940688|Canal Suporte Tecnico|24764772|Davi|6/17/2024 2:54 PM|25402|DAIANA|DALLAS|85992624804|CONEXÃO COM LUCAS MONTEIRO|42471000000110||en|||sim||
1072721727|Ativas|1927940688|Canal Suporte Tecnico|24202697|Lopes|6/17/2024 6:03 PM|23692|KARLA|POSTO CEARA 4|998357401|CADASTRAR PRODUTOS E COMPONENTES|09419548000145||en|||sim||
1072727431|Encerrado pelo cliente ativo|1927940688|Canal Suporte Tecnico|24202692|Bianca Menezes|6/17/2024 6:32 PM|4014|MICAELA|POSTO LADEIRA|88994084927|ARQUIVO FISCAIS|1||en|||sim||
1072736584|Encerrado pelo cliente que estava esperando|1927940688|Canal Suporte Tecnico|25581512|Juan Pablo|6/17/2024 7:20 PM|14217|mauricio|posto peixoto|88996198810|bico 2 paro de funcionar|04140311000107||en||Bico não tá liberando o combustivel|sim||
`;

function pipeToObjects(input) {
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
            console.log(header)
            if(header === 'Language' || header === 'Custom Field 5' || header === 'Is Lead Technician' || header === 'HandingOff'){
                console.log('EEEEEEEERRRRRRRRRRRROOOOOOOOOOOOOOOOUUUUUUUUUU')
            }else{
                obj[header.trim()] = fields[index];

            }
        });
        return obj;
    });

    console.log(objects);
    
    return objects
}

pipeToObjects(teste)

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
        document.getElementById('output').textContent = data;
        pipeToObjects(data);
        // console.log(pipeToObjects(data));
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('output').textContent = `Error: ${error.message}`;
    }
}

async function fetchData2() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://secure.logmeinrescue.com/API/requestAuthCode.aspx?email=lucas.acsinformatica@gmail.com&pwd=acs@2410';
    const url = proxyUrl + targetUrl;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text(); // Assuming the response is in text format
        const authcode = extractAuthcode(data);
        document.getElementById('output').textContent = authcode;
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




// Suponha que você tenha um objeto JavaScript como este:



// Você pode usar este código para transformá-lo em uma tabela HTML:
function arrayToTable(array) {
    // Criar o cabeçalho da tabela
    const headers = Object.keys(array[0]).map((key) => {
        
      return `<th>${key}</th>`;
        
    }).join('');
    
    // Criar as linhas da tabela
    const rows = array.map((obj) => {
      const cells = Object.keys(obj).map((key) => {
        return `<td>${obj[key]}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    return `<table id="myTable" class="display table table-dark table-hover"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    
  }


document.body.innerHTML += arrayToTable(pipeToObjects(teste));



