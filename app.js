const api_url = "https://dev14.ageraehandel.se/sv/api/product";

async function getapi(url){
    const response = await fetch(url);
    var data =  await response.json();
    product_list = get_product_list(data);
    category_list = get_category_list(data);
    show(product_list, category_list);
}

var data = getapi(api_url);

function get_product_list(data){
    let product_list = [];
    for(let p of data.products){
        product_list.push(new Product(p.artiklar_benamning, p.pris, p.artikelkategorier_id, p.lagersaldo, p.momssats, p.valutor_id));
    }
    ordered_list = sort_by_name(product_list);
    return ordered_list;
}

function sort_by_name(list){
    return list.sort(function(a,b){
        var x = a.get_name();
        console.log(x);
        var y = b.get_name();
        if (x < y){
            return -1;
        }
        else if (x > y){
            return 1;
        }
        else{
            return 0;
        }
    });
}

function get_category_list(list){
    let category_list = [];
    for(let p of list.products){
        var category_name = p.artikelkategorier_id;
        if (typeof(category_name) == "undefined"){
            category_name = "Övrigt";
        }
        category_list.push(category_name);
    }

    // Remove duplicates
    function remove_duplicates(list){
        let unique = list.reduce(function(a, b){
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);
        return unique;
    }
    return remove_duplicates(category_list);
}

function get_price_list(list){
    let price_list = [];
    for(let p of list){
        price_list.push(p.get_price_VAT());
    }
    return price_list;
}


class Product{
    #name;
    #price;
    #category;
    #balance;
    #VAT;
    #currency;

    constructor(name, price, category, balance, VAT, currency){
        if (typeof(name) == "undefined"){
            this.#name = "Inget namn";
        }else{
            this.#name = name;
        }
        this.#price = price;
        if (typeof(category) == "undefined"){
            this.#category = "Övrigt";
        }else{
            this.#category = category;
        }
        this.#balance = balance;
        this.#VAT = VAT;
        this.#currency = currency;
    }

    get_name(){
        return this.#name;
    }

    get_price(){
        return this.#price;
    }

    get_category(){
        return this.#category;
    }

    get_balance(){
        return this.#balance;
    }

    get_VAT(){
        return this.#VAT;
    }

    get_currency(){
        return this.#currency;
    }

    get_price_VAT(){
        return this.#price + this.#price*this.#VAT/100;
    }

    is_in_stock(){
        if (this.get_balance() > 0){
            return true;
        }
        else{
            return false;
        }
    }

}

function create_table(products_list, category){
    var body = document.body;
    var tbl = document.createElement('table');
    var tr = tbl.insertRow();
    var td = tr.insertCell();
    td.style.width = '250px';
    var bold = document.createElement('strong');
    bold.appendChild(document.createTextNode("Namn"));
    td.appendChild(bold);
    var td = tr.insertCell();
    td.style.width = '100px';
    var bold = document.createElement('strong');
    bold.appendChild(document.createTextNode("Pris"));
    td.appendChild(bold);
    var td = tr.insertCell();
    td.style.width = '60px';
    var bold = document.createElement('strong');
    bold.appendChild(document.createTextNode("I Lager"));
    td.appendChild(bold);

    for(x = 0; x < products_list.length; x++){
        if(products_list[x].get_category() == category_list[i]){
            var tr = tbl.insertRow();
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(products_list[x].get_name()));
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(products_list[x].get_price_VAT()));
            var td = tr.insertCell();
            if (products_list[x].is_in_stock()){
                td.appendChild(document.createTextNode("Ja"));
            }
            else{
                td.appendChild(document.createTextNode("Nej"));
            }
        }
    }
    body.appendChild(tbl);
}

function show(products_list, category_list){
    var text = document.createElement('h2');
    text.appendChild(document.createTextNode("Vi har " + products_list.length  + " st produkter att erbjuda:"));
    var body = document.body;
    body.appendChild(text);

    for(i = 0; i < category_list.length; i++){
        body.appendChild(document.createElement("br"));
        var title = document.createElement('h3');
        body.appendChild(title.appendChild(document.createTextNode(category_list[i])));
        create_table(products_list, category_list[i]);
    }

    price_list = get_price_list(products_list);
    min = Math.min(...price_list);
    max = Math.max(...price_list);
    var text = document.createElement('p');
    text.appendChild(document.createTextNode("Billigaste produkten är: " + min  + " och dyraste är: " + max));
    body.appendChild(text);
}
