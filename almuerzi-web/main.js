let mealsData=[]
let user = {}
let ruta = "login" // login , register , orders

const stringtoHTML = (s) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(s , "text/html")
    return doc.body.firstChild
}


const renderItem = (item) => {
    const elemento = stringtoHTML( `<li data-id="${item._id}">${item.name}</li>`)
   
    elemento.addEventListener("click", () => {
        const mealList = document.getElementById("meals-list")
        Array.from(mealList.children).forEach(x => x.classList.remove("selected"))
        elemento.classList.add("selected")
        const mealsIdInput = document.getElementById("meal-id")
        mealsIdInput.value = item._id
    })
    return elemento
}

const renderOrders = (order , meals) => {
    const meal = meals.find(meal => meal._id === order.meal_id)
    const elemento = document.createElement("div")
    elemento.innerHTML =  `<div data-id="${order._id}">
                                ${meal.name} - <strong> Cliente: </strong>${user.email}
                                <a href="#" class="btn btn-danger" name="borrar">Borrar</a>
                            </div>`
    elemento.classList.add("card","m-2","p-4")
    

    return elemento 
}

const inicializaFormulario = () => {
    const orderForm = document.getElementById("order")
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const input = document.getElementById("submit")
        input.setAttribute("disabled","")
        const mealId = document.getElementById("meal-id")
        const mealIdValue = mealId.value
        const tokenDos = localStorage.getItem("token")
        
        if (!mealIdValue) {
            input.removeAttribute("disabled")
            return alert("Debe seleccionar un plato")
        }

        const order = {
            meal_id: mealIdValue,
            user_id: user._id,
        }

        fetch("https://serverless.marianogarmendia.vercel.app/api/orders", {
            method: "POST",
            headers:{
                "content-type": "application/json",
                authorization: tokenDos,
            },
            body: JSON.stringify(order)
        }).then(x => x.json())
        .then(respuesta => {
            input.removeAttribute("disabled")
            const renderedOrders =  renderOrders(respuesta , mealsData)
            const ordersList = document.getElementById("orders-list")
            ordersList.appendChild(renderedOrders) 
        })
    }
}

const inicializaDatos = () => {
    fetch("https://serverless.marianogarmendia.vercel.app/api/meals")
    .then(response => response.json())
    .then(data => {
        mealsData = data;
        const mealList = document.getElementById("meals-list")
        const submit = document.getElementById("submit")
        const listItems = data.map(renderItem)
        mealList.removeChild(mealList.firstElementChild)
        listItems.forEach(element => mealList.appendChild(element))
        submit.removeAttribute("disabled")
        fetch("https://serverless.marianogarmendia.vercel.app/api/orders")
        .then(response => response.json())
        .then(ordersData => {
            const ordersList = document.getElementById("orders-list")
            const orderItem = ordersData.map(ordersData => renderOrders(ordersData , data)) 
            ordersList.removeChild(ordersList.firstElementChild)
            orderItem.forEach(element => ordersList.appendChild(element))
        })
    })
}

const renderApp = () => {
    const token = localStorage.getItem("token")
    if (token) {
        user = JSON.parse(localStorage.getItem("user"))
        const {email} = user
        return renderListOrders() 
    }
     
    renderLogin()
}
// ************* PROBANDO RENDER HOME ************ //
const renderHome = () => {
    const token = localStorage.getItem("token")
    if(token){
    const home = document.getElementById("home")
    document.getElementById("app").innerHTML = home.innerHTML
    const enlaceLogin = document.getElementById("logueate")
    enlaceLogin.addEventListener("click", () => renderApp())
    }
    renderApp()
}

const renderListOrders = () => {
    const ordersView = document.getElementById("orders-view")
    document.getElementById("app").innerHTML = ordersView.innerHTML
    inicializaFormulario(); 
    inicializaDatos(); 
    document.getElementById("orders-list").addEventListener("click", (event) => {
        deleteOrder(event.target)
    })
}

const renderLogin = () => {
    const loginTemplate = document.getElementById("login-template")
    document.getElementById("app").innerHTML = loginTemplate.innerHTML

    const formulario = document.getElementById("login-form");
    formulario.addEventListener("submit", () =>{
        event.preventDefault();
        const email = document.getElementById("usuario").value;
        const password = document.getElementById("contraseña").value;
             if(email =="" || password == ""){
                 if (email ==""){
                    return alert ("Completa el campo de email por favor")
                }else{
                   return alert("Ingresá una contraseña")
                }
            }
            fetch("https://serverless.marianogarmendia.vercel.app/api/auth/login", {
                method: "POST",
                headers: {
                    "content-type" : "application/json",
                },
                body: JSON.stringify({ email , password })
            }).then(response => response.json())
            .then(respuesta => {
                localStorage.setItem("token", respuesta.token)
                ruta = "orders";
                return respuesta.token
            })
            .then(token => {
             return fetch("https://serverless.marianogarmendia.vercel.app/api/auth/me",{
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        authorization: token,
                    },
                })
            })
            .then(x => x.json())
            .then(fetchedUser => {
                localStorage.setItem("user", JSON.stringify(fetchedUser))
                user = fetchedUser
                renderListOrders() // linea 112
            })
    })
}

const deleteFetchOrder = () => {
// fetch("https://serverless.marianogarmendia.vercel.app/api/orders)

}


const deleteOrder = (element) => {
    if (element.name === "borrar"){
        const elementDelete = element.parentElement.getAttribute("data-id")
        element.parentElement.parentElement.remove();

        // deleteFetchOrder(elementDelete)
    }
}

// **** CUANDO MI PAGINA CARGUE ***** 
window.onload = () => {

    renderHome() // ESTO ES NUEVO , RENDERIZO EL TEMPLATE DE LOGIN DIRECTAMENTE
    

    








    // fetch("https://serverless.marianogarmendia.vercel.app/api/auth/register", {
    //     method: "POST",
    //     headers:{
    //         "content-type": "application/json",
    //     },
    //     body: JSON.stringify({ email: "Joaquin@prueba.com" , password: "123456"})
    // })

    

}