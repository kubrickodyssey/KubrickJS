#Kubrick JS
http://kubrickodyssey.com


---



[^1]: Esta Funcionalidad estara disponible en la version 0.8 beta.






##Visión General.
Kubrick JS, es un framework MVC escrito en javascript usando la tecnologia de **node.js**. Se compone de 3 modos de ejecución intercalables y sobreescribilbles.


###Modos de Ejecución.
Descripción rapida de los 3 modos de ejecución.

#### 1.- Archivos Estaticos.[^1]
Sistema de despachado de archivos estaticos ideal para proveer recursos web tales como **css**, **js**, **imagenes**, **html** etc, así como cualquier otro tipo de archivo que requiera ser descargado o accedido de forma estatica.

Cuando sea proveido un archivo de tipo **html** este sera renderizado antes de ser enviado al usuario utilizando el motor de renderizado de vistas incluido en **Kubrick JS** brindando la posibilidad de incluir acciones **javascript** como son **ciclos**, **condicionales** y demás acciones soportandas por **ejs**. De igual forma al ser renderizado este tipo de archivos, se podra acceder de forma predeterminada a las variables del sistema como son: **autenticacion** (usuario logueado, roles de acceso) y de modo predeterminado se podra acceder a un modelo de datos relacionado al archivo siempre y cuando este exista en nuestra base de datos, para que el acceso a datos este disponible en este modo, es necesario que exista un modelo de datos nombrado segun el nombre del archivo en ruta parcial segun el siguiente ejemplo:

	Ruta de archivo estatico: /public/ruta/de/mi/archivo.html
	Ruta de acceso al recurso desde http: http://hostname/ruta/de/mi/archivo.html
	
	Nombre de la Tabla a la que se podra acceder: ruta_de_mi_archivo
	Nombre del modelo mediante el cual se podra acceder: RutaDeMiArchivo
	

Este modo de acceso a datos combinado permite hacer uso de **javascript** desde el cliente, la cominicación de datos se realiza mediante **Socket I/O**.
	
	<script src="/socket.io/socket.js">
		Socket.on("data", function(RutaDeMiArchivo){
			for(var item in RutaDeMiArchivo){
				console.log(item);
			}
		});
	</script>
	
	
Para realizar busquedas y filtrado sobre los datos, lo hariamos de la siguiente forma.

	<script src="/socket.io/socket.js">
		Socket.emit("find",{id:99}, function(item){
			console.log(item);
		});
	</script>