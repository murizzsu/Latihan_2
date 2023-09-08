const filters = {
  searchText: "",
  stockMinimal: 1,
  priceMinimal: 0,
  priceMaximal: 0,
  size: "",
  stars: [1, 2, 3, 4, 5],
};

function createStars(totalStars) {
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push('<i class="fa fa-star text-warning"></i>');
  }
  for (let j = 5 - totalStars; j > 0; j--) {
    stars.push('<i class="fa fa-star text-secondary"></i>');
  }

  return stars;
}

function showProducts() {
  let productList = document.getElementById("product-list");
  let result = [];
  let search = new RegExp(filters.searchText, "gi");

  for (let i in products) {
    let product = products[i];
    let stars = createStars(product.stars);

    //stock 0 ilang
    if (product.stock < filters.stockMinimal) continue;

    //filter prodek yang harganya lebih besar dari price minimal
    if (filters.priceMinimal && !filters.priceMaximal) {
      if (product.price < filters.priceMinimal) continue;
    }

    //filter prodak yang harganya lebih kecil dari price maxsimal
    if (filters.priceMaximal && !filters.priceMinimal) {
      if (product.price > filters.priceMaximal) continue;
    }

    //prdouct yang harganya kisaran atau pada range price minimal dan price maksimal
    if (filters.priceMinimal && filters.priceMaximal) {
      if (
        product.price < filters.priceMinimal ||
        product.price > filters.priceMaximal
      )
        continue;
    }

    //aktifkan filter jika total yang dicentang antar 1 sd 4
    if (filters.stars.length > 0) {
      let valid = false;
      //variabel valid untuk menyatakan bahwa product akan dibuang atau tidak
      // jika true maka pertahankan
      //jika false maka productnya dibuang
      for (let s in filters.stars) {
        //jika dalam filter.stars terdapat product.star maka ubah vallid menjadi true. Misal isinya [1,2,3] dan product.star isinya 2, maka nilai valid akan menjadi true
        if (filters.stars[s] === product.stars) {
          valid = true;
          break;
        }
      }
      if (!valid) continue;
    }

    if (filters.size) {
      if (product.size !== filters.size) continue;
    }

    if (filters.searchText) {
        //jika product name dan description tidak match dengan apa yang dicari maka buang
        if (!product.name.match(search) && !product.description.match(search)) continue;
      }
      

    result.push(`
            <div class="col-lg-3 col-md-4 col-sm-6 col-12 mt-4">
                <div class="card" onclick="showDetail(this, ${i})">
                    
                    <img class="card-img-top" src="${product.image}" alt="${product.name}">
                    <div class="card-body">
                        <h4 class="card-title">${product.name}</h4>
                        <p class="text-success">Rp. ${product.price.toLocaleString()}</p> 
                        <p class="">Stock : ${product.stock}</p> 
                        <div class="row">
                            <div class="col-sm-8">${stars.join('')}</div>
                            <div class="col-sm-4"><i class="badge badge-secondary">${product.size}</i></div>
                        </div>
                    </div>
                </div>
            </div>`)
  }
  productList.innerHTML = result.join('')
}

function setStar(el, star) {
  if (el.checked) {
    filters.stars.push(star);
  } else {
    filters.stars.splice(filters.stars.indexOf(star), 1);
  }
  showProducts();
}

function sortPriceDescending(){
    products.sort(function(before,after){
        return before.price === after.price? 0 : before.price> after.price ? -1 : 1
    })
    showProducts()
}

function sortPriceAscending(){
    products.sort(function(before,after){
        return before.price === after.price? 0 : before.price> after.price ? 1 : -1
    })
    showProducts()
}

function onSearch(value){
    filters.searchText = value
    showProducts()
}

function changeSize(size){
    filters.size = size
    showProducts()
}

function changePriceMin(value) {
    filters.priceMinimal = parseFloat(value)

    showProducts()
}

function changePriceMax(value) {
    filters.priceMaximal = parseFloat(value)

    showProducts()
}

function modalVisible(show) {
    let modal = document.getElementById('myModal')
    let backdrop = document.getElementById('modal-backdrop')

    if (show) {
        modal.classList.add('show')
        backdrop.classList.add('show')
        document.body.classList.add('modal-open')
    } else {
        modal.classList.remove('show')
        backdrop.classList.remove('show')
        document.body.classList.remove('modal-open')
    }
}

document.querySelectorAll('[data-dismiss="modal"]').forEach(b => {
    b.onclick = () => modalVisible(false)
})

function showDetail(dom, index) {
    let product = products[index]
    let title = document.getElementById('modal-title')
    let detail = document.getElementById('modal-body')
    let description = document.getElementById('modal-description')

    detail.innerHTML = dom.innerHTML
    description.innerHTML = product.description
    title.innerHTML = product.name
    
    modalVisible(true)
}



showProducts()