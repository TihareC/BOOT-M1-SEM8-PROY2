// ESTA SECCION DE JAVASCRIPT ES MAS COMPLEJA, ASI QUE DESPUES TE LA EXPLICO
window.addEventListener("DOMContentLoaded", function () {
    cargarDatosDesdeLocalStorage();
    document.getElementById('formulario').addEventListener("submit", function (e) {
        if (e.preventDefault) e.preventDefault();
        
        const imagen = document.getElementsByName('imagen')[0];
        if(imagen.files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                agregarPostDesdeFormulario(e, reader.result);
            };
            reader.readAsDataURL(imagen.files[0]);
        }
        else {
            agregarPostDesdeFormulario(e);
        }
        return false;
    });
});

function agregarPostDesdeFormulario(e, imagenNueva) {
    const data = new FormData(e.target);
    const id = data.get('id');
    const imagenRespaldo = data.get('imagenRespaldo');
    agregarPost({
        id: id && id > 0 ? id : Math.floor(Math.random() * 9999),
        titulo: data.get('titulo'),
        descripcion: data.get('descripcion'),
        imagen: imagenNueva ? imagenNueva : imagenRespaldo
    }, true);

    document.getElementById("titulo").value = '';
    document.getElementById("descripcion").value = '';
    document.getElementById("imagen").value = '';
    document.getElementById("imagenRespaldo").value = '';
    document.getElementById("id").value = '0';
    document.getElementById("imagenVistaPrevia").src = '';
}
// *******************************************************************************************************
function agregarPost(postConDatos, guardar) {
    // CREAR DIV PADRE "blog-post"
    var blogPost = document.createElement("div");
    blogPost.className = "blog-post";

    // CREAR DIV DE IMAGEN "blog-post-imagen"
    var blogPostImagen = document.createElement("div");
    blogPostImagen.className = "blog-post-imagen";

    // CREAR DIV DE TEXTOS "blog-post-texto"
    var blogPostTexto = document.createElement("div");
    blogPostTexto.className = "blog-post-texto";

    // CREAR DIV DE BOTONES "blog-post-botones"
    var blogPostBotones = document.createElement("div");
    blogPostBotones.className = "blog-post-botones";

    // AGREGAR DIV DE IMAGEN, TEXTOS Y BOTONES AL DIV PADRE
    blogPost.appendChild(blogPostImagen);
    blogPost.appendChild(blogPostTexto);
    blogPost.appendChild(blogPostBotones);

    // CREAR IMAGEN
    var imagen = document.createElement("img");
    imagen.src = postConDatos.imagen;
    imagen.alt = "SIN IMAGEN";

    // AGREGAR IMAGEN AL DIV DE IMAGEN
    blogPostImagen.appendChild(imagen);

    // CREAR TITULO
    var titulo = document.createElement("h2");
    titulo.innerHTML = postConDatos.titulo;

    // CREAR TEXTO
    var texto = document.createElement("span");
    texto.innerHTML = postConDatos.descripcion;

    // AGREGAR TITULO Y TEXTO AL DIV DE TEXTOS
    blogPostTexto.appendChild(titulo);
    blogPostTexto.appendChild(texto);

    // AGREGAR DIV PADRE AL DIV DE POSTEOS
    var blogPosteos = document.getElementsByClassName("blog-posteos")[0];
    blogPosteos.appendChild(blogPost);

    // AGREGAR BOTONES
    var imagen = document.createElement("img");
    imagen.src = "imagenes/editar.png";
    var botonEditar = document.createElement("a");
    botonEditar.innerHTML = "Editar";
    botonEditar.className = "boton-post6";
    botonEditar.href = "javascript:void(0)";
    botonEditar.onclick = function() {
        editarPost(postConDatos.id);
    };
    botonEditar.prepend(imagen);
    blogPostBotones.appendChild(botonEditar);

    var imagen = document.createElement("img");
    imagen.src = "imagenes/eliminar.png";
    var botonEliminar = document.createElement("a");
    botonEliminar.innerHTML = "Eliminar";
    botonEliminar.className = "boton-post";
    botonEliminar.href = "javascript:void(0)";
    botonEliminar.onclick = function() {
        eliminarPost(postConDatos.id);
    };
    botonEliminar.prepend(imagen);
    blogPostBotones.appendChild(botonEliminar);

    if (guardar)
        guardarEnLocalStorage(postConDatos);
}

// GUARDAR POSTEOS EN LOCAL STORAGE
function guardarEnLocalStorage(postConDatos) {
    console.log(postConDatos);
    const datos = localStorage.getItem("posteos");
    const listaDatos = !datos ? new Array() : JSON.parse(datos);
    let existe = false;
    for (let i = 0; i < listaDatos.length; i++) {
        if (listaDatos[i].id == postConDatos.id) {
            listaDatos[i] = postConDatos;
            existe = true;
            break;
        }
    }
    if(!existe) {
        listaDatos.push(postConDatos);
    }
    localStorage.setItem("posteos", JSON.stringify(listaDatos));
    cargarDatosDesdeLocalStorage();
}

// EDITAR POST
function editarPost(id) {
    const datos = localStorage.getItem("posteos");
    const listaDatos = !datos ? new Array() : JSON.parse(datos);
    for (let i = 0; i < listaDatos.length; i++) {
        if (listaDatos[i].id == id) {
            document.getElementById("titulo").value = listaDatos[i].titulo;
            document.getElementById("descripcion").value = listaDatos[i].descripcion;
            document.getElementById("imagenRespaldo").value = listaDatos[i].imagen;
            document.getElementById("id").value = listaDatos[i].id;
            document.getElementById("imagenVistaPrevia").src = listaDatos[i].imagen;
            break;
        }
    }
}

// LIMPIAR POSTEOS HTML
function eliminarPost(id) {
    const datos = localStorage.getItem("posteos");
    const listaDatos = !datos ? new Array() : JSON.parse(datos);
    for (let i = 0; i < listaDatos.length; i++) {
        if (listaDatos[i].id == id) {
            listaDatos.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("posteos", JSON.stringify(listaDatos));
    cargarDatosDesdeLocalStorage();
}

// CARGAR POSTEOS DESDE LOCAL STORAGE CUANDO LA PAGINA RECIEN CARGA
function cargarDatosDesdeLocalStorage() {
    limpiarPosts();
    const datos = localStorage.getItem("posteos");
    const listaDatos = !datos ? new Array() : JSON.parse(datos);
    listaDatos.forEach(function (post) {
        agregarPost(post, false);
    });
}

// LIMPIAR POSTEOS HTML
// A VECES CUANDO RECARGAS LA PAGINA 2 O MAS VECES SE DUPLICAN LOS POSTEOS EN EL HTML
function limpiarPosts() {
    var blog = document.getElementsByClassName("blog-posteos")[0];
    while(blog.firstChild) {
        blog.removeChild(blog.firstChild);
    };
}