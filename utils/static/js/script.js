document.getElementById("input-get-data").addEventListener("click",() => {
    fetch("http://localhost:3000/getData")
    .then(response => response.json())
    .then(response => {
        document.getElementById("textarea-texto").value = response.text;
        let list = document.getElementById("box-list");
        list.innerHTML = '<span class="box__list__item">Resultados del analizador Lexico</span>';
        const {data} = response;
        for(const key in data){
            list.innerHTML += `<span class="box__list__item">De ${key} encontre ${data[key].count} ${data[key].data}</span>`;
        }
    })
    .catch(e => console.log(e));
});