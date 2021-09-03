let ajaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';

function read() {
  let sp = new URLSearchParams();
  sp.append('f', 'READ');
  sp.append('n', 'LITVINOVICH__GAME');

  fetch(ajaxHandlerScript, { method: 'post', body: sp })
      .then(response => response.json())
      .then(data => { addArrScore(data); })
      .catch(error => { console.error(error); });
}

function addArrScore(arr) {
  let arrWrapper = document.querySelector('.tableWrapper');

  if (arrWrapper.children.length > 1) {
    while (arrWrapper.children.length !== 1) {
      arrWrapper.removeChild(arrWrapper.lastChild);
    }
  }

  if (arr.result !== '') {
    let newArr = JSON.parse(arr.result);

    let table = document.createElement('table');
    table.style.margin = 'auto';
    table.style.borderSpacing = '1vh 1vw';

    let tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for (let i = 0; i < newArr.length; i++) {
      let tr = document.createElement('tr');
      tableBody.appendChild(tr);

      let tdNumber = document.createElement('td');
      tdNumber.innerText = i + 1;
      tr.appendChild(tdNumber);
      let tdName = document.createElement('td');
      tdName.innerText = newArr[i].name;
      tr.appendChild(tdName);
      let tdScore = document.createElement('td');
      tdScore.innerText = newArr[i].score;
      tr.appendChild(tdScore);
    }

    arrWrapper.appendChild(table);
  }

  else {
    arrWrapper.append(document.createTextNode('There are no results in the record table'));
  }
}

function lockGet(pass) {
  scoreData = {name: nickText, score: newScore};

  let sp = new URLSearchParams();
  sp.append('f', 'LOCKGET');
  sp.append('n', 'LITVINOVICH__GAME');
  sp.append('p', pass);

  fetch(ajaxHandlerScript, { method: 'post', body: sp })
      .then(response => response.json())
      .then(data => { newArr(data); })
      .catch(error => { console.error(error); });
}

function newArr(data) {
  let newArr = data.result;
  arrScore = newArr;
  update(randPass);
}

function update(pass) {
  let newArray = JSON.parse(arrScore);
  newArray.push(scoreData)
  newArray = newArray.sort((item, nextItem)=>{return nextItem.score - item.score})
  scoreData = null;

  let arrJson = JSON.stringify(newArray);

  let sp = new URLSearchParams();
  sp.append('f', 'UPDATE');
  sp.append('n', 'LITVINOVICH__GAME');
  sp.append('p', pass);
  sp.append('v', arrJson);

  fetch(ajaxHandlerScript, {method: 'post', body: sp})
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
}