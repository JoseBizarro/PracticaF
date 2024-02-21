$(function(){
    console.log("jQuery funcionando...");
    // Obtén todos los elementos con la clase 'oculto'
    var elementosOcultos = document.querySelectorAll('.oculto');

    // Oculta cada elemento
    elementosOcultos.forEach(function(elemento) {
        elemento.style.display = 'none';
    });

    var user;
    const firebaseConfig = {
        apiKey: "AIzaSyAQhq2XTFqUm1lHESp9Xp3tj7QvPEpHMu8",
        authDomain: "computo-dfc3d.firebaseapp.com",
        projectId: "computo-dfc3d",
        storageBucket: "computo-dfc3d.appspot.com",
        messagingSenderId: "68737606935",
        appId: "1:68737606935:web:85ea3c20867af54ac6c352",
        measurementId: "G-G99NM8E0CC"
    };

    firebase.initializeApp(firebaseConfig);

    $('#crearUsuario').click(function(){
      console.log("Presiono el boton de crear usuario");

      let email = $('#InputEmail').val();
      let password1 = $('#InputPassword1').val(); 
      let password2 = $('#InputPassword2').val(); 
      if(email.length == 0) {
        alert("Debe ingresar Correo Electronico");
      }else if(password1.length == 0){
        alert("Debe ingresar Password");
      }else if(password2.length == 0){
        alert("Debe confirmar password");
      }else if(password1 != password2){
        alert("El password no coincide");
      }else{
        //Se necesita contraseña de 6 caracteres
        console.log("Creando usuario en firebase: " + email + ", " + password1);

        firebase.auth().createUserWithEmailAndPassword(email, password1)
      .then((userCredential) => {
        // Signed in 
        user = userCredential.user;
        alert("Usuario creado correctamente");
        console.log("Usuario Creado en firebase.");
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Verifique sus datos");
        console.log("Error al crear usuario en firebase.: \nError Code: " + errorCode + "\nError Message: " + errorMessage);
        // ..
      });
      }
    })

    $('#loginUsuario').click(function(){
      console.log("Se presiono el boton de login")
      let email = $('#InputEmail2').val();
      let password = $('#InputPassword').val();
      if(email.length == 0) {
        alert("Debe ingresar Correo Electronico");
      }else if(password.length == 0){
        alert("Debe ingresar Password");
      }else{
        //Inicio de sesion
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          user = userCredential.user;
          alert("Inicio de sesion correcto en firebase");
          console.log("Inicio de sesion correcto en firebase");
          // console.log(user);
          location.href='index.html?email='+email+'&password='+password+'';
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error al crear usuario en firebase.: \nError Code: " + errorCode + "\nError Message: " + errorMessage);
        });
      }
    })
    
    $('#loginOut').click(function(){
      console.log("Presiono el boton de cerrar sesion");
      firebase.auth().signOut().then(function(){
        console.log("Cerraste sesion");
        location.href='login.html';
      }).catch(function(error){
        console.log("Error al cerrar sesion: "+error);
      })
    })

    // window.$_GET = new URLSearchParams(location.search);
    // var email = $_GET.get('email');
    // var password = $_GET.get('password');
    // console.log(email+ ", "+password);

    if($('#home').attr('class') == 'paginaHome') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/v8/firebase.User
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          if(emailVerified){
            $('#userDetalles').html(`
              <h4>Id:`+ uid +`</h4>
              <h4>Nombre:`+ displayName +`</h4>
              <h4>Correo:`+ email +`</h4>
              <h4>Correo Verificado:`+ emailVerified +`</h4>
              <h4>Es anonimo:`+ isAnonymous +`</h4>
              <img src="`+photoURL+`" width="200">
            `);
            $('#controlUser').removeClass('oculto');
          }else{
            $('#userDetalles').html(`
              <h4>Debe Verificar su cuenta</h4>
              <h4>Un vinculo ha sido enviado a su correo electronico</h4>
               
            `);
            var user =firebase.auth().currentUser;
            user.sendEmailVerification().then(function(){
              //Email enviado
              alert("Vinculo enviado a su correo");
            }).catch(function(error){
              console.log("Error al compartir vinculo: "+ error);
            })
          }
        }
        
          // ...
        // } else {
        //   // User is signed out
        //   alert("No ha iniciado sesion");
        //   location.href='index.html';
        //   // ...
        // }
      });
    }

    $('#actualizar').click(function(){
      console.log("Presiono el boton de actualizar");
      location.href='actualizar.html';
    });

    $('#actualizarPass').click(function(){
      console.log("Presiono el boton de actualizar contraseña");
      location.href='actualizarPassword.html';
    })

    $('#guardar').click(function(){
      console.log("Presiono el boton de guardar");
      if($('#Nombre').val().length  == 0) {
        alert("Debe ingresar Nombre de usuario");
      }else if($('#fotoUsuario').val().length == 0){
        alert("Debe ingresar foto de perfil");
      }else{
        var user=firebase.auth().currentUser;
        user.updateProfile({
          displayName: $('#Nombre').val(),
          photoURL: $('#fotoUsuario').val()
        }).then(function(){
          console.log("Datos actualizados correctamente");
          location.href='home.html'
        }).catch(function(error){
          console.log("Error al actualizar: " + error);
        });
      }
    })

    $('#cancelarDetalles').click(function(){
      console.log("Presiono el boton de cancelar");
      location.href='home.html';
    })

    if($('#login').attr('class') == 'paginaLogin') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          location.href='index.html';
          // ...
        }
      });
    }

    if($('#actualizarPagina').attr('class') == 'paginaActualizar') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user == null) {
          location.href='home.html';
          // ...
        }
      });
    }

    $('#regresar').click(function(){
      console.log('Presiono el boton de regresar');
      location.href='index.html';
    })

    $('#guardarPassword').click(function(){
      console.log("Presiono el boton de guardar");
      let password1 = $('#password').val(); 
      let password2 = $('#ConfPass').val();
      let passwordActual = $('#currPassword').val();
      if(passwordActual.length == 0){
        alert("Ingresa la contraseña actual")
      }else if(password1.length == 0){
        alert("Debe ingresar Contraseña Actual");
      }else if(password2.length == 0){
        alert("Debe ingresar Contraseña Nueva");
      }else if(password1 != password2){
        alert("La contraseña Nueva y la confirmacion no coinciden");
      }else{
        firebase.auth().onAuthStateChanged(function(user){
          var currentPassword = $('#currPassword').val();
          var newPassword = $('#password').val();
          const credential =firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
          )
          user.reauthenticateWithCredential(credential).then(function(){
            user.updatePassword(newPassword).then(() => {
              // Update successful.
              alert("Contraseña Actualizada Exitosamente")
              location.href='home.html';
            }).catch((error) => {
              // An error ocurred
              // ...
              console.log("Error al actualizar contraseña: " + error);
            });
          }).catch(function(error){
            console.log("Error al actualizar contraseña: " + error);
          })
        })
      }
    })


})